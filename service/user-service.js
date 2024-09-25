import { validate } from "../validation/validation.js";
import {
  loginRegisterUserValidation,
  getUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../config/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logger } from "express-winston";

const register = async (request) => {
  const user = validate(loginRegisterUserValidation, request);

  const countUser = await prismaClient.users.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.users.create({
    data: user,
    select: {
      username: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginRegisterUserValidation, request);

  const user = await prismaClient.users.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }
  const token = jwt.sign({ username: user.username }, process.env.SECRET_JWT, {
    expiresIn: "1h",
  });

  return prismaClient.users.update({
    where: {
      username: user.username,
    },
    data: {
      token: token,
    },
    select: {
      username: true,
      token: true,
    },
  });
};

const get = async (user) => {
  const username = validate(getUserValidation, user);

  const userResult = await prismaClient.users.findUnique({
    where: {
      username: username,
      isDeleted: false,
    },
    select: {
      username: true,
      token: true,
    },
  });

  if (!userResult) {
    throw new ResponseError(404, "User is not found");
  }

  return userResult;
};

const update = async (user) => {
  const updateUser = validate(updateUserValidation, user);

  const totalUserInDatabase = await prismaClient.users.count({
    where: {
      username: updateUser.username,
      isDeleted: false,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "User is not found");
  }

  if (updateUser.newusername) {
    const countUser = await prismaClient.users.count({
      where: {
        username: updateUser.newusername,
        isDeleted: false,
      },
    });

    if (countUser === 1) {
      throw new ResponseError(400, "New username already exists");
    }
  }

  return prismaClient.users.update({
    where: {
      username: updateUser.username,
    },
    data: {
      username: updateUser.newusername ? updateUser.newusername : updateUser.username,
      password: await bcrypt.hash(updateUser.password, 10),
    },
    select: {
      username: true,
    },
  });
};

const logout = async (user) => {
  const username = validate(getUserValidation, user);

  const totalUserInDatabase = await prismaClient.users.count({
    where: {
      username: username,
      isDeleted: false,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "User is not found");
  }

  return prismaClient.users.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  login,
  get,
  update,
  logout
};
