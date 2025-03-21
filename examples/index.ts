import { getCompanyDetailsByNip } from '../src';

/**
 * Example of using the nipify package to fetch company details
 * 
 * To run this example:
 * 1. Replace 'YOUR_API_KEY' with your actual GUS API key
 * 2. Replace '1234567890' with a valid NIP number
 * 3. Set testMode to true first to avoid using your API quota
 */
async function example() {
  try {
    // Basic usage - production environment
    const { company } = await getCompanyDetailsByNip('1234567890', {
      apiKey: 'YOUR_API_KEY', // Replace with your actual API key
      testMode: true, // Set to false for production
    });

    console.log('Company details:');
    console.log(JSON.stringify(company, null, 2));

    // Example of what the response might look like
    /*
    {
      "companyName": "Example Company Name",
      "city": "Warsaw", 
      "postalCode": "00-001",
      "street": "Example Street",
      "addressOne": "123",
      "addressTwo": "45"
    }
    */
  } catch (error) {
    console.error('Error fetching company details:');
    console.error(error.message);
  }
}

/**
 * Example of using nipify in a browser environment with a CORS proxy
 * 
 * This is required because GUS API doesn't support CORS, which browsers require
 * for security reasons.
 */
async function browserExample() {
  try {
    // Using a CORS proxy for browser environments
    const { company } = await getCompanyDetailsByNip('1234567890', {
      apiKey: 'YOUR_API_KEY',
      testMode: true,
      corsProxy: 'https://cors-proxy.example.com/', // Replace with your CORS proxy URL
    });

    console.log('Company details (browser):');
    console.log(JSON.stringify(company, null, 2));
  } catch (error) {
    console.error('Error fetching company details in browser:');
    console.error(error.message);
  }
}

// Run the example
example(); 

// In a browser environment, you would run the browserExample instead
// browserExample(); 