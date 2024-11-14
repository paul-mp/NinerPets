import os, logging
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from models import db, User, Vet, Pet, Medication, Billing, Appointment, Record # Import the db and models
from dotenv import load_dotenv
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, JWTManager

load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey')  
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # For cross-origin session cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS, False otherwise (especially on localhost)

jwt = JWTManager(app)

db.init_app(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

def get_medications_by_user_id(user_id, db):
    return (
        db.session.query(Medication, Pet.name.label("pet_name"))  
        .join(Pet, Medication.pet_id == Pet.id)  
        .filter(Medication.user_id == user_id)
        .all()
    )

# Define routes
@app.route('/')
def home():
    return "Welcome to NinerPets!"

from flask_jwt_extended import create_access_token

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email_or_username = data.get('email_or_username')
    password = data.get('password')

    user = User.query.filter(
        (User.email == email_or_username) | (User.username == email_or_username)
    ).first()

    if user and user.check_password(password):
        token = create_access_token(identity=user.id)
        return jsonify({'message': 'Login successful', 'token': token}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
    
@app.route('/current_user', methods=['GET'])
def current_user():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])  
        return jsonify({'user_id': user.id, 'username': user.username}), 200
    return jsonify({'error': 'Not logged in'}), 401

@app.route('/register', methods=['OPTIONS', 'POST'])
def register():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.json
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')

    # Check if email is valid and ends with charlotte.edu or uncc.edu
    if not email.endswith("@charlotte.edu") and not email.endswith("@uncc.edu"):
        return jsonify({"error": "Invalid email domain. Only charlotte.edu or uncc.edu emails are allowed."}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'Email already registered'}), 400

    # Create and save the new user, make sure to hash the password
    new_user = User(email=email, username=username)
    new_user.set_password(password) 
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/vets', methods=['GET'])
def get_vets():
    vets = Vet.query.all()  
    return jsonify([vet.to_dict() for vet in vets]) 

from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/user', methods=['GET'])
@jwt_required()  
def get_user():
    try:
        current_user_id = get_jwt_identity()  
        if not current_user_id:
            return jsonify({"msg": "Missing claim: sub"}), 422

        user = User.query.get(current_user_id)
        if user:
            return jsonify({
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }), 200
        else:
            return jsonify({"msg": "User not found"}), 404

    except Exception as e:
        return jsonify({"msg": f"Error: {str(e)}"}), 500

@app.route('/get_username', methods=['GET'])
def get_username():
    if 'user_id' in session:
        user_id = session['user_id']
        user = User.query.get(user_id)
        if user:
            return jsonify({'username': user.username})
    return jsonify({'username': None}), 401

@app.route('/add_vet', methods=['POST'])
def add_vet():
    data = request.json
    name = data.get('name')
    specialty = data.get('specialty')
    information = data.get('information')

    new_vet = Vet(name=name, specialty=specialty, information=information)
    db.session.add(new_vet)
    db.session.commit()

    return jsonify({'message': 'Vet added successfully'}), 201

@app.route('/pets', methods=['GET'])
def get_pets():
    user_id = request.args.get('user_id')
    if user_id:
        pets = Pet.query.filter_by(user_id=user_id).all()
        return jsonify([pet.to_dict() for pet in pets])
    return jsonify({'error': 'User ID is required'}), 400

@app.route('/pets', methods=['POST'])
def add_pet():
    data = request.json
    user_id = data.get('user_id')
    name = data.get('name')
    species = data.get('species')
    breed = data.get('breed')
    dob = data.get('dob')
    weight = data.get('weight')

    if not all([name, species, breed, dob, weight, user_id]):
        return jsonify({'error': 'All fields are required.'}), 400

    new_pet = Pet(user_id=user_id, name=name, species=species, breed=breed, dob=dob, weight=weight)
    db.session.add(new_pet)
    db.session.commit()

    return jsonify({'message': 'Pet added successfully'}), 201

@app.route('/pets/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    data = request.json
    pet = Pet.query.get_or_404(pet_id)

    pet.name = data.get('name', pet.name)
    pet.species = data.get('species', pet.species)
    pet.breed = data.get('breed', pet.breed)
    pet.dob = data.get('dob', pet.dob)
    pet.weight = data.get('weight', pet.weight)

    db.session.commit()
    return jsonify({'message': 'Pet updated successfully'}), 200

@app.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'message': 'Pet not found'}), 404

    medications = Medication.query.filter_by(pet_id=pet_id).all()
    for med in medications:
        db.session.delete(med)

    billing_entries = Billing.query.filter_by(pet_id=pet_id).all()
    for billing in billing_entries:
        db.session.delete(billing)

    records = Record.query.filter_by(pet_id=pet_id).all()
    for record in records:
        db.session.delete(record)

    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Pet and associated medications deleted successfully'}), 200

