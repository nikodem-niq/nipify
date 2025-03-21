import { getCompanyDetailsByNip } from '../src';
import {
  mockSuccessfulLoginResponse,
  mockSuccessfulCompanyDataResponse,
  mockFailedLoginResponse,
  mockEmptyCompanyDataResponse,
  expectedCompanyData
} from './mocks';

// Mock fetch globally
global.fetch = jest.fn();

describe('getCompanyDetailsByNip', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch company details successfully', async () => {
    // Mock successful responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulLoginResponse,
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulCompanyDataResponse,
      }));

    const result = await getCompanyDetailsByNip('1234567890', {
      apiKey: 'test-api-key',
    });

    // Check that fetch was called twice (login and data fetch)
    expect(fetch).toHaveBeenCalledTimes(2);
    
    // Verify the result matches expected data
    expect(result).toEqual({ company: expectedCompanyData });
  });

  it('should work with test environment', async () => {
    // Mock successful responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulLoginResponse,
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulCompanyDataResponse,
      }));

    const result = await getCompanyDetailsByNip('1234567890', {
      apiKey: 'test-api-key',
      testMode: true,
    });

    // Check that the test URL was used
    const firstCallArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(firstCallArgs[0]).toContain('test');
    
    // Verify the result
    expect(result).toEqual({ company: expectedCompanyData });
  });

  it('should throw an error if NIP is not provided', async () => {
    await expect(getCompanyDetailsByNip('', {
      apiKey: 'test-api-key',
    })).rejects.toThrow('NIP is required');
  });

  it('should throw an error if API key is not provided', async () => {
    await expect(getCompanyDetailsByNip('1234567890', {
      apiKey: '',
    })).rejects.toThrow('API key is required');
  });

  it('should throw an error if login fails', async () => {
    // Mock failed login response
    (global.fetch as jest.Mock).mockImplementationOnce(async () => ({
      ok: false,
      status: 401,
    }));

    await expect(getCompanyDetailsByNip('1234567890', {
      apiKey: 'invalid-api-key',
    })).rejects.toThrow('Failed to login to the API');
  });

  it('should throw an error if data fetch fails', async () => {
    // Mock successful login but failed data fetch
    (global.fetch as jest.Mock)
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulLoginResponse,
      }))
      .mockImplementationOnce(async () => ({
        ok: false,
        status: 404,
      }));

    await expect(getCompanyDetailsByNip('1234567890', {
      apiKey: 'test-api-key',
    })).rejects.toThrow('Failed to fetch company data');
  });

  it('should handle custom API URL', async () => {
    // Mock successful responses
    (global.fetch as jest.Mock)
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulLoginResponse,
      }))
      .mockImplementationOnce(async () => ({
        ok: true,
        text: async () => mockSuccessfulCompanyDataResponse,
      }));

    const customUrl = 'https://custom-api.example.com';
    
    await getCompanyDetailsByNip('1234567890', {
      apiKey: 'test-api-key',
      apiUrl: customUrl,
    });

    // Check that custom URL was used
    const firstCallArgs = (global.fetch as jest.Mock).mock.calls[0];
    expect(firstCallArgs[0]).toBe(customUrl);
  });
}); 