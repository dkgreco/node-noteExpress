const
    mongoose = require('mongoose'),
    taskSchema = new mongoose.Schema({
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
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }, {
        timestamps: true
    });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;