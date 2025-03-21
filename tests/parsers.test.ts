import { parseSidString, parseCompanySoapDataToJson } from '../src';

describe('parseSidString', () => {
  it('should extract the session ID from a valid response', () => {
    const mockResponse = '<ZalogujResult>test-session-id</ZalogujResult>';
    const result = parseSidString(mockResponse);
    expect(result).toBe('test-session-id');
  });

  it('should return -1 if session ID not found', () => {
    const mockResponse = '<InvalidTag>test-session-id</InvalidTag>';
    const result = parseSidString(mockResponse);
    expect(result).toBe(-1);
  });

  it('should handle empty response', () => {
    const result = parseSidString('');
    expect(result).toBe(-1);
  });
});

describe('parseCompanySoapDataToJson', () => {
  it('should parse company data correctly from a valid response', () => {
    const mockData = `
      <root>
        <dane>
          <Nazwa&gt;Test Company&lt;/Nazwa>
          <Miejscowosc&gt;Warsaw&lt;/Miejscowosc>
          <KodPocztowy&gt;00-001&lt;/KodPocztowy>
          <Ulica&gt;Main Street&lt;/Ulica>
          <NrNieruchomosci&gt;10&lt;/NrNieruchomosci>
          <NrLokalu&gt;15&lt;/NrLokalu>
        </dane>
      </root>
    `;

    const expected = {
      companyName: 'Test Company',
      city: 'Warsaw',
      postalCode: '00-001',
      street: 'Main Street',
      addressOne: '10',
      addressTwo: '15',
    };

    const result = parseCompanySoapDataToJson(mockData);
    expect(result).toEqual(expected);
  });

  it('should handle missing fields', () => {
    const mockData = `
      <root>
        <dane>
          <Nazwa&gt;Test Company&lt;/Nazwa>
          <Miejscowosc&gt;Warsaw&lt;/Miejscowosc>
        </dane>
      </root>
    `;

    const expected = {
      companyName: 'Test Company',
      city: 'Warsaw',
      postalCode: undefined,
      street: undefined,
      addressOne: undefined,
      addressTwo: undefined,
    };

    const result = parseCompanySoapDataToJson(mockData);
    expect(result).toEqual(expected);
  });

  it('should handle empty response', () => {
    const result = parseCompanySoapDataToJson('');
    expect(result).toEqual({
      companyName: undefined,
      city: undefined,
      postalCode: undefined,
      street: undefined,
      addressOne: undefined,
      addressTwo: undefined,
    });
  });
}); 