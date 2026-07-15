import { ROLES } from "../constants/roles";
import { MESSAGES } from "../constants/messages";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { signToken } from "../utils/jwt.util";
import { mapUserToResponse } from "../utils/blog-mapper.util";
import { comparePassword } from "../utils/password.util";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const emailExists = await userRepository.emailExists(input.email);
    if (emailExists) {
      throw ApiError.conflict(MESSAGES.AUTH.EMAIL_EXISTS);
    }

    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: input.password,
      role: ROLES.USER,
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: mapUserToResponse(user),
      token,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmailWithPassword(input.email);
    if (!user) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.password) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    let isMatch = false;
    try {
      isMatch = await comparePassword(input.password, user.password);
    } catch (error) {
      console.error("Password compare failed:", error);
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!isMatch) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...publicUser } = user;

    return {
      user: mapUserToResponse(publicUser),
      token,
    };
  },

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound(MESSAGES.AUTH.USER_NOT_FOUND);
    }
    return mapUserToResponse(user);
  },
};
