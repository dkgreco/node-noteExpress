const
    express = require('express'),
    app = express(),
    PORT = process.env.PORT;

//Start the MongoDB
require('./db/mongoose');

const
    userRouter = require('./routers/users'),
    taskRouter = require('./routers/tasks');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});