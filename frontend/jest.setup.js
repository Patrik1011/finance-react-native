import '@testing-library/jest-native/extend-expect';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('./services/fetchClient', () => ({
  fetchClient: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
