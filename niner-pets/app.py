from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User  # Import the db and User model

app = Flask(__name__)

# Configuring database connection
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Enable CORS for all routes
CORS(app)

@app.route('/')
def home():
    return "Welcome to NinerPets!"

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.password == password:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  
    app.run(debug=True)
