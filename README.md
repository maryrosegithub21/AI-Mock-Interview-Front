# Mock Interview Application

This project is a mock interview application that allows users to simulate job interviews with an AI interviewer. The application consists of a frontend built with React and a backend server using Express and Google Generative AI.

## Table of Contents

- [Mock Interview Application](#mock-interview-application)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [Running the Application](#running-the-application)
  - [Project Structure](#project-structure)
    - [Backend](#backend-1)
    - [Frontend](#frontend-1)
  - [API Endpoints](#api-endpoints)
    - [POST /api/interview](#post-apiinterview)
  - [Contributing](#contributing)
  - [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- A Google Generative AI API key.

## Installation

### Backend

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/mock-interview-app.git
    cd mock-interview-app/backend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `backend` directory and add your Google Generative AI API key:
    ```env
    GOOGLE_API_KEY=your_google_api_key
    ```

4. Start the backend server:
    ```sh
    npm start
    ```

### Frontend

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the frontend development server:
    ```sh
    npm start
    ```

## Running the Application

1. Ensure the backend server is running on `http://localhost:3002`.
2. Open another terminal and start the frontend development server.
3. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

Copy
Insert

mock-interview-app/ ├── backend/ │ ├── server.js │ ├── package.json │ └── .env └── frontend/ ├── src/ │ ├── InterviewComponent.js │ ├── App.js │ └── index.js ├── public/ ├── package.json └── .env


### Backend

- `server.js`: Contains the Express server setup and API endpoint for handling interview requests.
- `.env`: Contains environment variables such as the Google API key.

### Frontend

- `InterviewComponent.js`: The main React component for the interview interface.
- `App.js`: The root component of the React application.
- `index.js`: The entry point of the React application.

## API Endpoints

### POST /api/interview

- **Description**: Handles interview requests and generates AI responses.
- **Request Body**:
    ```json
    {
      "jobTitle": "Software Engineer",
      "userResponse": "I have 5 years of experience in software development.",
      "conversation": [
        {
          "role": "user",
          "parts": [{ "text": "Tell me about yourself." }]
        }
      ],
      "role": "interviewer"
    }
    ```
- **Response**:
    ```json
    {
      "aiResponse": "Can you elaborate on your experience in software development?"
    }
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License.
Copy
Insert

Notes:
Replace yourusername and your_google_api_key with your actual GitHub username and Google API key, respectively.
Ensure that the backend server is running on port 3002 as specified in the server.js file.
The frontend server runs on port 3000 by default.
This README provides a comprehensive guide to setting up and running your mock interview application, including the project structure and API endpoint details.