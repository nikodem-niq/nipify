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

// Run the example
example(); 