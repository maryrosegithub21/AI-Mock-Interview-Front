import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const InterviewComponent = () => {
  const [conversation, setConversation] = useState([]);
  const [userResponse, setUserResponse] = useState('');
  const [role, setRole] = useState('');
  const [voices, setVoices] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [initialPromptSent, setInitialPromptSent] = useState(false);
  const [roleFilled, setRoleFilled] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (roleFilled && !initialPromptSent) {
      sendInitialPrompt(role);
      setInitialPromptSent(true);
    }
  }, [roleFilled, initialPromptSent, role]);

  const handleUserResponseChange = (e) => {
    setUserResponse(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleRoleBlur = () => {
    setRoleFilled(true);
  };

  const sendInitialPrompt = async (role) => {
    try {
      const initialPrompt = `You are interviewing for the role of ${role}. I am the interviewer. Please introduce yourself and set the stage for the interview.`;

      const payload = {
        userResponse: initialPrompt,
        conversation: [], // Initial conversation is empty
        role: role,
      };

      console.log('Submitting initial prompt:', payload);

      const response = await axios.post('/api/interview', payload);
      const aiResponse = response.data.aiResponse;

      // Add ONLY the AI's response to the conversation
      setConversation([
        { role: "model", parts: [{ text: aiResponse }] },
      ]);
      speakText(aiResponse);
    } catch (error) {
      console.error('Error sending initial prompt:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

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

      console.log('Submitting payload:', payload);

      const response = await axios.post('/api/interview', payload);
      const aiResponse = response.data.aiResponse;

      // Add the user's response and the AI's response to the conversation
      setConversation([
        ...conversation,
        { role: "user", parts: [{ text: userResponse }] },
        { role: "model", parts: [{ text: aiResponse }] },
      ]);
      setUserResponse('');
      speakText(aiResponse);
    } catch (error) {
      console.error('Error submitting:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const handleClear = () => {
    setConversation([]);
    setUserResponse('');
    setRole('');
    setFeedback(null);
    setInitialPromptSent(false);
    setRoleFilled(false);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('female') || voice.name.includes('Google UK English Female'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };

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
      console.log('Transcript:', transcript);
      setUserResponse(transcript);
      setIsListening(false);
      handleSubmit(); // Submit directly after voice input
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

  const calculateFeedback = () => {
    const keywords = ['teamwork', 'leadership', 'problem-solving', 'communication', 'initiative'];
    const userResponses = conversation.filter(entry => entry.role === 'user').map(entry => entry.parts.map(part => part.text).join(' ')).join(' ');
    const matchedKeywords = keywords.filter(keyword => userResponses.toLowerCase().includes(keyword.toLowerCase()));
    const score = (matchedKeywords.length / keywords.length) * 100;
    setFeedback(score);
  };

  const renderStarRating = () => {
    if (feedback === null) return null;
    const fullStars = Math.floor(feedback / 20);
    const stars = Array(5).fill('☆').map((star, index) => index < fullStars ? '★' : star);
    return <div className="star-rating">{stars.join(' ')}</div>;
  };

  return (
    <div className="background">
      <div className="main-container">
        {renderStarRating()}
        <h1>AI Job Interview Practice</h1>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            value={role}
            onChange={handleRoleChange}
            onBlur={handleRoleBlur}
          />
        </div>
        <div>
          {conversation.map((entry, index) => (
            <div key={index}>
              <strong>{entry.role === 'user' ? 'You' : 'AI'}:</strong> {entry.parts.map(part => part.text).join(' ')}
            </div>
          ))}
        </div>
        <div>
          <textarea
            value={userResponse}
            onChange={handleUserResponseChange}
            placeholder="Type your response here..."
            onPaste={(e) => {
              e.preventDefault();
              alert("Copy-pasting is not allowed. Please type or use voice input.");
            }}
            onDrop={(e) => {
              e.preventDefault();
              alert("Drag and drop is disabled. Please type or use voice input.");
            }}
          />
        </div>
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