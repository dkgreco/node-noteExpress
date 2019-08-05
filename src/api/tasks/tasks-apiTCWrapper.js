const
    //Response Status Codes
    code500 = 500,
    tryItAPI = require('../../apiDev/tryItAndCatch'),
    tasksAPI = require('./tasks-api')(),
    getManagementConsole = () => {
        //Mongo Crud Ops - Users
        //Create Task
        async function _create (Model, data, res) {
            const { payload, owner } = data;
            await tryItAPI.tryIt(
                tasksAPI.createTask,
                {
                    errCode: code500,
                    errMsg: "Unable to create Task.",
                    Model,
                    payload: {
                        payload,
                        owner
                    }
                },
                res
            );
        }

        //Read All Tasks
        async function _read (Model, data, res) {
            const { owner } = data;
            await tryItAPI.tryIt(
                tasksAPI.readTasks,
                {
                    errCode: code500,
                    errMsg: "Unable to Fetch Task List.",
                    Model,
                    payload: {
                        owner
                    }
                },
                res
            );
        }

        //Read Single Task
        async function _readInd (Model, data, res) {
            const { searchId, owner } = data;
            await tryItAPI.tryIt(
                tasksAPI.readIndTask,
                {
                    errCode: code500,
                    errMsg: "Unable to Fetch Task List.",
                    Model,
                    payload: {
                        searchId,
                        owner
                    }
                },
                res
            );
        }

        //Update Task
        async function _update (Model, data, res) {
            const { payload, searchId, owner, allowedUpdates } = data;
            await tryItAPI.tryIt(
                tasksAPI.updateTask,
                {
                    errCode: code500,
                    errMsg: `Unable to Update Task with id: ${searchId}.`,
                    Model,
                    payload: {
                        payload,
                        searchId,
                        owner,
                        allowedUpdates
                    }
                },
                res
            );
        }

        //Delete Task
        async function _delete (Model, data, res) {
            const { searchId, owner } = data;

            await tryItAPI.tryIt(
                tasksAPI.deleteTask,
                {
                    errCode: code500,
                    errMsg: `Unable to Delete Task with id: ${searchId}.`,
                    Model,
                    payload: {
                        searchId,
                        owner,
                    }
                },
                res
            );
        }

        return {
            createTask: _create,
            readTasks: _read,
            readIndTask: _readInd,
            updateTask: _update,
            deleteTask: _delete
        }
    };

module.exports = getManagementConsole;