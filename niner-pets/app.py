import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from models import db, User, Vet, Pet, Medication, Billing, Appointment, Record # Import the db and models
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey') 

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # For cross-origin session cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS, False otherwise (especially on localhost)

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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email_or_username = data.get('email_or_username')
    password = data.get('password')

    # Check if login is using username or email
    user = User.query.filter(
        (User.email == email_or_username) | (User.username == email_or_username)
    ).first()

    if user and user.check_password(password):
        # Set session variables
        session['user_id'] = user.id
        session['username'] = user.username  # Make sure this exists
        print(f"Session set for user {user.username}")
        
        # Generate a token (for demonstration, using the username as a token)
        token = user.username
        return jsonify({'message': 'Login successful', 'token': token}), 200
    else:
        print(f"Login failed for user: {email_or_username}")
        return jsonify({'error': 'Invalid credentials'}), 401
    
@app.route('/current_user', methods=['GET'])
def current_user():
    if 'username' in session:
        return jsonify({'username': session['username']}), 200
    return jsonify({'error': 'Not logged in'}), 401

@app.route('/register', methods=['OPTIONS', 'POST'])
def register():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 200

    # Handle the POST request to register a new user
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
    new_user.set_password(password)  # Hashing the password
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/vets', methods=['GET'])
def get_vets():
    vets = Vet.query.all()  
    return jsonify([vet.to_dict() for vet in vets]) 

@app.route('/user', methods=['GET'])
def get_user_info():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user:
            return jsonify({'username': user.username}), 200
    return jsonify({'error': 'User not logged in'}), 401

