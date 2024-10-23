import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Vet, Pet  # Import the db and User model
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure database connection
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)

# Enable CORS for all routes, allowing requests from 'http://localhost:3000'
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def home():
    return "Welcome to NinerPets!"

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email') 
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.password == password:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Register route
@app.route('/register', methods=['OPTIONS', 'POST'])
def register():
    if request.method == 'OPTIONS':
        # Handle CORS preflight request
        return '', 200

    # Handle the POST request to register a new user
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if email is valid and ends with charlotte.edu or uncc.edu
    if not email.endswith("@charlotte.edu") and not email.endswith("@uncc.edu"):
        return jsonify({"error": "Invalid email domain. Only charlotte.edu or uncc.edu emails are allowed."}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'error': 'Email already registered'}), 400

    # Create and save the new user
    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/vets', methods=['GET'])
def get_vets():
    vets = Vet.query.all()  
    return jsonify([vet.to_dict() for vet in vets]) 

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

# Get all pets
@app.route('/pets', methods=['GET'])
def get_pets():
    user_id = request.args.get('user_id')
    if user_id:
        pets = Pet.query.filter_by(user_id=user_id).all()
        return jsonify([pet.to_dict() for pet in pets])
    return jsonify({'error': 'User ID is required'}), 40

# Add a new pet
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

# Update a pet
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

# Delete a pet
@app.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if pet is None:
        return jsonify({'message': 'Pet not found'}), 404

    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Pet deleted successfully'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create the database tables if they don't exist
    app.run(debug=True)
