// Mock responses for successful API calls
export const mockSuccessfulLoginResponse = `
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
  <s:Body>
    <ZalogujResponse xmlns="http://CIS/BIR/PUBL/2014/07">
      <ZalogujResult>abc123-session-id</ZalogujResult>
    </ZalogujResponse>
  </s:Body>
</s:Envelope>
`;

export const mockSuccessfulCompanyDataResponse = `
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
  <s:Body>
    <DaneSzukajPodmiotyResponse xmlns="http://CIS/BIR/PUBL/2014/07">
      <DaneSzukajPodmiotyResult>
        &lt;root&gt;
          &lt;dane&gt;
            &lt;Regon&gt;123456789&lt;/Regon&gt;
            &lt;Nazwa&gt;Test Company&lt;/Nazwa&gt;
            &lt;Wojewodztwo&gt;MAZOWIECKIE&lt;/Wojewodztwo&gt;
            &lt;Powiat&gt;Warszawa&lt;/Powiat&gt;
            &lt;Gmina&gt;Warszawa&lt;/Gmina&gt;
            &lt;Miejscowosc&gt;Warszawa&lt;/Miejscowosc&gt;
            &lt;KodPocztowy&gt;00-001&lt;/KodPocztowy&gt;
            &lt;Ulica&gt;Test Street&lt;/Ulica&gt;
            &lt;NrNieruchomosci&gt;123&lt;/NrNieruchomosci&gt;
            &lt;NrLokalu&gt;456&lt;/NrLokalu&gt;
          &lt;/dane&gt;
        &lt;/root&gt;
      </DaneSzukajPodmiotyResult>
    </DaneSzukajPodmiotyResponse>
  </s:Body>
</s:Envelope>
`;

// Mock responses for error conditions
export const mockFailedLoginResponse = `
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
  <s:Body>
    <s:Fault>
      <s:Code>
        <s:Value>s:Receiver</s:Value>
      </s:Code>
      <s:Reason>
        <s:Text xml:lang="en-US">Authentication Failed</s:Text>
      </s:Reason>
    </s:Fault>
  </s:Body>
</s:Envelope>
`;

export const mockEmptyCompanyDataResponse = `
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
  <s:Body>
    <DaneSzukajPodmiotyResponse xmlns="http://CIS/BIR/PUBL/2014/07">
      <DaneSzukajPodmiotyResult></DaneSzukajPodmiotyResult>
    </DaneSzukajPodmiotyResponse>
  </s:Body>
</s:Envelope>
`;

// Expected parsed data
export const expectedCompanyData = {
  companyName: 'Test Company',
  city: 'Warszawa',
  postalCode: '00-001',
  street: 'Test Street',
  addressOne: '123',
  addressTwo: '456',
}; 