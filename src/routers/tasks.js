const
    // User Editable Parameters
    allowedUpdates = [
        'taskName',
        'taskDescription',
        'isComplete'
    ],
    paths = {
        ROUTE_taskHome: '/tasks',
        ROUTE_taskDetails: '/tasks/:taskId'
    },
    // Dont Touch it
    express = require('express'),
    auth = require('../middleware/auth').auth,
    taskAPI = require('../api/tasks/tasks-apiTCWrapper')(),
    Task = require('../models/tasks'),
    router = new express.Router();

//Create Task
router.post(
    paths.ROUTE_taskHome,
    auth,
    async (req, res) => taskAPI.createTask(Task, { payload: req.body,  owner: req.user._id }, res)
);

//Read Tasks
router.get(
    paths.ROUTE_taskHome,
    auth,
    async (req, res) => taskAPI.readTasks(Task, { owner: req.user._id },  res)
);

//Read Individual Task
router.get(
    paths.ROUTE_taskDetails,
    auth,
    async (req, res) => taskAPI.readIndTask(Task, { searchId: req.params.taskId, owner: req.user._id }, res)
);

//Update Task
router.patch(
    paths.ROUTE_taskDetails,
    auth,
    async (req, res) => taskAPI.updateTask(
        Task,
        { searchId: req.params.taskId, payload: req.body, allowedUpdates, owner: req.user._id},
        res)
);

//Delete Task
router.delete(
    paths.ROUTE_taskDetails,
    auth,
    async (req, res) => taskAPI.deleteTask(Task, { searchId: req.params.taskId, owner: req.user._id }, res)
);

module.exports = router;//