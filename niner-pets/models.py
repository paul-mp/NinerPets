
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import CheckConstraint

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)  # Add username field
    password = db.Column(db.String(255), nullable=False)  # Allow longer hashed passwords

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Vet(db.Model):
    __tablename__ = 'vets'  
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    specialty = db.Column(db.String(100))
    information = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'specialty': self.specialty,
            'information': self.information,
        }

class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    species = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    weight = db.Column(db.Numeric(5, 2), nullable=False)

    user = db.relationship('User', backref=db.backref('pets', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'species': self.species,
            'breed': self.breed,
            'dob': self.dob.isoformat(),
            'weight': float(self.weight),
        }

class Medication(db.Model):
    __tablename__ = 'medications'

    id = db.Column(db.Integer, primary_key=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    dosage = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    side_effects = db.Column(db.Text, nullable=True)
    instructions = db.Column(db.Text, nullable=True)
    refill = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    pet = db.relationship('Pet', backref=db.backref('medications', lazy=True))
    user = db.relationship('User', backref=db.backref('medications', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'pet_id': self.pet_id,
            'user_id': self.user_id,
            'name': self.name,
            'dosage': self.dosage,
            'description': self.description,
            'start_date': self.start_date.isoformat(),
            'end_date': 'Ongoing' if self.end_date is None else self.end_date.isoformat(),
            'side_effects': self.side_effects,
            'instructions': self.instructions,
            'refill': self.refill,
            'created_at': self.created_at.isoformat(),
        }
    
class Billing(db.Model):
    __tablename__ = 'billing'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)  
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('billings', lazy=True))
    pet = db.relationship('Pet', backref=db.backref('billings', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pet_id': self.pet_id,
            'type': self.type,
            'price': float(self.price),
            'description': self.description,
            'date': self.date.isoformat(),
            'created_at': self.created_at.isoformat(),
        }
    
class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'), nullable=False)
    vet_id = db.Column(db.Integer, db.ForeignKey('vets.id'), nullable=False)
    reason = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    # Relationships
    user = db.relationship('User', backref=db.backref('appointments', lazy=True))
    pet = db.relationship('Pet', backref=db.backref('appointments', lazy=True))
    vet = db.relationship('Vet', backref=db.backref('appointments', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pet_id': self.pet_id,
            'vet_id': self.vet_id,
            'reason': self.reason,
            'date': self.date.isoformat(),
            'time': self.time.isoformat(),
            'location': self.location,
            'notes': self.notes,
        }