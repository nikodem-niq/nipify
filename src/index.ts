/**
 * Company details interface representing information fetched from GUS registry
 */
export interface CompanyDetails {
  /** Company name */
  companyName?: string;
  /** City where company is registered */
  city?: string;
  /** Postal code */
  postalCode?: string;
  /** Street name */
  street?: string;
  /** Building number */
  addressOne?: string;
  /** Apartment or office number */
  addressTwo?: string;
}

/**
 * Options for the getCompanyDetailsByNip function
 */
export interface GetCompanyOptions {
  /** API key for the GUS registry service */
  apiKey: string;
  /** Custom API URL (optional) */
  apiUrl?: string;
  /** Whether to use test environment instead of production */
  testMode?: boolean;
  /** CORS proxy URL to use when running in browser environments (e.g., 'https://your-cors-proxy.com/') */
  corsProxy?: string;
}

const DEFAULT_API_URL = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';
const DEFAULT_TEST_API_URL = 'https://wyszukiwarkaregontest.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';

/**
 * Get company details by NIP (Polish VAT identification number)
 * Fetches company information from the Polish GUS registry (Główny Urząd Statystyczny)
 * 
 * @param nip - Polish VAT identification number (10 digits)
 * @param options - Configuration options including API key
 * @returns Promise with company details
 * @throws Error if NIP is missing, API key is missing, or if API requests fail
 */
export async function getCompanyDetailsByNip(
  nip: string,
  options: GetCompanyOptions
): Promise<{ company: CompanyDetails }> {
  if (!nip) {
    throw new Error('NIP is required');
  }

  if (!options.apiKey) {
    throw new Error('API key is required');
  }

  const baseApiUrl = options.testMode 
    ? (options.apiUrl || DEFAULT_TEST_API_URL)
    : (options.apiUrl || DEFAULT_API_URL);
    
  // Use CORS proxy if provided
  const apiUrl = options.corsProxy 
    ? `${options.corsProxy}${baseApiUrl}` 
    : baseApiUrl;

  try {
    const rawLoginXml = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
xmlns:ns="http://CIS/BIR/PUBL/2014/07">
<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
<wsa:To>${baseApiUrl}</wsa:To>
<wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj</wsa:Action>
</soap:Header>
<soap:Body>
<ns:Zaloguj>
<ns:pKluczUzytkownika>${options.apiKey}</ns:pKluczUzytkownika>
</ns:Zaloguj>
</soap:Body>
</soap:Envelope>`;

    const sidResponse = await fetch(apiUrl, {
      method: "POST",
      body: rawLoginXml,
      headers: {
        "Content-Type": "application/soap+xml;charset=UTF-8",
      },
    });

    if (!sidResponse.ok) {
      throw new Error(`Failed to login to the API. Status: ${sidResponse.status}`);
    }

    const sidResponseText = await sidResponse.text();
    const sid = parseSidString(sidResponseText);

    if (sid === -1) {
      throw new Error('Failed to parse session ID from API response');
    }

    const rawFindXml = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
<soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
<wsa:To>${baseApiUrl}</wsa:To>
<wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty</wsa:Action>
</soap:Header>
<soap:Body>
<ns:DaneSzukajPodmioty>
<ns:pParametryWyszukiwania>
<dat:Nip>${nip}</dat:Nip>
</ns:pParametryWyszukiwania>
</ns:DaneSzukajPodmioty>
</soap:Body>
</soap:Envelope>`;

    const findCompanyResponse = await fetch(apiUrl, {
      method: "POST",
      body: rawFindXml,
      headers: {
        "Content-Type": "application/soap+xml;charset=UTF-8",
        sid: sid.toString(),
      },
    });

    if (!findCompanyResponse.ok) {
      throw new Error(`Failed to fetch company data. Status: ${findCompanyResponse.status}`);
    }

    const companyData = await findCompanyResponse.text();
    const parsedCompanyData = parseCompanySoapDataToJson(companyData);
    
    return { company: parsedCompanyData };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Company finding error: ${error.message}`);
    }
    throw new Error('Unknown error occurred while fetching company data');
  }
}

/**
 * Parse session ID from SOAP response
 * 
 * @param sidResponse - SOAP response text containing the session ID
 * @returns Session ID string or -1 if not found
 * @internal
 */
function parseSidString(sidResponse: string): number | string {
  const startIndex = sidResponse.indexOf("<ZalogujResult>") + "<ZalogujResult>".length;
  const endIndex = sidResponse.indexOf("</ZalogujResult>");

  if (startIndex !== -1 && endIndex !== -1) {
    const result = sidResponse.substring(startIndex, endIndex);
    return result;
  }
  return -1;
}

/**
 * Parse company data from SOAP response
 * 
 * @param soapCompanyData - SOAP response text containing company data
 * @returns Parsed company details object
 * @internal
 */
function parseCompanySoapDataToJson(soapCompanyData: string): CompanyDetails {
  const companyNameRegex = /Nazwa&gt;([^<&]+)&lt;/;
  const companyNameMatch = companyNameRegex.exec(soapCompanyData);
  const companyName = companyNameMatch ? companyNameMatch[1] : undefined;

  const cityRegex = /Miejscowosc&gt;([^<&]+)&lt;/;
  const cityMatch = cityRegex.exec(soapCompanyData);
  const city = cityMatch ? cityMatch[1] : undefined;

  const postalCodeRegex = /KodPocztowy&gt;([^<&]+)&lt;/;
  const postalCodeMatch = postalCodeRegex.exec(soapCompanyData);
  const postalCode = postalCodeMatch ? postalCodeMatch[1] : undefined;

  const streetRegex = /Ulica&gt;([^<&]+)&lt;/;
  const streetMatch = streetRegex.exec(soapCompanyData);
  const street = streetMatch ? streetMatch[1] : undefined;

  const addressOneRegex = /NrNieruchomosci&gt;([^<&]+)&lt;/;
  const addressOneMatch = addressOneRegex.exec(soapCompanyData);
  const addressOne = addressOneMatch ? addressOneMatch[1] : undefined;

  const addressTwoRegex = /NrLokalu&gt;([^<&]+)&lt;/;
  const addressTwoMatch = addressTwoRegex.exec(soapCompanyData);
  const addressTwo = addressTwoMatch ? addressTwoMatch[1] : undefined;

  return {
    companyName,
    city,
    postalCode,
    street,
    addressOne,
    addressTwo,
  };
} 