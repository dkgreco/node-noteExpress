const
    express = require('express'),
    Task = require('../models/tasks'),
    router = new express.Router();

//Create Task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Read Tasks
router.get('/tasks', async (req, res) => {
    try {
        const taskList = await Task.find({});
        if (!taskList) {
            return res.status(404).send('Task List Not Found');
        }
        return res.status(200).send(taskList);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Read Individual Task
router.get('/tasks/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).send(task);
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Update Task
router.patch('/tasks/:taskId', async (req, res) => {
    const
        taskId = req.params.taskId,
        updateOptions = req.body,
        fxnOptions = {
            new: true,
            runValidators: true
        },
        allowedUpdates = [
            'taskName',
            'taskDescription',
            'isComplete'
        ],
        proposedUpdates = Object.keys(updateOptions),
        isValidOperationRequest = proposedUpdates.every(attemptedUpdate => allowedUpdates.includes(attemptedUpdate));

    if (!isValidOperationRequest) {
        res.status(404).send({ error: "Unable to Update Task"});
    }

    try {
        const task = await Task.findByIdAndUpdate(taskId, updateOptions, fxnOptions);
        if (!task) {
            res.status(404).send({ error: "Unable to Update Task"});
        }
        res.status(200).send(task);
    } catch (e) {
        return res.status(400).send(e);
    }
});

//Delete Task
router.delete('/tasks/:taskId', async (req, res) => {
    const taskId = req.body.taskId;
    try {
        const task = Task.findByIdAndDelete(taskId);
        if (!task) {
            res.status(404).send({ error: "Unable to Delete Task"});
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e)
    }
});

module.exports = router;