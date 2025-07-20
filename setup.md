# Setup Guide for Family Doctor Finder with Web Scraping

## Overview
This application now uses web scraping to search for doctors on the CPSO Advanced Search page. It consists of:
- **Frontend**: React app (port 3001)
- **Backend**: Node.js server with Puppeteer for web scraping (port 5000)

## Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Frontend Dependencies
```bash
# In the root directory
npm install
```

### 2. Install Backend Dependencies
```bash
# Navigate to server directory
cd server
npm install
```

### 3. Start the Backend Server
```bash
# In the server directory
npm start
```
The backend server will start on port 5000.

### 4. Start the Frontend Server
```bash
# In a new terminal, from the root directory
npm start
```
The frontend will start on port 3001.

### 5. Access the Application
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000

## API Endpoints

### Health Check
- **GET** `http://localhost:5000/api/health`
- Returns server status

### Search Doctors
- **POST** `http://localhost:5000/api/search`
- Body: Search parameters (FirstName, LastName, City, etc.)
- Returns: Array of doctor objects

### Get Specialties
- **GET** `http://localhost:5000/api/specialties`
- Returns: Array of available specialties

## Troubleshooting

### Backend Server Issues
1. **Port 5000 already in use**: Change the port in `server/server.js`
2. **Puppeteer installation issues**: Try `npm install puppeteer --unsafe-perm=true`
3. **Permission errors**: Run with appropriate permissions

### Frontend Connection Issues
1. **Cannot connect to backend**: Ensure backend is running on port 5000
2. **CORS errors**: Backend has CORS enabled, should work automatically

### Web Scraping Issues
1. **No results found**: The website structure may have changed
2. **Timeout errors**: Increase timeout in the scraping functions
3. **Browser launch issues**: Check Puppeteer installation

## Development

### Backend Development
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
npm start  # From root directory
```

## Production Deployment

### Backend Deployment
1. Set environment variables
2. Install dependencies: `npm install --production`
3. Start server: `npm start`

### Frontend Deployment
1. Build: `npm run build`
2. Deploy the `build` folder to your hosting service

## Notes
- Web scraping may be slower than direct API calls
- The scraping logic may need updates if the CPSO website changes
- Consider implementing caching for better performance
- Respect the website's robots.txt and terms of service 