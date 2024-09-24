import Joi from "joi";

const createTaskValidation = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(100).optional(),
    completed: Joi.boolean().default(false)
});

const getTaskValidation = Joi.string().max(100).required();

const updateTaskValidation = Joi.object({
    id: Joi.string().max(100).required(),
    title: Joi.string().max(100).optional(),
    description: Joi.string().max(100).optional(),
    completed: Joi.boolean().optional()
});

const searchTaskValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    completed: Joi.boolean().optional()
});

export {
    createTaskValidation,
    getTaskValidation,
    updateTaskValidation,
    searchTaskValidation
}