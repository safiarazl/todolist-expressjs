import {validate} from "../validation/validation.js";
import {
    createTaskValidation,
    getTaskValidation,
    updateTaskValidation,
    searchTaskValidation
} from "../validation/task-validation.js";
import {prismaClient} from "../config/database.js";
import {ResponseError} from "../error/response-error.js";
import {logger} from "../config/logging.js";

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
    // logger.info(`user = ${JSON.stringify(user)} & taskid = ${JSON.stringify(request)}`);
    const taskId = validate(getTaskValidation, request);

    const task = await prismaClient.tasks.findFirst({
        where: {
            username: user.username,
            id: parseInt(taskId.taskid),
            isDeleted: false
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
    logger.info(`user = ${JSON.stringify(user)} & taskid = ${JSON.stringify(request)}`);
    const task = validate(updateTaskValidation, request);
    logger.info(`task = ${JSON.stringify(task)}`);

    const totalTaskInDatabase = await prismaClient.tasks.count({
        where: {
            username: user.username,
            id: parseInt(task.id),
            isDeleted: false
        }
    });

    if (totalTaskInDatabase !== 1) {
        throw new ResponseError(404, "task is not found");
    }

    return prismaClient.tasks.update({
        where: {
            id: parseInt(task.id)
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

const remove = async (user, request) => {
    const taskId = validate(getTaskValidation, request);

    const totalTaskInDatabase = await prismaClient.tasks.count({
        where: {
            username: user.username,
            id: parseInt(taskId.taskid),
            isDeleted: false
        }
    });

    if (totalTaskInDatabase !== 1) {
        throw new ResponseError(404, "task is not found");
    }

    return prismaClient.tasks.update({
        where: {
            id: parseInt(taskId.taskid)
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(Date.now())
        },
        select: {
            title: true,
            description: true,
            completed: true,
            username: true,
            isDeleted: true
        }
    });
}

const hardremove = async (user, request) => {
    const taskId = validate(getTaskValidation, request);

    const totalTaskInDatabase = await prismaClient.tasks.count({
        where: {
            username: user.username,
            id: parseInt(taskId.taskid),
        }
    });

    if (totalTaskInDatabase !== 1) {
        throw new ResponseError(404, "task is not found");
    }

    return prismaClient.tasks.delete({
        where: {
            id: parseInt(taskId.taskid)
        },
        select: {
            title: true,
            description: true,
            completed: true,
            username: true
        }
    })
}

const search = async (user, request) => {
    const task = validate(searchTaskValidation, request);
    logger.warn(`task = ${JSON.stringify(task)}`);
    const skip = task.size * (task.page - 1);
    
    const tasks = await prismaClient.tasks.findMany({
        where: {
            username: user.username,
            AND: {
                OR: [
                    {
                        title: {
                            contains: task.title
                        }
                    },
                    {
                        description: {
                            contains: task.description
                        }
                    },
                    {
                        completed: task.completed
                    }
                ],
            }
        },
        skip: skip,
        take: task.size,
        select: {
            title: true,
            description: true,
            completed: true,
            username: true
        }
    });

    const totalItems = await prismaClient.tasks.count({
        where: {
            username: user.username,
            isDeleted: false,
            AND: {
                OR: [
                    {
                        title: {
                            contains: task.title
                        }
                    },
                    {
                        description: {
                            contains: task.description
                        }
                    },
                    {
                        completed: task.completed
                    }
                ],
            }
        }
    });

    return {
        data: tasks,
        paging: {
            page: task.page,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / task.size)
        }
    }
}

export default {
    create,
    update,
    get,
    remove,
    hardremove,
    search
}