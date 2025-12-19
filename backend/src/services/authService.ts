import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const user = await User.create(data);

  const token = generateToken(user._id.toString(), user.email);

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const user = await User.findOne({ email: data.email });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(data.password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user._id.toString(), user.email);

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
  };
};
