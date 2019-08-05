const
    allowedUpdates = [
        'firstName',
        'lastName',
        'email',
        'age',
        'password'
    ],
    express = require('express'),
    User = require('../models/users'),
    crudAPI = require('../api/mongoOps_CRUD')(),
    auth = require('../middleware/auth').auth,
    usrMngmtAPI = require('../api/appOps_UserManagement')(),
    router = new express.Router();

//User Management API
  //Sign Up User
  router.post('/users/signup', async (req, res) => usrMngmtAPI.signup(User, { payload: req.body }, res));

  //Login User
  router.post('/users/login', async (req, res) => usrMngmtAPI.login(User, { email: req.body.email, password: req.body.password }, res));

  //Logout User
  router.post('/users/logout', auth, async (req, res) => usrMngmtAPI.logout(req.user, { tokens: req.user.tokens, token: req.token}, res));
  router.post('/users/logoutAll', auth, async (req, res) => usrMngmtAPI.destroyKeyChain(req.user, res));

//Mongo CRUD API
  //Create User
  router.post('/users', auth, async (req, res) => crudAPI.create(User, { payload: req.body }, res, false));

  //Read User
  router.get('/users/me', auth, async (req, res) => res.status(200).send(req.user));

  //Read Specific User
  router.get('/users/:userId', async (req, res) => crudAPI.readInd(User, { searchId: req.params.userId }, res, false));

  //Update User
  router.patch('/users/:userId', async (req, res) => crudAPI.update(User, { searchId: req.params.userId, payload: req.body }, allowedUpdates, res, false));

  //Delete User
  router.delete('/users/:userId', async (req, res) => crudAPI.delete(User, { searchId: req.params.userId }, res, false));

module.exports = router;