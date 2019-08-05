const
    //Response Status Codes
    code200 = 200,
    code201 = 201,
    code400 = 400,
    code404 = 404,
    getManagementConsole = () => {
    //Mongo Crud Ops - Users
        //Create Task
        async function _create (Model, data, res) {
            const { payload, owner} = data;
            let obj = new Model({
                ...payload,
                owner
            });

            await obj.save();

            if (!obj) {
                return res.status(code404).send(`Unable to create ${payload} within ${Model.inspect()}`);
            }

            return res.status(code201).send(obj);
        }

        //Read All Tasks
        async function _read (Model, data, res) {
            const { owner } = data,
                list = await Model.find({ owner });

            if (!list) {
                return res.status(code404).send(`Unable to locate ${Model.inspect()}`);
            }

            return res.status(code200).send(list);
        }

        //Read Single Task
        async function _readInd (Model, data, res) {
            const { searchId, owner } = data,
                obj = await Model.findOne({ _id: searchId, owner});

            if (!obj) {
                return res.status(code404).send(`Unable to locate ${Model.inspect()} by id:[${searchId}]`);
            }

            return res.status(code200).send(obj);
        }

        //Update Task
        async function _update (Model, data, res) {
            const { payload, searchId, owner, allowedUpdates } = data,
                    proposedUpdates = Object.keys(payload),
                    isValidOperationRequest =
                        proposedUpdates.every(attemptedUpdate => allowedUpdates.includes(attemptedUpdate));

            if (!isValidOperationRequest) {
                return res.status(code400).send({ error: "UPDATE CALL ERR: Invalid Request Sent!"});
            }

            let obj = await Model.findOne({_id: searchId, owner});

            proposedUpdates.forEach(update => obj[update] = payload[update]);

            await obj.save();

            return res.status(code200).send(obj);
        }

        //Delete Task
        async function _delete (Model, data, res) {
            const { searchId, owner } = data;
            let obj = await Model.findOneAndDelete({ _id: searchId, owner });

            if (!obj) {
                return res.status(code404).send(`Unable to delete Task by id:[${searchId}]`);
            }

            return res.status(code200).send(obj);
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