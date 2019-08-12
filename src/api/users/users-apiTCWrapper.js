const
    //Response Status Codes
    code500 = 500,
    usersAPI = require('./users-api')(),
    tryItAPI = require('../../apiDev/tryItAndCatch'),
    getManagementConsole = () => {
        //Sign Up
        async function _signup (Model, data, res) {
            console.log('inside signup wrapper');
            await tryItAPI.tryIt(
                usersAPI.userSignup,
                {
                    errCode: code500,
                    errMsg: "Unable to sign up.",
                    Model,
                    payload: data.payload
                },
                res
             );
        }

        //Login
        async function _login (Model, data, res) {
            await tryItAPI.tryIt(
                usersAPI.userLogin,
                {
                    errCode: code500,
                    errMsg: "Unable to Log In.",
                    Model,
                    payload: {
                        email: data.email,
                        password: data.password
                    }
                },
                res
            );
        }

        //Logout Single Token
        async function _logout (data, res) {
            await tryItAPI.tryIt(
                usersAPI.userLogout,
                {
                    errCode: code500,
                    errMsg: "Unable to Log Out.",
                    Model: 'No Model Passed',
                    payload: {
                        token: data.token,
                        tokens: data.tokens,
                        userObj: data.userObj
                    }
                },
                res
            );
        }

        //Logout Token Chain
        async function _logoutDeleteKeyChain (userObj, res) {
            await tryItAPI.tryIt(
                usersAPI.destroyUserKeyChain,
                {
                    Model: 'No Model Passed',
                    errCode: code500,
                    errMsg: "Unable to Delete User Keychain.",
                    payload: userObj.userObj
                },
                res
            );
        }

    //Mongo Crud Ops - Users
        //Create User
        async function _create (Model, data, res) {
            const { payload } = data;
            await tryItAPI.tryIt(
                usersAPI.createNewUser,
                {
                    errCode: code500,
                    errMsg: "Unable to Create User.",
                    Model,
                    payload: {
                        email: data.email,
                        password: data.password
                    }
                },
                res
            );
        }

        // Get User Profile
        async function _readInd (Model, data, res) {
            const { owner } = data;
            await tryItAPI.tryIt(
                usersAPI.getProfileDetails,
                {
                    errCode: code500,
                    errMsg: "Unable to Fetch User Profile.",
                    Model,
                    payload: {
                        owner
                    }
                },
                res
            )
        }

        //Update User Profile
        async function _update (Model, data, res) {
            const { payload, allowedUpdates, owner } = data;
            await tryItAPI.tryIt(
                usersAPI.updateUserProfile,
                {
                    errCode: code500,
                    errMsg: "Unable to Update User Profile.",
                    Model,
                    payload: {
                        payload,
                        allowedUpdates,
                        owner
                    }
                },
                res
            );
        }

        //Delete User Profile
        async function _delete (data, res) {
            const { user } = data;
            await tryItAPI.tryIt(
                usersAPI.deleteUserProfile,
                {
                    errCode: code500,
                    errMsg: "Unable to Delete User.",
                    Model: 'No Model Passed',
                    payload: {
                        user
                    }
                },
                res
            )
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