import {validate} from "../validation/validation.js";
import {
    createTaskValidation,
    getTaskValidation,
    updateTaskValidation,
    searchTaskValidation
} from "../validation/task-validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../error/response-error.js";

const create = async (user, request) => {
    const task = validate(createTaskValidation, request);
    task.username = user.username;

    return prismaClient.tasks.create({
        data: task,
        select: {
            title: true,
            description: true,
            completed: true,
            username: true
        }
    });
}

const get = async (user, request) => {
    const taskId = validate(getTaskValidation, request);

    const task = await prismaClient.tasks.findFirst({
        where: {
            username: user.username,
            id: taskId
        },
        select: {
            title: true,
            description: true,
            completed: true,
            username: true
        }
    });

    if (!task) {
        throw new ResponseError(404, "task is not found");
    }

    return task;
}

const update = async (user, request) => {
    const task = validate(updateTaskValidation, request);

    const totalTaskInDatabase = await prismaClient.tasks.count({
        where: {
            username: user.username,
            id: task.id
        }
    });

    if (totalTaskInDatabase !== 1) {
        throw new ResponseError(404, "task is not found");
    }

    return prismaClient.tasks.update({
        where: {
            id: task.id
        },
        data: {
            title: task.title,
            description: task.description,
            completed: task.completed
        },
        select: {
            title: true,
            description: true,
            completed: true,
            username: true
        }
    });

}

export default {
    create,
    update,
    get

}