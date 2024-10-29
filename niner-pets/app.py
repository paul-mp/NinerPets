import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from models import db, User, Vet, Pet, Medication  # Import the db and models
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = Flask(__name__)

# Set up secret key for session management
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey')  # Use a secret key for securely signing the session cookies

# Configure database connection
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Enable CORS for all routes, allowing requests from 'http://localhost:3000' and supporting credentials
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Set session cookie settings
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # For cross-origin session cookies
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS, False otherwise (especially on localhost)

def get_medications_by_user_id(user_id, db):
    return (
        db.session.query(Medication, Pet.name.label("pet_name"))  # Use label to name pet_name
        .join(Pet, Medication.pet_id == Pet.id)  # Join on pet_id to get pet name
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
        return jsonify({'message': 'Login successful'}), 200
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
    print(f"Fetching pet with ID: {pet_id}")  # Debug statement
    pet = Pet.query.get(pet_id)
    if pet is None:
        print(f"Pet with ID {pet_id} not found.")  # Debug statement
        return jsonify({'error': 'Pet not found'}), 404
    return jsonify(pet.to_dict()), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)