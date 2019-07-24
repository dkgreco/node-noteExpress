const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    taskName: {
        type: String,
        required: true,
        trim: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    isComplete: {
        type: Boolean,
        default: false
    }
});

module.exports = Task;