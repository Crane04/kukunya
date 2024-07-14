#
# Emergency Alert System
## Project Overview

Kukunya (Cocooneer - To protect/shield) is a mobile application (aided by the government) designed to enhance personal safety (for their citizens) by quickly notifying nearby emergency services, such as police stations and hospitals, in case of an emergency. The system integrates a mobile app, a backend server, and real-time location tracking to ensure prompt assistance.

## Download App
Download app at https://expo.dev/accounts/rahmayowa/projects/myapp/builds/5c19763f-6a61-4310-a0bd-6ce895ecdc89

## To test Police/Hospital set up...

Visit https://kukunya.netlify.app

Login with ID: new1

Password:new1

This Organization Type is a Police Station and will receive Police Station Reports only!

## How It Works
1. User Authentication:

    - Users log in using their email and password.
    - Upon successful login, users can access the app's features.

2. Real-Time Location Tracking:

    - The app tracks the user's location using GPS.
    - This information is critical for providing accurate emergency alerts.

3. Emergency Alerts:

    - Users can send alerts to nearby police stations or hospitals by pressing a button.
    - Alerts include the user's location and the type of emergency (police or medical).

4. WebSocket Communication:

    - The app maintains a real-time connection with the server using WebSocket (socket.io).
    - This ensures instant communication between the user and emergency services.

5. Feedback and Confirmation:

    - Users receive confirmation messages when alerts are successfully sent.
    - The app displays user location data and provides animated disclaimer text.

## Project Structure
1. Frontend
    - React Native for mobile app
    - React Js for Web Frontend

2. Backend (Node.js with Express)

3. Database (MongoDB)

### Frontend (Mobile App)
#### Features

1. User authentication (login)
2. Real-time location tracking
3. Sending emergency alerts
4. Displaying user location
5. Animated disclaimer text


#### Setup and Running

1. Clone the Repository:

```
git clone https://github.com/kukunya
cd ./myapp
```
2. Install Dependencies:

```
npm install
```
3. Start the App:

```bash
npm start
```

### Backend (Server)
#### Features
1. User authentication (login)
2. WebSocket server for real-time communication
3. RESTful APIs for user and issue management
4. Middleware for token validation
#### Setup and Running
1. Clone the Repository:

```
cd ./backend
```
2. Install Dependencies:

```
npm install
```
3. Environment Variables:

    - Create a .env file in the backend directory.
    - Add the following environment variables:
 ```
APP_SK=your_secret_key // hello
MONGO_URI=your_mongodb_uri // mongodb+srv://mayowayusuf3004:5s9JnuyAjrJECvbj@cluster0.rgsv8es.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```
Start the Server:

```
npm start
```
### Mobile App (Frontend)
#### Features
1. User login and authentication
2. Display of user's current location
3. Buttons to trigger emergency alerts
4. Real-time communication with the backend server
5. Display of confirmation messages and user information

##### Setup and Running

1. Install Dependencies:
```
npm install
```

2. Start the App:

```
npm run dev
```

## How to Use the App
- Login:

    - Open the app and enter your email and password to log in.
    - If login is successful, you will be navigated to the home screen.

- Sending Alerts:

    - On the home screen, you can see your current location.
    - Press the "Alarm Police" button to send an alert to the nearest police station.
    - Press the "Alarm Nearest Hospital" button to send an alert to the nearest hospital.
- Confirmation:

    - After sending an alert, you will receive a confirmation message.
`- The app displays a disclaimer text warning against false alarms.

## Contact Information
For any questions or further information, please contact:

Name: Yusuf Saubana Mayowa

Email: mayowayusuf3004@gmail.com