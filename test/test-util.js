import { prismaClient } from "../config/database.js";
import bcrypt from "bcrypt";
import { logger } from "../config/logging.js";

export const createTestUser = async () => {
  await prismaClient.users.create({
    data: {
      username: "test",
      password: await bcrypt.hash("rahasia", 10),
      token: "test"
    },
  });
};

export const goingBackTestUser = async () => {
  const newpassword = await bcrypt.hash("rahasia", 10);
  logger.warn(`new password: ${newpassword}`);
  await prismaClient.users.update({
    where: {
      username: "safiar",
      token: "test"
    },
    data: {
      username: "test",
      password: newpassword
    }
  });
};

export const getTestUser = async () => {
  return prismaClient.users.findFirst({
    where: {
      OR: [
        {
          username: "test",
        },
        {
          token: "test",
        }
      ]
    },
  });
};

export const removeTestUser = async () => {
  await prismaClient.users.deleteMany({
    where: {
      OR: [
        {
          username: "test",
        },
        {
          username: "safiar",
        },
        {
          token: "test",
        }
      ]
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
        description: `test ${i} , dalam deskripsi`,
        completed: false,
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