@app.route('/get_username', methods=['GET'])
def get_username():
    if 'user_id' in session:
        return jsonify({'username': session['username']}), 200
    else:
        return jsonify({'error': 'Not authenticated'}), 401

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

    # Retrieve the pet name from the database
    pet = Pet.query.filter_by(id=pet_id).first()
    if not pet:
        return jsonify({'error': 'Pet not found.'}), 404

    # Create new billing entry
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

    # Prepare the response data, including pet name
    response_data = {
        'id': new_billing.id,
        'user_id': new_billing.user_id,
        'pet_id': new_billing.pet_id,
        'type': new_billing.type,
        'price': new_billing.price,
        'description': new_billing.description,
        'date': new_billing.date,
        'created_at': new_billing.created_at.isoformat(),
        'pet_name': pet.name  # Include pet name in the response
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

    # Update billing entry fields
    billing_entry.pet_id = data.get('pet_id', billing_entry.pet_id)  # Use existing if not provided
    billing_entry.type = data['type']  # Assuming 'type' is required
    billing_entry.price = data['price']  # Assuming 'price' is required
    billing_entry.description = data['description']  # Assuming 'description' is required
    billing_entry.date = data['date']  # Assuming 'date' is required

    # Additional logic to validate or transform data could go here

    # Commit changes to the database
    db.session.commit()

    # Prepare and return the response data
    response_data = {
        'id': billing_entry.id,
        'user_id': billing_entry.user_id,
        'pet_id': billing_entry.pet_id,
        'type': billing_entry.type,
        'price': billing_entry.price,
        'description': billing_entry.description,
        'date': billing_entry.date.strftime('%Y-%m-%d'),  # Format date
        'pet_name': billing_entry.pet.name  # Include pet name in the response
    }

    print(f"Billing updated: {response_data}")  
    return jsonify({'message': 'Billing entry updated successfully', 'billing': response_data}), 200

@app.route('/appointments', methods=['POST'])
def add_appointment():
    data = request.json
    user_id = data.get('user_id')
    pet_id = data.get('pet_id')
    vet_id = data.get('vet_id')  # This now corresponds to the vet's ID from the frontend
    reason = data.get('reason')
    date = data.get('date')
    time = data.get('time')
    location = data.get('location')
    notes = data.get('notes')

    if not all([user_id, pet_id, vet_id, reason, date, time, location]):
        return jsonify({'error': 'All fields are required.'}), 400

    # Optional: Validate the date and time format
    try:
        datetime.strptime(date, '%Y-%m-%d')  # Validate date in 'YYYY-MM-DD' format
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    try:
        datetime.strptime(time, '%H:%M')  # Validate time in 'HH:MM' format
    except ValueError:
        return jsonify({'error': 'Invalid time format. Use HH:MM.'}), 400

    # Create new appointment entry
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

# @app.route('/records', methods=['POST'])
# def add_record():
#     data = request.json
#     pet_id = data.get('pet_id')
#     user_id = data.get('user_id')
#     name = data.get('name')
#     date = data.get('date')
#     description = data.get('description')
#     doctor = data.get('doctor')
#     record_type = data.get('record_type')

#     if not all([pet_id, user_id, name, date, record_type]):
#         return jsonify({'error': 'All fields are required.'}), 400

#     # Convert date string to date object if necessary
#     try:
#         date_obj = datetime.strptime(date, '%Y-%m-%d').date()
#     except ValueError:
#         return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 400

#     new_record = Record(
#         pet_id=pet_id,
#         user_id=user_id,
#         name=name,
#         date=date_obj,
#         description=description,
#         doctor=doctor,
#         record_type=record_type
#     )

#     db.session.add(new_record)
#     db.session.commit()

#     return jsonify({'message': 'Record added successfully', 'record': new_record.to_dict()}), 201
# @app.route('/records/<int:pet_id>', methods=['GET'])
# def get_records_by_pet(pet_id):
#     records = Record.query.filter_by(pet_id=pet_id).all()
#     return jsonify([record.to_dict() for record in records]), 200

# @app.route('/records/<int:record_id>', methods=['PUT'])
# def update_record(record_id):
#     data = request.json
#     record = Record.query.get_or_404(record_id)

#     record.name = data.get('name', record.name)
#     record.date = data.get('date', record.date)
#     record.description = data.get('description', record.description)
#     record.doctor = data.get('doctor', record.doctor)
#     record.record_type = data.get('record_type', record.record_type)

#     # Convert date string to date object if necessary
#     try:
#         if data.get('date'):
#             date_obj = datetime.strptime(data['date'], '%Y-%m-%d').date()
#             record.date = date_obj
#     except ValueError:
#         return jsonify({'error': 'Invalid date format. Please use YYYY-MM-DD.'}), 400

#     db.session.commit()

#     return jsonify({'message': 'Record updated successfully', 'record': record.to_dict()}), 200

# @app.route('/records/<int:record_id>', methods=['DELETE'])
# def delete_record(record_id):
#     record = Record.query.get(record_id)
#     if not record:
#         return jsonify({'message': 'Record not found'}), 404

#     db.session.delete(record)
#     db.session.commit()

#     return jsonify({'message': 'Record deleted successfully'}), 200

@app.route('/medical_records', methods=['POST'])
def add_medical_record():
    data = request.json
    pet_id = data.get('pet_id')
    user_id = data.get('user_id')
    record_type = data.get('type')
    event_name = data.get('event_name')
    date = data.get('date')
    description = data.get('description')
    doctor = data.get('doctor')

    if not all([pet_id, user_id, record_type, event_name, date, description, doctor]):
        return jsonify({'error': 'All fields are required.'}), 400

    new_record = Record(
        pet_id=pet_id,
        user_id=user_id,
        type=record_type,
        event_name=event_name,
        date=date,
        description=description,
        doctor=doctor
    )
    db.session.add(new_record)
    db.session.commit()

    return jsonify({'message': 'Medical record added successfully'}), 201

@app.route('/medical_records/<int:record_id>', methods=['PUT'])
def update_medical_record(record_id):
    data = request.json
    record = Record.query.get_or_404(record_id)

    record.type = data.get('type', record.type)
    record.event_name = data.get('event_name', record.event_name)
    record.date = data.get('date', record.date)
    record.description = data.get('description', record.description)
    record.doctor = data.get('doctor', record.doctor)

    db.session.commit()
    return jsonify({'message': 'Medical record updated successfully'}), 200

@app.route('/medical_records/<int:record_id>', methods=['DELETE'])
def delete_medical_record(record_id):
    record = Record.query.get(record_id)
    if record is None:
        return jsonify({'error': 'Medical record not found'}), 404

    db.session.delete(record)
    db.session.commit()
    return jsonify({'message': 'Medical record deleted successfully'}), 200

@app.route('/medical_records', methods=['GET'])
def get_medical_records():
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({'error': 'user_id is required'}), 400

    records = Record.query.filter_by(user_id=user_id).all()
    response = [record.to_dict() for record in records]
    return jsonify(response), 200



if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)
