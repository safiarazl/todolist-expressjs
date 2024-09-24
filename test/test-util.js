import { prismaClient } from "../config/database.js";
import bcrypt from "bcrypt";

export const createTestUser = async () => {
  await prismaClient.users.create({
    data: {
      username: "test",
      password: await bcrypt.hash("rahasia", 10),
      token: "test",
    },
  });
};

export const getTestUser = async () => {
  return prismaClient.users.findUnique({
    where: {
      username: "test",
    },
  });
};

export const removeTestUser = async () => {
  await prismaClient.users.deleteMany({
    where: {
      username: {
        contains: "test",
      },
    },
  });
};

export const createTestTask = async () => {
  await prismaClient.tasks.create({
    data: {
      username: "test",
      title: "test",
      description: "test",
      completed: false,
    },
  });
};

export const createManyTestTask = async () => {
  for (let i = 0; i < 15; i++) {
    await prismaClient.tasks.create({
      data: {
        username: `test`,
        title: `test ${i}`,
        description: `test ${i}`,
        completed: `test${i}@smail.com`,
      },
    });
  }
};

export const getTestTask = async () => {
  return prismaClient.tasks.findFirst({
    where: {
      username: "test",
    },
  });
};

export const removeAllTestTask = async () => {
  await prismaClient.tasks.deleteMany({
    where: {
      username: {
        contains: "test",
      },
    },
  });
};
