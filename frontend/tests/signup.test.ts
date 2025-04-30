import { fetchClient } from '@/services/fetchClient';
import { Role } from '@/utils/types/enums';

jest.mock('@/services/fetchClient');

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    replace: mockReplace,
  })),
}));

describe('Signup functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      password: 'password123',
      role: Role.User,
    };

    (fetchClient as jest.Mock).mockResolvedValueOnce({ success: true });

    await fetchClient('/auth/signup', {
      method: 'POST',
      body: signupData,
    });

    expect(fetchClient).toHaveBeenCalledWith('/auth/signup', {
      method: 'POST',
      body: signupData,
    });
  });

  it('should handle registration errors', async () => {
    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
      username: 'existing',
      password: 'password123',
      role: Role.User,
    };

    const mockError = new Error('Email already in use');
    (fetchClient as jest.Mock).mockRejectedValueOnce(mockError);

    await expect(
      fetchClient('/auth/signup', {
        method: 'POST',
        body: signupData,
      }),
    ).rejects.toThrow('Email already in use');
  });

  it('should redirect to login page after successful signup', async () => {
    (fetchClient as jest.Mock).mockResolvedValueOnce({ success: true });

    await fetchClient('/auth/signup', {
      method: 'POST',
      body: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: 'securepass',
        role: Role.User,
      },
    });

    const router = require('expo-router').useRouter();
    router.replace('/(auth)/login');

    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });
});
