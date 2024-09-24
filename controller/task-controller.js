import taskService from "../service/task-service.js";

const create = async (req, res, next) => {
    try {
        const result = await taskService.create(req.user, req.body);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await taskService.get(req.user, req.params);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const request = req.body;
        request.id = req.params.taskId;
        const result = await taskService.update(req.user, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update
}