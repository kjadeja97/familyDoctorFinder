# Development Guide

## Table of Contents
1. [Project Setup](#project-setup)
2. [Code Structure](#code-structure)
3. [Development Workflow](#development-workflow)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Contributing](#contributing)

## Project Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Git for version control

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd familyDoctorFinder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Starts development server |
| `npm test` | Runs test suite |
| `npm run build` | Creates production build |
| `npm run eject` | Ejects from Create React App |

## Code Structure

### File Organization

```
familyDoctorFinder/
├── public/                 # Static assets
│   └── index.html         # Main HTML file
├── src/                   # Source code
│   ├── App.js            # Main application component
│   ├── App.css           # App-specific styles
│   ├── index.js          # React entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
├── API_DOCUMENTATION.md  # API integration guide
└── DEVELOPMENT_GUIDE.md  # This file
```

### Component Architecture

#### App Component (`src/App.js`)
- **Purpose**: Main application component
- **State Management**: Uses React hooks for local state
- **API Integration**: Handles CPSO API calls
- **Form Handling**: Manages search form state and submission

#### Key Functions

```javascript
// Form state management
const [formData, setFormData] = useState({...});

// API call handler
const handleSubmit = async (e) => {
  // API integration logic
};

// Form reset handler
const clearForm = () => {
  // Reset form to initial state
};
```

### Styling Architecture

#### Global Styles (`src/index.css`)
- CSS reset and base styles
- Component-specific styles
- Responsive design utilities
- Animation and transition effects

#### App-specific Styles (`src/App.css`)
- Layout and spacing
- Typography styles
- Responsive adjustments

## Development Workflow

### 1. Feature Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make changes**
   - Follow the coding standards
   - Add appropriate comments
   - Test your changes

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/new-feature
   ```

### 2. Code Standards

#### JavaScript/React
- Use functional components with hooks
- Follow JSDoc commenting standards
- Use meaningful variable and function names
- Implement proper error handling

#### CSS
- Use BEM methodology for class naming
- Keep styles modular and reusable
- Use CSS custom properties for theming
- Ensure responsive design

#### Git Commit Messages
- Use conventional commit format
- Prefix with type: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`
- Write descriptive commit messages

### 3. Code Review Checklist

- [ ] Code follows project standards
- [ ] All tests pass
- [ ] No console errors
- [ ] Responsive design works
- [ ] API integration tested
- [ ] Documentation updated

## Testing

### Manual Testing

1. **Form Functionality**
   - Test all input fields
   - Verify form submission
   - Check form reset functionality

2. **API Integration**
   - Test successful API calls
   - Test error handling
   - Verify loading states

3. **Responsive Design**
   - Test on different screen sizes
   - Verify mobile functionality
   - Check cross-browser compatibility

### Automated Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Structure

```javascript
// Example test for App component
describe('App Component', () => {
  test('renders search form', () => {
    // Test implementation
  });

  test('handles form submission', () => {
    // Test API integration
  });

  test('displays loading state', () => {
    // Test loading functionality
  });
});
```

## Deployment

### Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Test production build locally**
   ```bash
   npx serve -s build
   ```

3. **Deploy to hosting platform**
   - Netlify, Vercel, or similar
   - Configure environment variables if needed
   - Set up custom domain if required

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
REACT_APP_API_URL=https://doctors.cpso.on.ca/api/Search
REACT_APP_ENVIRONMENT=production
```

## Contributing

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

### Pull Request Guidelines

- **Title**: Clear, descriptive title
- **Description**: Explain what and why, not how
- **Screenshots**: Include if UI changes
- **Testing**: Describe how you tested
- **Breaking Changes**: Note any breaking changes

### Code Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Code quality checks
   - Security scans

2. **Manual Review**
   - Code quality review
   - Functionality testing
   - Documentation review

3. **Approval and Merge**
   - At least one approval required
   - All checks must pass
   - Merge to main branch

### Issue Reporting

When reporting issues:

1. **Use the issue template**
2. **Provide detailed information**
3. **Include steps to reproduce**
4. **Add screenshots if applicable**
5. **Specify browser and OS**

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm start
```

#### API Errors
- Check network connectivity
- Verify API endpoint is accessible
- Review browser console for CORS issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

1. **Code Splitting**
   - Implement React.lazy() for components
   - Use dynamic imports for large libraries

2. **Bundle Analysis**
   ```bash
   npm install --save-dev webpack-bundle-analyzer
   npm run build
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

3. **Image Optimization**
   - Use WebP format where possible
   - Implement lazy loading for images
   - Optimize image sizes

## Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [Create React App](https://create-react-app.dev/)
- [Axios Documentation](https://axios-http.com/)

### Tools
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)
- [Postman](https://www.postman.com/) for API testing

### Community
- [React Community](https://reactjs.org/community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react)
- [GitHub Discussions](https://github.com/features/discussions) 