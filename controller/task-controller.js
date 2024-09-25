import { logger } from "express-winston";
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
        const taskId = req.params.taskid;
        request.id = taskId;
        const result = await taskService.update(req.user, request);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await taskService.remove(req.user, req.params);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const hardremove = async (req, res, next) => {
    try {
        const result = await taskService.hardremove(req.user, req.params);
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        const request = {
            title: req.query.title,
            description: req.query.description,
            completed: req.query.completed,
            page: req.query.page,
            size: req.query.size
        }
        const result = await taskService.search(req.user, request);
        res.status(200).json({
            data: result.data,
            paging: result.paging
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update,
    remove,
    hardremove,
    search
}