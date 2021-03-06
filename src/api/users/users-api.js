const
    //Response Status Codes
    code200 = 200,
    code201 = 201,
    code400 = 400,
    code404 = 404,
    sharp = require('sharp'),
    getManagementConsole = () => {
        //Sign Up c500
        async function _signup (Model, data, res) {
                const
                    user = await _create(Model, { data }, res),
                    { sendWelcomeEmail } = require('../../emails/account'),
                    jwtIssuedToken = await user.generateAuthToken();

                if (!user) {
                    return res.status(code404).send(`Unable to Create ${data} within ${Model.inspect()}`);
                }

                sendWelcomeEmail({
                    email: user.email,
                    fName: user.firstName,
                    lName: user.lastName
                });

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

            await obj.save();

            if (!obj) {
                return res.status(code404).send(`Unable to create ${payload} within ${Model.inspect()}`);
            }

            return obj;
        }

        // Get User Avatar - 500
        async function _readAvatar (Model, data, res) {
            const
                { owner } = data,
                obj = await Model.findById(owner);

            if (!obj || !obj.avatar) {
                return res.status(code404).send(`Unable to fetch Avatar for User: [${owner}]`);
            }

            res.set('Content-Type', 'image/png');

            return res.send(obj.avatar);
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

        //Upload User Avatar c400
        async function _uploadUserAvatar (Model, data, res) {
            const
                { user, fileData } = data;
            let obj = user,
                transform = await sharp(fileData).resize({ width: 250, height: 250 }).png().toBuffer();

            obj.avatar = transform;

            await obj.save();

            return res.status(code200).send();
        }

        //Delete User Avatar - 500
        async function _deleteAvatar (Model, data, res) {
            const { user } = data;

            let obj =  user;
            obj.avatar = undefined;
            await obj.save();

            return res.status(code200).send(obj);
        }

        //Delete User Profile - 500
        async function _delete (Model, data, res) {
            const
                { user } = data,
                { sendGoodbyeEmail } = require('../../emails/account');

            sendGoodbyeEmail({
                email: user.email,
                fName: user.firstName
            });

            let obj =  user.remove();

            return res.status(code200).send(obj);
        }

        return {
            userLogin: _login,
            userLogout: _logout,
            userSignup: _signup,
            destroyUserKeyChain: _logoutDeleteKeyChain,
            createNewUser: _create,
            getUserAvatar: _readAvatar,
            getUserProfile: _readInd,
            updateUserProfile: _update,
            uploadUserAvatar: _uploadUserAvatar,
            deleteUserAvatar: _deleteAvatar,
            deleteUserProfile: _delete
        };
    };

module.exports = getManagementConsole;