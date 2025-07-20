# 🏥 Family Doctor Finder

A modern, responsive React web application for searching family doctors in Ontario using the CPSO (College of Physicians and Surgeons of Ontario) API.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![Axios](https://img.shields.io/badge/Axios-1.4.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [API Integration](#-api-integration)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

### 🔍 Advanced Search Capabilities
- **Location-based search**: Find doctors by city or postal code
- **Name-based search**: Search by first or last name
- **Gender filtering**: Filter by male or female doctors
- **Language filtering**: Find doctors who speak specific languages
- **Specialty search**: Search by medical specialty (default: Family Medicine)

### 🎨 Modern User Interface
- **Responsive design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful gradients**: Modern gradient background and button styles
- **Smooth animations**: Hover effects and transitions
- **Loading states**: Visual feedback during API calls
- **Error handling**: User-friendly error messages

### ⚡ Performance & UX
- **Real-time search**: Instant results with loading indicators
- **Form validation**: Input validation and user guidance
- **Clear functionality**: Easy form reset and management
- **Accessibility**: Proper labels and semantic HTML

## 🚀 Demo

The application is designed to help users find family doctors in Ontario with an intuitive search interface.

### Search Interface
- Clean, organized form layout
- Multiple search criteria
- Instant feedback and results

### Results Display
- Card-based layout for doctor information
- Clear presentation of doctor details
- Responsive grid system

## 🏃 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd familyDoctorFinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Starts development server |
| `npm test` | Runs test suite |
| `npm run build` | Creates production build |
| `npm run eject` | Ejects from Create React App |

## 🔌 API Integration

### CPSO API Endpoint
- **URL**: `https://doctors.cpso.on.ca/api/Search`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

### Request Payload
```javascript
{
  "FirstName": "",
  "LastName": "",
  "City": "Ottawa",
  "PostalCode": "",
  "Gender": "",
  "Language": "",
  "Specialty": "Family Medicine"
}
```

### Response Format
```javascript
[
  {
    "FirstName": "John",
    "LastName": "Smith",
    "City": "Ottawa",
    "PostalCode": "K1A 0A6",
    "Gender": "M",
    "Language": "English, French",
    "Specialty": "Family Medicine"
  }
]
```

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

## 📖 Usage Guide

### Basic Search
1. **Enter search criteria** in the form fields
2. **Click "Search Doctors"** to submit
3. **View results** in the cards below

### Advanced Search Tips

#### Location Search
- Enter a city name (e.g., "Toronto", "Ottawa")
- Use postal codes for precise location search
- Leave empty to search all locations

#### Name Search
- Enter first name, last name, or both
- Partial names are supported
- Case-insensitive search

#### Filtering Options
- **Gender**: Select "Male", "Female", or "Any Gender"
- **Language**: Enter spoken languages (e.g., "French", "Spanish")
- **Specialty**: Change from "Family Medicine" to other specialties

### Form Management
- **Clear Form**: Reset all fields to default values
- **Real-time updates**: Form updates as you type
- **Validation**: Input validation and error handling

## 📁 Project Structure

```
familyDoctorFinder/
├── public/                    # Static assets
│   └── index.html            # Main HTML file
├── src/                      # Source code
│   ├── App.js               # Main application component
│   ├── App.css              # App-specific styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── README.md                # Project documentation
├── API_DOCUMENTATION.md     # API integration guide
├── DEVELOPMENT_GUIDE.md     # Development guide
└── .gitignore              # Git ignore file
```

### Key Components

#### App Component (`src/App.js`)
- **State Management**: React hooks for form and results state
- **API Integration**: Axios for HTTP requests
- **Form Handling**: Controlled components with validation
- **Error Handling**: Comprehensive error management

#### Styling Architecture
- **Global Styles** (`src/index.css`): Reset, base styles, components
- **App Styles** (`src/App.css`): Layout and typography
- **Responsive Design**: Mobile-first approach

## 🛠 Development

### Code Standards
- **React**: Functional components with hooks
- **JavaScript**: ES6+ features, JSDoc comments
- **CSS**: BEM methodology, modular styles
- **Git**: Conventional commit messages

### Development Workflow
1. Create feature branch
2. Make changes with proper documentation
3. Test thoroughly
4. Submit pull request

For detailed development guidelines, see [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md).

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Netlify**: Drag and drop `build` folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `build` folder to S3 bucket

### Environment Variables
Create a `.env` file for configuration:
```env
REACT_APP_API_URL=https://doctors.cpso.on.ca/api/Search
REACT_APP_ENVIRONMENT=production
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper documentation
4. **Test thoroughly** on different devices
5. **Commit your changes**: `git commit -m 'feat: add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure responsive design works
- Test API integration

## 📚 Documentation

### Available Documentation
- **[API Documentation](./API_DOCUMENTATION.md)**: Complete API integration guide
- **[Development Guide](./DEVELOPMENT_GUIDE.md)**: Comprehensive development guide
- **[README.md](./README.md)**: This file - project overview

### Code Documentation
- **JSDoc comments**: All functions and components documented
- **Inline comments**: Complex logic explained
- **CSS comments**: Style organization and purpose

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm start
```

#### API Connection Issues
- Check internet connectivity
- Verify API endpoint accessibility
- Review browser console for CORS errors
- Test API with Postman or curl

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Performance Issues
- Check bundle size with `npm run build`
- Optimize images and assets
- Implement code splitting if needed

### Getting Help
1. Check the [troubleshooting section](#-troubleshooting)
2. Review [API documentation](./API_DOCUMENTATION.md)
3. Search existing issues
4. Create a new issue with detailed information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CPSO API**: College of Physicians and Surgeons of Ontario for providing the doctor search API
- **React Community**: For the excellent React ecosystem
- **Create React App**: For the development environment setup
- **Axios**: For reliable HTTP client functionality

## 📞 Support

For support and questions:
- 📧 Create an issue in the repository
- 📖 Check the documentation files
- 🔍 Search existing issues for solutions

---

**Made with ❤️ for the Ontario healthcare community**