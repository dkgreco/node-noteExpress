const
    // User Editable Parameters
    allowedUpdates = [
        'firstName',
        'lastName',
        'email',
        'age',
        'password'
    ],
    paths = {
        ROUTE_userSignup: '/users/signup',
        ROUTE_userLogin: '/users/login',
        ROUTE_userLogout: '/users/logout',
        ROUTE_keychainDestroy: '/users/logoutAll',
        ROUTE_userHome: '/users',
        ROUTE_userProfile: '/users/me'

    },
    // Dont Touch it
    express = require('express'),
    User = require('../models/users'),
    usersAPI = require('../api/users/users-apiTCWrapper')(),
    auth = require('../middleware/auth').auth,
    router = new express.Router();

//User Management API
  //Sign Up User
  router.post(
      paths.ROUTE_userSignup,
      async (req, res) => usersAPI.userSignup(User, { payload: req.body }, res)
  );

  //Login User
  router.post(
      paths.ROUTE_userLogin,
      async (req, res) => usersAPI.userLogin(User, { email: req.body.email, password: req.body.password }, res)
  );

  //Logout User
  router.post(
      paths.ROUTE_userLogout,
      auth,
      async (req, res) => usersAPI.userLogout({ tokens: req.user.tokens, token: req.token, userObj: req.user}, res)
  );

  //Destroy All Login Tokens for the User
  router.post(
      paths.ROUTE_keychainDestroy,
      auth,
      async (req, res) => usersAPI.destroyUserKeyChain({userObj: req.user}, res)
  );

//Mongo CRUD API - For Direct API Use.  Keep Disabled Unless Testing.
/*  //Create User
  router.post(
      paths.ROUTE_userHome,
      auth,
      async (req, res) => usersAPI.createNewUser(User, { payload: req.body }, res, false)
  );*/

  //Read User Profile
  router.get(
      paths.ROUTE_userProfile,
      auth,
      async (req, res) => usersAPI.getProfileDetails(
          User,
          { owner: req.user._id },
          res
      )
  );

  //Update User
  router.patch(
      paths.ROUTE_userProfile,
      auth,
      async (req, res) => usersAPI.updateUserProfile(
          User,
          { payload: req.body, owner: req.user._id, allowedUpdates },
          res
      )
  );

  //Delete User
  router.delete(
      paths.ROUTE_userProfile,
      auth,
      async (req, res) => usersAPI.deleteUserProfile({ user: req.user }, res)
  );

module.exports = router;