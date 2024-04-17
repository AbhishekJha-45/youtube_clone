# YouTube Clone App

This project is a YouTube clone app aimed at learning full-stack application development. It features a backend built with Node.js, Express.js, and MongoDB, implementing token-based authentication with password and username. The frontend is developed using Next.js and styled with Tailwind CSS.

## Overview

The YouTube Clone App replicates key features of the popular video-sharing platform, allowing users to view, upload, and interact with videos. It serves as a learning project for developing full-scale production-ready full-stack applications.

## Features

- **Backend with Node.js and Express.js:** Implements server-side logic and API endpoints for handling user authentication, video management, and interactions.
- **MongoDB Database:** Stores user data, video metadata, and authentication tokens for secure and scalable data management.
- **Token-Based Authentication:** Ensures secure user authentication using tokens generated based on password and username credentials.
- **Frontend with Next.js:** Utilizes Next.js for server-side rendering, routing, and building dynamic user interfaces.
- **Styled with Tailwind CSS:** Uses Tailwind CSS for rapid and efficient styling, enabling a sleek and modern user interface.
- **Learning Focus:** Designed as a learning project to gain practical experience in building full-stack applications, integrating authentication, and managing data.

## Technologies Used

### Backend

- **Node.js:** JavaScript runtime for server-side application logic.
- **Express.js:** Web application framework for Node.js, facilitating routing and middleware implementation.
- **MongoDB:** NoSQL database for storing user data, video metadata, and application state.
- **Token-Based Authentication:** Implements secure user authentication using tokens for authorization.

### Frontend (Next.js)

- **Next.js:** React framework for server-side rendering, routing, and building dynamic user interfaces.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development, providing customizable styles and components.
- **[Other Frontend Technologies]:** [Description of additional frontend technologies being used, if any]

## Environment Variables

- `PORT`: Port number for the backend server.
- `DB_URI`: URI for connecting to the MongoDB database.
- `CORS_ORIGIN`: Allowed CORS origins for frontend requests.
- `ACCESS_TOKEN_SECRET`: Secret key for generating access tokens.
- `ACCESS_TOKEN_EXPIRY`: Expiry duration for access tokens.
- `REFRESH_TOKEN_SECRET`: Secret key for generating refresh tokens.
- `REFRESH_TOKEN_EXPIRY`: Expiry duration for refresh tokens.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name for media storage.
- `CLOUDINARY_API_KEY`: Cloudinary API key for media storage.
- `CLOUDINARY_API_KEY_SECRET`: Cloudinary API key secret for media storage.

## Usage

1. **Clone the Repository:** Clone this repository to your local machine.
2. **Install Dependencies:** Navigate to the project directory and run `npm install` to install the necessary dependencies for both the backend and frontend.
3. **Set Environment Variables:** Create a `.env` file in the root directory and add the environment variables mentioned above.
4. **Start the Backend Server:** Run `npm start ` to start the Node.js server.
5. **Start the Frontend Server:** Navigate to the frontend directory (`cd frontend`) and run `npm start` to start the Next.js development server.
6. **Access the App:** Open your web browser and navigate to the provided URL to access the YouTube Clone App.

## Credits

- Developed by [Abhishek Kr jha].

