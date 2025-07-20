# API Documentation

## CPSO Doctor Search API

### Overview
The Family Doctor Finder application integrates with the College of Physicians and Surgeons of Ontario (CPSO) API to search for registered doctors in Ontario.

### Base URL
```
https://doctors.cpso.on.ca/api/Search
```

### Authentication
No authentication is required for this public API endpoint.

### Request Method
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `FirstName` | string | No | Doctor's first name | "John" |
| `LastName` | string | No | Doctor's last name | "Smith" |
| `City` | string | No | City where doctor practices | "Ottawa" |
| `PostalCode` | string | No | Postal code for location search | "K1A 0A6" |
| `Gender` | string | No | Doctor's gender (M/F) | "M" or "F" |
| `Language` | string | No | Languages spoken by doctor | "English, French" |
| `Specialty` | string | No | Medical specialty | "Family Medicine" |

### Request Example

```javascript
const payload = {
  "FirstName": "",
  "LastName": "",
  "City": "Ottawa",
  "PostalCode": "",
  "Gender": "",
  "Language": "",
  "Specialty": "Family Medicine"
};

const headers = {
  "Content-Type": "application/json"
};

const response = await axios.post('https://doctors.cpso.on.ca/api/Search', payload, { headers });
```

### Response Format

The API returns an array of doctor objects with the following structure:

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
  },
  // ... more doctors
]
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `FirstName` | string | Doctor's first name |
| `LastName` | string | Doctor's last name |
| `City` | string | City where doctor practices |
| `PostalCode` | string | Postal code of practice location |
| `Gender` | string | Doctor's gender (M/F) |
| `Language` | string | Languages spoken by doctor |
| `Specialty` | string | Medical specialty |

### Error Handling

The API may return various HTTP status codes:

- **200**: Success - Returns array of doctors
- **400**: Bad Request - Invalid parameters
- **500**: Server Error - Internal server error

### Rate Limiting

The API may have rate limiting in place. It's recommended to:
- Implement proper error handling
- Add delays between requests if needed
- Cache results when possible

### Usage Examples

#### Search by City
```javascript
const searchByCity = {
  "City": "Toronto",
  "Specialty": "Family Medicine"
};
```

#### Search by Name
```javascript
const searchByName = {
  "FirstName": "John",
  "LastName": "Smith"
};
```

#### Search by Gender and Language
```javascript
const searchByGenderAndLanguage = {
  "Gender": "F",
  "Language": "French",
  "Specialty": "Family Medicine"
};
```

### Implementation Notes

1. **Empty Parameters**: Leave parameters empty (`""`) to search without that criteria
2. **Case Sensitivity**: Search is case-insensitive
3. **Partial Matches**: The API supports partial matching for text fields
4. **Multiple Results**: The API can return multiple doctors matching the criteria

### Testing the API

You can test the API using curl:

```bash
curl -X POST https://doctors.cpso.on.ca/api/Search \
  -H "Content-Type: application/json" \
  -d '{
    "City": "Ottawa",
    "Specialty": "Family Medicine"
  }'
```

### Browser Compatibility

The API supports CORS and can be called directly from web browsers. The application uses Axios for HTTP requests, which provides:

- Automatic JSON parsing
- Error handling
- Request/response interceptors
- Browser compatibility 