# **NinerPets**

NinerPets is a pet management platform designed to help UNCC students efficiently manage their pets' health. 
The application includes features for scheduling appointments, managing pet profiles, viewing medical records, and more.

- Built with React and Material-UI for the frontend, providing a responsive and intuitive user experience.
- Uses Flask as the backend framework to handle API requests and data processing.
- Implements NextAuth for authentication and secures user data.
- Uses PostgreSQL hosted on AWS RDS for data storage and management.

# **Run Locally**

**Clone the project**
 ```git clone https://github.com/paul-mp/NinerPets.git```

**Navigate to the project directory**

 ```cd NinerPets```

# **Backend Setup**

1. Install backend dependencies

Navigate to the backend folder (or wherever your Flask backend is located) and install the required Python packages:

```pip install -r requirements.txt```

2. Set up environment variables

Create a .env file in the backend directory and add the following environment variables:

```DATABASE_URL=our_aws_rds_database_url```
```SECRET_KEY=our_secret_key```
```REACT_APP_WEATHER_API_KEY=our_secret_key```
```JWT_SECRET_KEY=our_secret_key```
```REACT_APP_GOOGLE_MAPS_API_KEY=our_secret_key```


3. Start the backend server

Run the following command to start the Flask backend server:

```python app.py```
The backend will start on http://localhost:5000 by default (or the port configured in app.py).

# **Frontend Setup**

1. Install frontend dependencies
   
```npm install```

2. Set up enviorment variables

If needed, create a .env file in the frontend directory with any environment variables required by your React frontend.


3. Start the frontend server

Run the following command to start the React frontend:

```npm start```

The frontend will start on http://localhost:3000.

## **Technologies Used**
- React
- Material-UI
- NextAuth.js
- PostgreSQL
- AWS RDS
- Flask
