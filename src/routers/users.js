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
        ROUTE_userProfile: '/users/me',
        ROUTE_userAvatar: '/users/me/avatar',
        ROUTE_getUserAvatar: '/users/:id/avatar'
    },
    allowableFileUploadTypes = /\.(tif|tiff|gif|jpeg|jpg|jif|jfif|jp2|jpx|j2k|j2c|fpx|pcd|png|pdf)$/,
    // Dont Touch it
    express = require('express'),
    multer = require('multer'),
    uploadAvatar = multer({
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(allowableFileUploadTypes)) {
                cb(new Error('You must upload an image file.'));
            }

            cb(undefined, true);
            //Silently Reject the call::cb(undefined, false);
        }
    }),
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
  //Get User Avatar
  router.get(
      paths.ROUTE_getUserAvatar,
      async (req, res) => usersAPI.getUserAvatar(User, { owner: req.params.id }, res),
      (error, req, res, next) => res.status(404).send({ error: error.message })
  );

  //Read User Profile
  router.get(
      paths.ROUTE_userProfile,
      auth,
      async (req, res) => usersAPI.getUserProfile(
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

  //Upload User Avatar
  router.post(
      paths.ROUTE_userAvatar,
      auth,
      uploadAvatar.single('avatar'),
      async (req, res) => usersAPI.uploadUserAvatar({ user: req.user, fileData: req.file.buffer }, res),
      (error, req, res, next) => res.status(404).send({ error: error.message })
  );

  //Delete User Avatar
  router.delete(
      paths.ROUTE_userAvatar,
      auth,
      async (req, res) => usersAPI.deleteUserAvatar({ user: req.user }, res)
  );

  //Delete User Profile
  router.delete(
      paths.ROUTE_userProfile,
      auth,
      async (req, res) => usersAPI.deleteUserProfile({ user: req.user }, res)
  );

module.exports = router;