Emergency Alert System
Project Overview
This project is a mobile application designed to enhance personal safety by quickly notifying nearby emergency services, such as police stations and hospitals, in case of an emergency. The system integrates a mobile app, a backend server, and real-time location tracking to ensure prompt assistance.

How It Works
User Authentication:

Users log in using their email and password.
Upon successful login, users can access the app's features.
Real-Time Location Tracking:

The app tracks the user's location using GPS.
This information is critical for providing accurate emergency alerts.
Emergency Alerts:

Users can send alerts to nearby police stations or hospitals by pressing a button.
Alerts include the user's location and the type of emergency (police or medical).
WebSocket Communication:

The app maintains a real-time connection with the server using WebSocket (socket.io).
This ensures instant communication between the user and emergency services.
Feedback and Confirmation:

Users receive confirmation messages when alerts are successfully sent.
The app displays user location data and provides animated disclaimer text.
Project Structure
Frontend (React Native)
Backend (Node.js with Express)
Database (MongoDB)
Frontend (Mobile App)
Features
User authentication (login)
Real-time location tracking
Sending emergency alerts
Displaying user location
Animated disclaimer text
Setup and Running
Clone the Repository:

sh
Copy code
git clone https://github.com/your-repo.git
cd your-repo/mobile-app
Install Dependencies:

sh
Copy code
npm install
Start the App:

sh
Copy code
npx react-native run-android
# or for iOS
npx react-native run-ios
Backend (Server)
Features
User authentication (login)
WebSocket server for real-time communication
RESTful APIs for user and issue management
Middleware for token validation
Setup and Running
Clone the Repository:

sh
Copy code
git clone https://github.com/your-repo.git
cd your-repo/backend
Install Dependencies:

sh
Copy code
npm install
Environment Variables:

Create a .env file in the backend directory.
Add the following environment variables:
makefile
Copy code
APP_SK=your_secret_key
MONGO_URI=your_mongodb_uri
Start the Server:

sh
Copy code
npm start
Mobile App (Frontend)
Features
User login and authentication
Display of user's current location
Buttons to trigger emergency alerts
Real-time communication with the backend server
Display of confirmation messages and user information
Setup and Running
Clone the Repository:

sh
Copy code
git clone https://github.com/your-repo.git
cd your-repo/frontend
Install Dependencies:

sh
Copy code
npm install
Configure Environment Variables:

Create a .env file in the frontend directory.
Add the following environment variables:
arduino
Copy code
REACT_APP_API_URL=http://your_backend_url
Start the App:

sh
Copy code
npm start
How to Use the App
Login:

Open the app and enter your email and password to log in.
If login is successful, you will be navigated to the home screen.
Sending Alerts:

On the home screen, you can see your current location.
Press the "Alarm Police" button to send an alert to the nearest police station.
Press the "Alarm Nearest Hospital" button to send an alert to the nearest hospital.
Confirmation:

After sending an alert, you will receive a confirmation message.
The app displays a disclaimer text warning against false alarms.
Contact Information
For any questions or further information, please contact:

Name: [Your Name]
Email: [Your Email]
GitHub: [Your GitHub Profile]