@app.route('/medications', methods=['POST'])
def add_medication():
    data = request.json
    pet_id = data.get('pet_id')
    user_id = data.get('user_id')
    name = data.get('name')
    dosage = data.get('dosage')
    description = data.get('description')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    side_effects = data.get('side_effects')
    instructions = data.get('instructions')
    refill = data.get('refill', False)

    if not all([pet_id, user_id, name, dosage, start_date]):
        return jsonify({'error': 'All fields except end date are required.'}), 400
    
    if end_date:
        try:
            start_date_dt = datetime.strptime(start_date, '%Y-%m-%d')
            end_date_dt = datetime.strptime(end_date, '%Y-%m-%d')
            if end_date_dt < start_date_dt:
                return jsonify({'error': 'End date cannot be before start date.'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 400

    new_medication = Medication(
        pet_id=pet_id,
        user_id=user_id,
        name=name,
        dosage=dosage,
        description=description,
        start_date=start_date,
        end_date=end_date,
        side_effects=side_effects,
        instructions=instructions,
        refill=refill
    )
    
    db.session.add(new_medication)
    db.session.commit()

    return jsonify({'message': 'Medication added successfully'}), 201

@app.route('/medications', methods=['GET'])
def get_medications():
    user_id = request.args.get('user_id', type=int)  
    if user_id is None:
        return jsonify({"error": "user_id is required"}), 400

    medications = get_medications_by_user_id(user_id, db)  
    response = [
        {
            **medication.to_dict(),  
            "pet_name": pet_name  
        }
        for medication, pet_name in medications
    ]

    return jsonify(response)  

@app.route('/medications/<int:medication_id>', methods=['DELETE'])
def delete_medication(medication_id):
    medication = Medication.query.get(medication_id)
    if medication is None:
        return jsonify({'message': 'Medication not found'}), 404
    db.session.delete(medication)
    db.session.commit()
    return jsonify({'message': 'Medication deleted successfully'}), 200

@app.route('/medications/<int:medication_id>', methods=['PUT'])
def update_medication(medication_id):
    data = request.json
    print("Updating medication with ID:", medication_id)
    print("Received data:", data)

    medication = Medication.query.get_or_404(medication_id)

    print("Current medication state before update:", {
        'name': medication.name,
        'dosage': medication.dosage,
        'description': medication.description,
        'start_date': medication.start_date,
        'end_date': medication.end_date,
        'side_effects': medication.side_effects,
        'instructions': medication.instructions,
        'refill': medication.refill,
        'pet_id': medication.pet_id,
    })

    medication.name = data['name']
    medication.dosage = data['dosage']
    medication.description = data['description']
    medication.start_date = data['start_date']
    medication.pet_id = data['pet_id']
    
    end_date_input = data.get('end_date')
    medication.end_date = None if end_date_input == "Ongoing" else end_date_input

    medication.side_effects = data['side_effects']
    medication.instructions = data['instructions']
    medication.refill = data['refill']

    if medication.start_date:
        try:
            start_date_dt = datetime.strptime(medication.start_date, '%Y-%m-%d')
            if medication.end_date:  
                end_date_dt = datetime.strptime(medication.end_date, '%Y-%m-%d')
                if end_date_dt < start_date_dt:
                    return jsonify({'error': 'End date cannot be before start date.'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 400

    db.session.commit()
    return jsonify({'message': 'Medication updated successfully'}), 200

@app.route('/pets/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    print(f"Fetching pet with ID: {pet_id}")  
    pet = Pet.query.get(pet_id)
    if pet is None:
        print(f"Pet with ID {pet_id} not found.")  
        return jsonify({'error': 'Pet not found'}), 404
    return jsonify(pet.to_dict()), 200

@app.route('/billing', methods=['POST'])
def add_billing():
    data = request.json
    user_id = data.get('user_id')
    pet_id = data.get('pet_id')
    billing_type = data.get('type')
    price = data.get('price')
    description = data.get('description')
    date = data.get('date')

    if not all([pet_id, billing_type, price, description, user_id]):
        return jsonify({'error': 'All fields are required.'}), 400

    pet = Pet.query.filter_by(id=pet_id).first()
    if not pet:
        return jsonify({'error': 'Pet not found.'}), 404

    new_billing = Billing(
        user_id=user_id,
        pet_id=pet_id,
        type=billing_type,
        price=price,
        description=description,
        date=date,
        created_at=datetime.utcnow()
    )

    db.session.add(new_billing)
    db.session.commit()

    response_data = {
        'id': new_billing.id,
        'user_id': new_billing.user_id,
        'pet_id': new_billing.pet_id,
        'type': new_billing.type,
        'price': new_billing.price,
        'description': new_billing.description,
        'date': new_billing.date,
        'created_at': new_billing.created_at.isoformat(),
        'pet_name': pet.name 
    }

    print(f"Billing added: {new_billing}")  
    return jsonify(response_data), 201

@app.route('/billing', methods=['GET'])
def get_billing():
    user_id = request.args.get('user_id')
    billing_entries = Billing.query.filter_by(user_id=user_id).all()
    
    results = [{
        'id': entry.id,
        'user_id': entry.user_id,
        'pet_id': entry.pet_id,
        'type': entry.type,
        'price': entry.price,
        'description': entry.description,
        'date': entry.date.strftime('%Y-%m-%d'),  
        'pet_name': entry.pet.name  
    } for entry in billing_entries]

    return jsonify(results)

@app.route('/billing/<int:billing_id>', methods=['DELETE'])
def delete_billing(billing_id):
    billing_entry = Billing.query.get(billing_id)
    if billing_entry is None:
        return jsonify({'message': 'Billing entry not found'}), 404

    db.session.delete(billing_entry)
    db.session.commit()

    return jsonify({'message': 'Billing entry deleted successfully'}), 200

@app.route('/billing/<int:billing_id>', methods=['PUT'])
def update_billing(billing_id):
    data = request.json
    print("Updating billing entry with ID:", billing_id)
    print("Received data:", data)
    billing_entry = Billing.query.get_or_404(billing_id)

    billing_entry.pet_id = data.get('pet_id', billing_entry.pet_id)  
    billing_entry.type = data['type']  
    billing_entry.price = data['price']  
    billing_entry.description = data['description']  
    billing_entry.date = data['date']  

    db.session.commit()
    response_data = {
        'id': billing_entry.id,
        'user_id': billing_entry.user_id,
        'pet_id': billing_entry.pet_id,
        'type': billing_entry.type,
        'price': billing_entry.price,
        'description': billing_entry.description,
        'date': billing_entry.date.strftime('%Y-%m-%d'),  
        'pet_name': billing_entry.pet.name  
    }

    print(f"Billing updated: {response_data}")  
    return jsonify({'message': 'Billing entry updated successfully', 'billing': response_data}), 200

@app.route('/appointments', methods=['POST'])
def add_appointment():
    data = request.json
    user_id = data.get('user_id')
    pet_id = data.get('pet_id')
    vet_id = data.get('vet_id')  
    reason = data.get('reason')
    date = data.get('date')
    time = data.get('time')
    location = data.get('location')
    notes = data.get('notes')

    if not all([user_id, pet_id, vet_id, reason, date, time, location]):
        return jsonify({'error': 'All fields are required.'}), 400

    try:
        datetime.strptime(date, '%Y-%m-%d')  
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    try:
        datetime.strptime(time, '%H:%M')  
    except ValueError:
        return jsonify({'error': 'Invalid time format. Use HH:MM.'}), 400
      
    new_appointment = Appointment(
        user_id=user_id,
        pet_id=pet_id,
        vet_id=vet_id,
        reason=reason,
        date=date,
        time=time,
        location=location,
        notes=notes
    )

    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({'message': 'Appointment added successfully'}), 201

@app.route('/medicalrecords', methods=['POST'])
def add_record():
    data = request.json
    pet_id = data.get('pet_id')
    user_id = data.get('user_id')
    name = data.get('name')
    date = data.get('date')
    description = data.get('description')  
    vet_id = data.get('vet_id')
    record_type = data.get('record_type')

    if not all([pet_id, user_id, name, date, record_type, vet_id, description]):
        return jsonify({'error': 'All fields are required.'}), 400

    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 401

    new_record = Record(
        pet_id=pet_id,
        user_id=user_id,
        name=name,
        date=date_obj,
        description=description,
        vet_id=vet_id,
        record_type=record_type
    )

    db.session.add(new_record)
    db.session.commit()

    return jsonify({'message': 'Record added successfully', 'record': new_record.to_dict()}), 201
     
@app.route('/medicalrecords', methods=['GET'])
def get_medical_records_by_user():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    records = Record.query.filter_by(user_id=user_id).all()
    
    results = [{
        'id': record.id,
        'pet_id': record.pet_id,
        'pet_name': record.pet.name,  
        'name': record.name,
        'date': record.date.strftime('%Y-%m-%d'),
        'description': record.description,
        'vet_id': record.vet.id,
        'vet_name': record.vet.name,  
        'record_type': record.record_type,
    } for record in records]

    return jsonify(results), 200

@app.route('/medicalrecords/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    data = request.json
    print('Received data:', data)
    record = Record.query.get_or_404(record_id)

    record.name = data.get('name', record.name)
    record.date = data.get('date', record.date)
    record.description = data.get('description', record.description)
    record.vet_id = data.get('vet_id', record.vet_id)
    record.record_type = data.get('record_type', record.record_type)
    record.pet_id = data.get('pet_id', record.pet_id)  

    try:
        if 'date' in data:
            date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
            record.date = date_obj
    except ValueError:
        return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 400

    db.session.commit()
    return jsonify({'message': 'Record updated successfully', 'record': record.to_dict()}), 200

@app.route('/medicalrecords/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
     record = Record.query.get(record_id)
     if not record:
         return jsonify({'message': 'Record not found'}), 404

     db.session.delete(record)
     db.session.commit()

     return jsonify({'message': 'Record deleted successfully'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)