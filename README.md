# Authentication System (MERN + Tailwind CSS)

This is a simple authentication system built with the MERN stack (MongoDB, Express, React, Node.js) and styled using Tailwind CSS. The system supports user registration, email verification, and password recovery.

## Features

- **User Registration**: New users can register by providing their details.
- **Email Verification**: After registration, a verification code is sent to the user's email. They need to enter this code to activate their account.
- **Password Recovery**: Users can recover their password by receiving a reset link via email.
- **Protected Routes**: All routes are protected using JWT tokens stored in cookies, ensuring only authenticated users can access certain pages.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT tokens, Cookie-based session management
- **Email Service**: Mailtrap and Nodemailer (for email verification and password recovery)

## Setup Instructions
Login to Mailtrap or register your account and find your mailtrap api (located at the sidebar)

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Adrian9502/mern-advance-auth-system
   cd mern-advance-auth-system
   ```
2. Install backend dependencies:

  ```bash
    cd backend
    npm install
  ```

3. Install frontend dependencies:

  ```bash
  cd frontend
  npm install
  ```
4. Set up your environment variables for the backend:

  ```bash
  MONGO_URI= YOUR MONGO DB CONNECTION STRING
  PORT = 5000
  JWT_SECRET = YOUR SECRET KEY
  NODE_ENV = development
  MAILTRAP_TOKEN = YOUR MAILTRAP TOKEN
  MAILTRAP_USER = smtp@mailtrap.io
  MAILTRAP_PASS = YOUR MAILTRAP PASS
  CLIENT_URL = http://localhost:5173
  ```
## Routes
- **POST /check-auth**: Check if the user is already logged in and will redirect to the home page.
- **POST /register**: Register a new user (sends verification email).
- **POST /verify-email**: Verify user's email with the code.
- **POST /login**: User login (sends JWT token).
- **POST /logout**: Log out user (Remove JWT token).
- **POST /forgot-password**: Sends a link for password recovery.
- **POST /reset-password**: Resets the user's password with the recovery link send via email.

##Notes
All protected routes require a valid JWT token in the Authorization header.
Make sure to configure your email service for sending emails (e.g., Gmail, SendGrid).

## Credit
This project is based on a YouTube tutorial. I created this project because I was curious about how email sending and password recovery work in Express.js.  
Big credit to [As a Programmer](https://www.youtube.com/@asaprogrammer_) for this [video!](https://www.youtube.com/watch?v=pmvEgZC55Cg). I learned a lot!
