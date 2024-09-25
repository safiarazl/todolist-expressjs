import Joi from "joi";

const loginRegisterUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required(),
    token: Joi.string().max(100).optional()
});

const getUserValidation = Joi.string().max(100).required();

const updateUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    newusername: Joi.string().max(100).optional(),
    password: Joi.string().max(100).optional()
});

export {
    loginRegisterUserValidation,
    getUserValidation,
    updateUserValidation
}