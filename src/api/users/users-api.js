const
    //Response Status Codes
    code200 = 200,
    code201 = 201,
    code400 = 400,
    code404 = 404,
    getManagementConsole = () => {
        //Sign Up c500
        async function _signup (Model, data, res) {
            console.log('inside signup api');
                const
                   user = await _create(Model, { data }, res),
                   jwtIssuedToken = await user.generateAuthToken();

                if (!user) {
                    return res.status(code404).send(`Unable to Create ${data} within ${Model.inspect()}`);
                }

                return res.status(code201).send({
                    user,
                    jwtIssuedToken
                });
        }

        //Login c400
        async function _login (Model, data, res) {
                const
                    { email, password } = data,
                    user = await Model.findByCredentials(email, password),
                    jwtIssuedToken = await user.generateAuthToken();

                return res.status(code200).send({
                    user,
                    jwtIssuedToken
                });
        }

        //Logout Single Token c500
        async function _logout (Model, data, res) {
            const { tokens, token, userObj } = data;

            userObj.tokens = tokens.filter(seekToken => {
                return seekToken.token !== token;
            });
            await userObj.save();

            return res.status(200).send('User successfully logged out');
        }

        //Logout Token Chain c500
        async function _logoutDeleteKeyChain (Model, userObj, res) {
            userObj.tokens = [];
            await userObj.save();
            return res.status(200).send('User Keychain Successfully Deleted');
        }

        //Mongo Crud Ops - Users
        //Create User - c500
        async function _create (Model, data, res) {
            let obj = new Model({
                ...data.data
            });
            console.log('obj: ', obj);
            await obj.save();

            if (!obj) {
                return res.status(code404).send(`Unable to create ${payload} within ${Model.inspect()}`);
            }

            return res.status(code201).send(obj);
        }

        // Get User Profile - 500
        async function _readInd (Model, data, res) {
            const
                { owner } = data,
                obj = await Model.findOne({ _id: owner});

                if (!obj) {
                    return res.status(code404).send(`Unable to locate ${Model.inspect()} by id:[${owner}]`);
                }

                return res.status(code200).send(obj);
        }

        //Update User Profile c400
        async function _update (Model, data, res) {
            const
                { payload, allowedUpdates, owner } = data,
                proposedUpdates = Object.keys(payload),
                isValidOperationRequest = proposedUpdates.every(attemptedUpdate => allowedUpdates.includes(attemptedUpdate));

            if (!isValidOperationRequest) {
                return res.status(code400).send({ error: "UPDATE CALL ERR: Invalid Request Sent!"});
            }

            let obj = await Model.findOne({_id: owner});

            proposedUpdates.forEach(update => obj[update] = payload[update]);
            await obj.save();

            return res.status(code200).send(obj);
        }

        //Delete User Profile - 500
        async function _delete (Model, data, res) {
            const { user } = data;
            let obj =  user.remove();

            return res.status(code200).send(obj);
        }

        return {
            userLogin: _login,
            userLogout: _logout,
            userSignup: _signup,
            destroyUserKeyChain: _logoutDeleteKeyChain,
            createNewUser: _create,
            getProfileDetails: _readInd,
            updateUserProfile: _update,
            deleteUserProfile: _delete
        };
    };

module.exports = getManagementConsole;