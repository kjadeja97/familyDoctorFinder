const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Web scraping function to search doctors on CPSO Advanced Search
 * @param {Object} searchParams - Search parameters
 * @returns {Array} Array of doctor objects
 */
async function scrapeDoctors(searchParams) {
  let browser;
  try {
    console.log('Starting web scraping...');
    
    // Launch browser with more options for better compatibility
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Navigating to CPSO Advanced Search...');
    
    // Navigate to CPSO Advanced Search
    await page.goto('https://register.cpso.on.ca/Advanced-Search/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('Page loaded, looking for form elements...');

    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('Screenshot saved as debug-screenshot.png');

    // Wait a bit for the page to fully load
    await page.waitForTimeout(3000);

    // Try to find form elements with multiple selectors
    const formSelectors = [
      'form',
      '#searchForm',
      '.search-form',
      '[role="search"]'
    ];

    let formFound = false;
    for (const selector of formSelectors) {
      const form = await page.$(selector);
      if (form) {
        console.log(`Found form with selector: ${selector}`);
        formFound = true;
        break;
      }
    }

    if (!formFound) {
      console.log('No form found, trying alternative approach...');
      return await scrapeDoctorsAlternative(searchParams);
    }

    // Try to fill form fields with multiple possible selectors
    const fieldMappings = {
      FirstName: ['#FirstName', 'input[name="FirstName"]', 'input[placeholder*="first"]'],
      LastName: ['#LastName', 'input[name="LastName"]', 'input[placeholder*="last"]'],
      City: ['#City', 'input[name="City"]', 'input[placeholder*="city"]'],
      PostalCode: ['#PostalCode', 'input[name="PostalCode"]', 'input[placeholder*="postal"]'],
      Language: ['#Language', 'input[name="Language"]', 'input[placeholder*="language"]']
    };

    for (const [field, selectors] of Object.entries(fieldMappings)) {
      if (searchParams[field]) {
        let fieldFound = false;
        for (const selector of selectors) {
          try {
            const element = await page.$(selector);
            if (element) {
              await page.type(selector, searchParams[field]);
              console.log(`Filled ${field} with selector: ${selector}`);
              fieldFound = true;
              break;
            }
          } catch (error) {
            console.log(`Could not fill ${field} with selector ${selector}:`, error.message);
          }
        }
        if (!fieldFound) {
          console.log(`Could not find field for ${field}`);
        }
      }
    }

    // Handle specialty selection
    if (searchParams.Specialty) {
      const specialtySelectors = ['#Specialty', 'select[name="Specialty"]', 'select[name="specialty"]'];
      for (const selector of specialtySelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await page.select(selector, searchParams.Specialty);
            console.log(`Selected specialty: ${searchParams.Specialty}`);
            break;
          }
        } catch (error) {
          console.log(`Could not select specialty with selector ${selector}:`, error.message);
        }
      }
    }

    // Handle gender selection
    if (searchParams.Gender) {
      const genderSelectors = ['#Gender', 'select[name="Gender"]', 'select[name="gender"]'];
      for (const selector of genderSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await page.select(selector, searchParams.Gender);
            console.log(`Selected gender: ${searchParams.Gender}`);
            break;
          }
        } catch (error) {
          console.log(`Could not select gender with selector ${selector}:`, error.message);
        }
      }
    }

    console.log('Submitting form...');

    // Try different submit button selectors
    const submitSelectors = [
      'input[type="submit"]',
      'button[type="submit"]',
      '.search-button',
      '#searchButton',
      'button:contains("Search")',
      'input[value*="Search"]'
    ];

    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const submitButton = await page.$(selector);
        if (submitButton) {
          await page.click(selector);
          console.log(`Clicked submit with selector: ${selector}`);
          submitted = true;
          break;
        }
      } catch (error) {
        console.log(`Could not click submit with selector ${selector}:`, error.message);
      }
    }

    if (!submitted) {
      console.log('Could not find submit button, trying form submission...');
      await page.evaluate(() => {
        const forms = document.querySelectorAll('form');
        if (forms.length > 0) {
          forms[0].submit();
        }
      });
    }

    // Wait for results
    console.log('Waiting for results...');
    await page.waitForTimeout(5000);

    // Take another screenshot after submission
    await page.screenshot({ path: 'debug-results.png' });
    console.log('Results screenshot saved as debug-results.png');

    // Extract data from the page
    const doctors = await page.evaluate(() => {
      const results = [];
      
      // Try multiple selectors for finding doctor information
      const selectors = [
        '.doctor-result',
        '.search-result',
        '.physician-card',
        '.result-item',
        'table tr',
        '.listing-item',
        '.doctor-info',
        '.physician-info',
        '[class*="doctor"]',
        '[class*="physician"]',
        '[class*="result"]'
      ];

      console.log('Extracting data from page...');

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        if (elements.length > 0) {
          elements.forEach((element, index) => {
            const text = element.textContent.trim();
            if (text && text.length > 10) { // Basic validation
              console.log(`Processing element ${index}:`, text.substring(0, 100));
              
              // Try to extract name from text
              const lines = text.split('\n').filter(line => line.trim());
              if (lines.length > 0) {
                const nameLine = lines[0];
                const nameParts = nameLine.split(' ');
                
                results.push({
                  FirstName: nameParts[0] || '',
                  LastName: nameParts.slice(1).join(' ') || '',
                  City: '',
                  PostalCode: '',
                  Gender: '',
                  Language: '',
                  Specialty: '',
                  RawData: text
                });
              }
            }
          });
          
          if (results.length > 0) {
            console.log(`Successfully extracted ${results.length} results with selector: ${selector}`);
            break; // Use first selector that finds results
          }
        }
      }

      return results;
    });

    console.log(`Extracted ${doctors.length} doctors`);
    return doctors;

  } catch (error) {
    console.error('Scraping error:', error);
    throw new Error('Failed to scrape doctor data');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Alternative scraping method using direct form submission
 * This method tries to submit the form and extract data from the response
 */
async function scrapeDoctorsAlternative(searchParams) {
  let browser;
  try {
    console.log('Trying alternative scraping method...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    console.log('Navigating to CPSO Advanced Search (alternative method)...');
    
    // Navigate to the search page
    await page.goto('https://register.cpso.on.ca/Advanced-Search/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-alt-screenshot.png' });
    console.log('Alternative method screenshot saved as debug-alt-screenshot.png');

    // Fill form fields
    const formData = {};
    if (searchParams.FirstName) formData.FirstName = searchParams.FirstName;
    if (searchParams.LastName) formData.LastName = searchParams.LastName;
    if (searchParams.City) formData.City = searchParams.City;
    if (searchParams.PostalCode) formData.PostalCode = searchParams.PostalCode;
    if (searchParams.Gender) formData.Gender = searchParams.Gender;
    if (searchParams.Language) formData.Language = searchParams.Language;
    if (searchParams.Specialty) formData.Specialty = searchParams.Specialty;

    console.log('Filling form fields...');

    // Try to find and fill form elements
    for (const [key, value] of Object.entries(formData)) {
      try {
        const selector = `input[name="${key}"], select[name="${key}"]`;
        const element = await page.$(selector);
        if (element) {
          const tagName = await element.evaluate(el => el.tagName.toLowerCase());
          if (tagName === 'select') {
            await page.select(selector, value);
            console.log(`Selected ${key}: ${value}`);
          } else {
            await page.type(selector, value);
            console.log(`Typed ${key}: ${value}`);
          }
        } else {
          console.log(`Could not find field for ${key}`);
        }
      } catch (error) {
        console.log(`Could not fill field ${key}:`, error.message);
      }
    }

    console.log('Submitting form...');

    // Submit form
    await page.click('input[type="submit"], button[type="submit"], .search-button');
    
    // Wait for results
    await page.waitForTimeout(5000);

    // Take screenshot after submission
    await page.screenshot({ path: 'debug-alt-results.png' });
    console.log('Alternative results screenshot saved as debug-alt-results.png');

    // Extract data from the page
    const doctors = await page.evaluate(() => {
      const results = [];
      
      console.log('Extracting data with alternative method...');
      
      // Try different selectors for doctor information
      const selectors = [
        '.doctor-result',
        '.search-result',
        '.physician-card',
        '.result-item',
        'table tr',
        '.listing-item',
        'div[class*="doctor"]',
        'div[class*="physician"]',
        'div[class*="result"]',
        'li',
        'p'
      ];

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector}`);
        
        if (elements.length > 0) {
          elements.forEach((element, index) => {
            const text = element.textContent.trim();
            if (text && text.length > 10) { // Basic validation
              console.log(`Processing element ${index}:`, text.substring(0, 100));
              
              // Try to extract name from text
              const lines = text.split('\n').filter(line => line.trim());
              if (lines.length > 0) {
                const nameLine = lines[0];
                const nameParts = nameLine.split(' ');
                
                results.push({
                  FirstName: nameParts[0] || '',
                  LastName: nameParts.slice(1).join(' ') || '',
                  City: '',
                  PostalCode: '',
                  Gender: '',
                  Language: '',
                  Specialty: '',
                  RawData: text
                });
              }
            }
          });
          
          if (results.length > 0) {
            console.log(`Successfully extracted ${results.length} results with selector: ${selector}`);
            break; // Use first selector that finds results
          }
        }
      }

      return results;
    });

    console.log(`Alternative method extracted ${doctors.length} doctors`);
    return doctors;

  } catch (error) {
    console.error('Alternative scraping error:', error);
    throw new Error('Failed to scrape doctor data');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// API Routes

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

/**
 * POST /api/search
 * Search for doctors using web scraping
 */
app.post('/api/search', async (req, res) => {
  try {
    const searchParams = req.body;
    
    console.log('Search parameters:', searchParams);
    
    // Validate required parameters
    if (!searchParams) {
      return res.status(400).json({ 
        error: 'Search parameters are required' 
      });
    }

    // Try primary scraping method first
    let doctors = [];
    try {
      doctors = await scrapeDoctors(searchParams);
    } catch (error) {
      console.log('Primary scraping failed, trying alternative method...');
      try {
        doctors = await scrapeDoctorsAlternative(searchParams);
      } catch (altError) {
        console.error('Both scraping methods failed:', altError);
        return res.status(500).json({ 
          error: 'Failed to retrieve doctor data',
          details: 'Both scraping methods failed. The website structure may have changed. Check the debug screenshots in the server directory.',
          debug: {
            screenshots: ['debug-screenshot.png', 'debug-results.png', 'debug-alt-screenshot.png', 'debug-alt-results.png']
          }
        });
      }
    }

    console.log(`Found ${doctors.length} doctors`);
    
    res.json(doctors);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

/**
 * GET /api/specialties
 * Get list of available specialties
 */
app.get('/api/specialties', (req, res) => {
  const specialties = [
    'Family Medicine',
    'General Practice',
    'Internal Medicine',
    'Pediatrics',
    'Obstetrics and Gynecology',
    'Dermatology',
    'Cardiology',
    'Psychiatry',
    'Neurology',
    'General Surgery',
    'Orthopedic Surgery',
    'Urology',
    'Anesthesiology',
    'Gastroenterology',
    'Endocrinology and Metabolism',
    'Diagnostic Radiology',
    'Medical Oncology',
    'Hematology',
    'Respirology',
    'Rheumatology',
    'Ophthalmology',
    'Otolaryngology – Head and Neck Surgery',
    'Emergency Medicine',
    'Plastic Surgery',
    'Pathology',
    'Infectious Diseases',
    'Nephrology',
    'Physical Medicine and Rehabilitation',
    'Occupational Medicine',
    'Public Health and Preventive Medicine',
    'Geriatric Medicine',
    'Pain Medicine'
  ];
  
  res.json(specialties);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
});

module.exports = app; 