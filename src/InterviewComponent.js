
import React, { useState } from 'react'; 
// import axios from 'axios'; // Need to install npm axios
const axios = require('./lib/axios.js');

import './App.css'; // Import the CSS file

const InterviewComponent = () => {
  const [conversation, setConversation] = useState([]);
  const [userResponse, setUserResponse] = useState('');
  const [role, setRole] = useState('');

  const handleUserResponseChange = (e) => {
    setUserResponse(e.target.value); // get the value of response from the interview
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value); // get the value of input job title
  };
// the button used to submit answer
  const handleSubmit = async () => {
    try {
      const payload = {
        userResponse,
        conversation: [
          ...conversation,
          { role: "user", parts: [{ text: userResponse }] },
        ],
        role,
      };

      console.log('Submitting payload:', payload); // Log the payload for debugging

      const response = await axios.post('/api/interview', payload);

      const aiResponse = response.data.aiResponse;
// setup of conversation in the text area
      setConversation([
        ...conversation,
        { role: "user", parts: [{ text: userResponse }] },
        { role: "model", parts: [{ text: aiResponse }] },
      ]);
// setup of users response in the text area
      setUserResponse('');
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response from server:', error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
      } else {
        // Something else caused the error
        console.error('Error setting up request:', error.message);
      }
    }
  };

  return (
    <div className="container">
       <h1>AI Mock Interviewer</h1>
      <div>
        <label>Job Title:</label>
        <input
          type="text"
          value={role}
          onChange={handleRoleChange}
        />
      </div>
      {/* this is where the response of AI and User will show */}
      <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0', height: '300px', overflowY: 'scroll' }}>
        {conversation.map((entry, index) => (
          <div key={index}>
            <strong> {entry.role === 'user' ? 'You' : 'AI'}:</strong> {entry.parts.map(part => part.text).join(' ')}
          </div>
        ))}
      </div>
      {/* this is where the user will type in answer */}
      <div>
        <textarea
          value={userResponse}
          onChange={handleUserResponseChange}
          placeholder="Type your response here..."
        />
      </div>
      {/* this is the button to sumbit the answer */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default InterviewComponent;