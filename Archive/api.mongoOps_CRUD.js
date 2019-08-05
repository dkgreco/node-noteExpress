const
    //Response Status Codes
    code200 = 200,
    code201 = 201,
    code400 = 400,
    code404 = 404,
    code500 = 500,
    getManagementConsole = () => {
    //Create
    async function _create (Model, data, res, bypassDirectAPICall) {
        const
            { payload } = data,
            obj = new Model(payload);
        try {
            await obj.save();
            if (!obj) {
                return res.status(code404).send(`Unable to create ${payload} within ${Model.inspect()}`);
            }
            if (bypassDirectAPICall) {
                return obj;
            } else {
                return res.status(code201).send(obj);
            }
        } catch (e) {
            return res.status(code500).send(e);
        }
    }

    //Read
    async function _read (Model, res, bypassDirectAPICall) {
        let data = {};
        const list = await Model.find(data);
        try {
            if (!list) {
                return res.status(code404).send(`Unable to locate ${Model.inspect()}`);
            }
            if (bypassDirectAPICall) {
                return list;
            } else {
                return res.status(code200).send(list);
            }
        } catch (e) {
            return res.status(code500).send(e);
        }
    }

    async function _readInd (Model, data, res, bypassDirectAPICall) {
        const
            { searchId } = data,
            obj = await Model.findById(searchId);
        try {
            if (!obj) {
                return res.status(code404).send(`Unable to locate ${Model.inspect()} by id:[${searchId}]`);
            }
            if (bypassDirectAPICall) {
                return obj;
            } else {
                return res.status(code200).send(obj);
            }
        } catch (e) {
            return res.status(code500).send(e);
        }
    }

    //Update
    async function _update (Model, data, allowedUpdates, res, bypassDirectAPICall) {
        const
            { payload, searchId } = data,
            proposedUpdates = Object.keys(payload),
            isValidOperationRequest = proposedUpdates.every(attemptedUpdate => allowedUpdates.includes(attemptedUpdate));

        if (!isValidOperationRequest) {
            return res.status(code400).send({ error: "UPDATE CALL ERR: Invalid Request Sent!"});
        }

        try {
            const
                obj = await Model.findById(searchId);
                proposedUpdates.forEach(update => obj[update] = payload[update]);

            await obj.save();

            if (!obj) {
                return res.status(code404).send(`Unable to update ${Model.inspect()} by id:[${searchId}]`);
            }
            if (bypassDirectAPICall) {
                return obj;
            } else {
                return res.status(code200).send(obj);
            }
        } catch (e) {
            return res.status(code400).send(e);
        }
    }

     //Delete
     async function _delete (Model, data, res, bypassDirectAPICall) {
         try {
             const
                 { searchId } = data,
                 obj = await Model.findByIdAndDelete(searchId);

             if (!obj) {
                 return res.status(code404).send({ error: `Unable to delete ${Model.inspect()} by id:[${searchId}]` });
             }
             if (bypassDirectAPICall) {
                 return obj;
             } else {
                 return res.status(code200).send(obj);
             }
         } catch (e) {
             res.status(code500).send(e);
         }
     }

    return {
        create: _create,
        read: _read,
        readInd: _readInd,
        update: _update,
        delete: _delete
    }
};

module.exports = getManagementConsole;