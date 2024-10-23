from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)  # Replacing username with email
    password = db.Column(db.String(150), nullable=False)  # No password hashing for now

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email  # Return email instead of username
        }

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