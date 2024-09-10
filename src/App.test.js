import { render, screen } from '@testing-library/react';
import App from './App.js'; // Assuming the file path is correct

test('renders learn react link', () => {
  render(<App />);
  const interviewComponent = screen.getByTestId('interview-component'); // Assuming InterviewComponent has a test id
  expect(interviewComponent).toBeInTheDocument();
});