import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; // Need to install npm axios
// const axios = require('./axios.js');
// import.meta.env

import './App.css'; // Import the CSS file

const InterviewComponent = () => {
  // const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const [conversation, setConversation] = useState([]);
  const [userResponse, setUserResponse] = useState('');
  const [role, setRole] = useState('');
  const [voices, setVoices] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    // Load voices initially and when they change
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

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
      speakText(aiResponse);
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

  const handleClear = () => {
    setConversation([]); // Clear the conversation history
    setUserResponse(''); // Clear the user response input
    setRole(''); // Clear the role input
    setFeedback(null); // Clear feedback
  };

    // Function to convert text to speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Select a female voice
      const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female') || voice.name.includes('Google UK English Female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };


   // Function to handle voice input
   const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserResponse(transcript);
      setIsListening(false);
       handleSubmit(); // Automatically submit after voice input
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

   // Function to calculate feedback
  const calculateFeedback = () => {
    const keywords = ['teamwork', 'leadership', 'problem-solving', 'communication', 'initiative'];
    const userResponses = conversation.filter(entry => entry.role === 'user').map(entry => entry.parts.map(part => part.text).join(' ')).join(' ');
    const matchedKeywords = keywords.filter(keyword => userResponses.toLowerCase().includes(keyword.toLowerCase()));
    const score = (matchedKeywords.length / keywords.length) * 100;
    setFeedback(score);
  };

  // Function to render star rating based on feedback score
  const renderStarRating = () => {
    if (feedback === null) return null;
    const fullStars = Math.floor(feedback / 20); // Assuming 5-star system
    const stars = Array(5).fill('☆').map((star, index) => index < fullStars ? '★' : star);
    return <div className="star-rating">{stars.join(' ')}</div>;
  };

  return (
    <div className="background">
    <div className="main-container">
    {renderStarRating()} {/* Render star rating at the top */}
       <h1>AI Job Interview Practice</h1>
      <div>
        <label>Job Title:</label>
        <input
          type="text"
          value={role}
          onChange={handleRoleChange}
        />
      </div>
      {/* this is where the response of AI and User will show */}
      <div >
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
      <button onClick={handleVoiceInput} disabled={isListening}>
            {isListening ? 'Listening...' : 'Use Voice Input'}
      </button>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleClear}>Clear</button>
      {renderStarRating()}
    </div>
    </div>
  );
};

export default InterviewComponent;

