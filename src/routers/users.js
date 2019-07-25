const
    express = require('express'),
    User = require('../models/users'),
    router = new express.Router();

//Create User
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(404).send(e);
    }
});

//Read Users
router.get('/users', async (req, res) => {
    const users = await User.find({});
    try {
        if (!users) {
            return res.status(404).send('No Users Found');
        }
        return res.status(200).send(users);
    } catch (e) {
        return res.status(500).send(e);
    }
});

//Read User
router.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('No User Found With That Id');
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

//Update User
router.patch('/users/:userId', async (req, res) => {
    const
        userId = req.params.userId,
        updateOptions = req.body,
        fxnOptions = {
            new: true,
            runValidators: true
        },
        allowedUpdates = [
            'firstName',
            'lastName',
            'email',
            'age'
        ],
        proposedUpdates = Object.keys(updateOptions),
        isValidOperationRequest = proposedUpdates.every(attemptedUpdate => allowedUpdates.includes(attemptedUpdate));
    if (!isValidOperationRequest) {
        return res.status(400).send({ error: "Invalid Request Sent!"});
    }

    try {
        const user = await User.findByIdAndUpdate(userId, updateOptions, fxnOptions);
        if (!user) {
            return res.status(404).send('No User Found To Update');
        }
        res.status(200).send(user);
    } catch (e) {
        return res.status(400).send(e);
    }
});

//Delete User
router.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.send(404).send({ error: `User ${userId} Not Found!` });
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;