import express from "express";
import userController from "../controller/user-controller.js";
import taskController from "../controller/task-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// // User API
// userRouter.get('/api/users/current', userController.get);
// userRouter.patch('/api/users/current', userController.update);
// userRouter.delete('/api/users/logout', userController.logout);

// Task API
userRouter.post('/api/task/create', taskController.create);
userRouter.get('/api/task/:taskid', taskController.get);
// userRouter.put('/api/task/:taskid', taskController.update);
// userRouter.delete('/api/task/:taskid', taskController.remove);
// userRouter.get('/api/task', taskController.search);

export {
    userRouter
}