const
    express = require('express'),
    app = express(),
    PORT = process.env.PORT || 3050;

require('./db/mongoose');

const
    User = require('./models/users'),
    Task = require('./models/tasks');

app.use(express.json());

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.send(user);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);
    task.save().then(() => {
        res.send(task);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});