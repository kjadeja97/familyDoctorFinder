import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from './App';

// Mock axios to avoid actual API calls during testing
jest.mock('axios');

/**
 * Test suite for the App component
 * 
 * This file contains comprehensive tests for:
 * - Component rendering
 * - Form functionality
 * - API integration
 * - Error handling
 * - User interactions
 */
describe('App Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test that the component renders without crashing
   */
  test('renders Family Doctor Finder title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Family Doctor Finder/i);
    expect(titleElement).toBeInTheDocument();
  });

  /**
   * Test that the search form is rendered with all fields
   */
  test('renders search form with all input fields', () => {
    render(<App />);
    
    // Check for all form fields
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postal Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Language/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Specialty/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText(/Search Doctors/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear Form/i)).toBeInTheDocument();
  });

  /**
   * Test form input functionality
   */
  test('allows user to input search criteria', () => {
    render(<App />);
    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const cityInput = screen.getByLabelText(/City/i);
    
    // Test input changes
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.change(cityInput, { target: { value: 'Toronto' } });
    
    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Smith');
    expect(cityInput.value).toBe('Toronto');
  });

  /**
   * Test successful API call and results display
   */
  test('displays search results after successful API call', async () => {
    // Mock successful API response
    const mockDoctors = [
      {
        FirstName: 'John',
        LastName: 'Smith',
        City: 'Ottawa',
        PostalCode: 'K1A 0A6',
        Gender: 'M',
        Language: 'English, French',
        Specialty: 'Family Medicine'
      },
      {
        FirstName: 'Jane',
        LastName: 'Doe',
        City: 'Toronto',
        PostalCode: 'M5V 3A8',
        Gender: 'F',
        Language: 'English',
        Specialty: 'Family Medicine'
      }
    ];

    axios.post.mockResolvedValueOnce({ data: mockDoctors });

    render(<App />);
    
    // Submit the form
    const searchButton = screen.getByText(/Search Doctors/i);
    fireEvent.click(searchButton);

    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText(/Search Results \(2 doctors found\)/i)).toBeInTheDocument();
    });

    // Check that doctor information is displayed
    expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/📍 Ottawa/i)).toBeInTheDocument();
    expect(screen.getByText(/📍 Toronto/i)).toBeInTheDocument();
  });

  /**
   * Test error handling when API call fails
   */
  test('displays error message when API call fails', async () => {
    // Mock failed API response
    axios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);
    
    // Submit the form
    const searchButton = screen.getByText(/Search Doctors/i);
    fireEvent.click(searchButton);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch doctors/i)).toBeInTheDocument();
    });
  });

  /**
   * Test loading state during API call
   */
  test('shows loading state during API call', async () => {
    // Mock delayed API response
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<App />);
    
    // Submit the form
    const searchButton = screen.getByText(/Search Doctors/i);
    fireEvent.click(searchButton);

    // Check for loading state
    expect(screen.getByText(/Searching for doctors/i)).toBeInTheDocument();
    expect(screen.getByText(/Searching.../i)).toBeInTheDocument();
  });

  /**
   * Test clear form functionality
   */
  test('clears form when clear button is clicked', () => {
    render(<App />);
    
    const firstNameInput = screen.getByLabelText(/First Name/i);
    const lastNameInput = screen.getByLabelText(/Last Name/i);
    const cityInput = screen.getByLabelText(/City/i);
    
    // Fill in some fields
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.change(cityInput, { target: { value: 'Toronto' } });
    
    // Click clear button
    const clearButton = screen.getByText(/Clear Form/i);
    fireEvent.click(clearButton);
    
    // Check that fields are reset to default values
    expect(firstNameInput.value).toBe('');
    expect(lastNameInput.value).toBe('');
    expect(cityInput.value).toBe('Ottawa'); // Default value
  });

  /**
   * Test that search button is disabled during loading
   */
  test('disables search button during API call', async () => {
    // Mock delayed API response
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<App />);
    
    const searchButton = screen.getByText(/Search Doctors/i);
    
    // Submit the form
    fireEvent.click(searchButton);
    
    // Check that button is disabled and shows loading text
    expect(searchButton).toBeDisabled();
    expect(screen.getByText(/Searching.../i)).toBeInTheDocument();
  });

  /**
   * Test empty results state
   */
  test('displays empty state when no search criteria entered', () => {
    render(<App />);
    
    // Check for empty state message
    expect(screen.getByText(/Enter search criteria above to find family doctors/i)).toBeInTheDocument();
  });
}); 