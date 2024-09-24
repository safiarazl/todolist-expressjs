import {validate} from "../validation/validation.js";
import {
    loginRegisterUserValidation,
    getUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (request) => {
    const user = validate(loginRegisterUserValidation, request);

    const countUser = await prismaClient.users.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.users.create({
        data: user,
        select: {
            username: true,
        }
    });
}

const login = async (request) => {
    const loginRequest = validate(loginRegisterUserValidation, request);

    const user = await prismaClient.users.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            username: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or password wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or password wrong");
    }
    const token = jwt.sign(
        {username: user.username},
        process.env.SECRET_JWT,
        {expiresIn: '1h'}
    );

    return prismaClient.users.update({
        where: {
            username: user.username
        },
        data: {
            token: token
        },
        select: {
            username: true,
            token: true
        }
    });
}

export default {
    register,
    login
}