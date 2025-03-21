# nipify

A lightweight and type-safe TypeScript library to fetch Polish company details by NIP (VAT identification number) from the official GUS (Statistics Poland) registry.

## Features

- Fetch company details using NIP (Polish VAT number)
- Type-safe API with TypeScript
- Built-in error handling
- Support for both production and test GUS environments
- No external dependencies beyond the Fetch API

## Installation

```bash
npm install nipify
# or
yarn add nipify
# or
pnpm add nipify
```

## Quick Start

```typescript
import { getCompanyDetailsByNip } from 'nipify';

async function fetchCompanyInfo() {
  try {
    const { company } = await getCompanyDetailsByNip('1234567890', {
      apiKey: 'YOUR_API_KEY',
    });
    
    console.log(company.companyName); // Company name
    console.log(company.city);        // City
    console.log(company.street);      // Street
    // More fields available...
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

## API Reference

### `getCompanyDetailsByNip(nip, options)`

Fetches company details from the GUS registry using a NIP number.

#### Parameters

- `nip` (string): Polish VAT identification number (10 digits)
- `options` (object): Configuration options
  - `apiKey` (string, required): Your GUS API key
  - `apiUrl` (string, optional): Custom API URL if needed
  - `testMode` (boolean, optional): Set to `true` to use the test environment. Default: `false`
  - `corsProxy` (string, optional): URL of a CORS proxy for browser environments (see Browser Usage section)

#### Returns

Promise that resolves to an object with:

- `company` (object): Company details with the following properties:
  - `companyName` (string, optional): Name of the company
  - `city` (string, optional): City where the company is registered
  - `postalCode` (string, optional): Postal code
  - `street` (string, optional): Street name
  - `addressOne` (string, optional): Building number
  - `addressTwo` (string, optional): Apartment/office number

#### Errors

The function will throw an error if:
- NIP is not provided
- API key is not provided
- API authentication fails
- Company data cannot be retrieved
- Any network or parsing errors occur

## Browser Usage and CORS Issues

The GUS API doesn't support Cross-Origin Resource Sharing (CORS), which means direct requests from browsers will fail with a CORS error like:

```
Access to fetch at 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

### Solutions:

#### 1. Use a CORS Proxy

You can use a CORS proxy to relay requests to the GUS API:

```typescript
const { company } = await getCompanyDetailsByNip('1234567890', {
  apiKey: 'YOUR_API_KEY',
  corsProxy: 'https://your-cors-proxy.com/',
});
```

Popular CORS proxy options:
- Set up your own proxy server
- Use a service like [CORS Anywhere](https://github.com/Rob--W/cors-anywhere)
- Create a serverless function (e.g., using AWS Lambda, Vercel, or Netlify functions)

#### 2. Create a Backend Service

For production applications, the recommended approach is to create a backend service that makes requests to the GUS API and then serves the data to your frontend:

```typescript
// Your backend service
app.get('/api/company/:nip', async (req, res) => {
  try {
    const { company } = await getCompanyDetailsByNip(req.params.nip, {
      apiKey: process.env.GUS_API_KEY,
    });
    res.json({ company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Your frontend
fetch(`/api/company/1234567890`)
  .then(response => response.json())
  .then(data => console.log(data.company));
```

#### 3. Use in Node.js Environments Only

If you're only using this package in Node.js (not in browsers), you don't need to worry about CORS issues.

## How to Get an API Key

To use this package, you need an API key from the Polish GUS registry:

1. Apply for API access at [GUS API Registration](https://api.stat.gov.pl/Home/RegonApi)
2. Complete the registration process to receive your API key
3. Use the key in your application as shown in the examples

## Advanced Usage

### Using the Test Environment

GUS provides a test environment that doesn't count against your API quota:

```typescript
const { company } = await getCompanyDetailsByNip('1234567890', {
  apiKey: 'YOUR_API_KEY',
  testMode: true, // Use test environment
});
```

### Using a Custom API URL

If you need to specify a custom API URL:

```typescript
const { company } = await getCompanyDetailsByNip('1234567890', {
  apiKey: 'YOUR_API_KEY',
  apiUrl: 'https://custom-api-url.example.com',
});
```

## Error Handling

The library provides detailed error messages to help diagnose issues:

```typescript
try {
  const result = await getCompanyDetailsByNip('1234567890', {
    apiKey: 'YOUR_API_KEY',
  });
  // Process result...
} catch (error) {
  if (error.message.includes('NIP is required')) {
    // Handle missing NIP
  } else if (error.message.includes('API key is required')) {
    // Handle missing API key
  } else if (error.message.includes('Failed to login')) {
    // Handle authentication failure
  } else {
    // Handle other errors
  }
}
```

## Development

### Building

To build the package:

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist` directory.

### Testing

The package includes a comprehensive test suite:

```bash
# Run tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests. 