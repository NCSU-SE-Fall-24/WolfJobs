const express = require('express');

const router = express.Router();

const usersApi = require('../../../controllers/api/v1/users_api');

const bodyParser = require('body-parser');
const {checkPermission} = require('../../../middleware/rbacMiddleware');

const jsonParser = bodyParser.json();

router.post('/create-session', jsonParser, checkPermission, usersApi.createSession);
router.post('/signup', checkPermission, usersApi.signUp);
router.post('/edit', jsonParser, checkPermission, usersApi.editProfile);
router.get('/getprofile/:id', checkPermission, usersApi.getProfile);
router.get('/search/:name', checkPermission, usersApi.searchUser);
router.post('/createjob', checkPermission, jsonParser, usersApi.createJob);
router.get('/', jsonParser, checkPermission, usersApi.getUsers);
router.post('/', jsonParser, checkPermission, usersApi.createUser);
router.put('/:id', jsonParser, checkPermission, usersApi.updateUser);
router.delete('/:id', jsonParser, checkPermission, usersApi.deleteUser);
router.get('/fetchapplications', usersApi.fetchApplication);
router.post('/acceptapplication', usersApi.acceptApplication);
router.post('/modifyApplication', jsonParser, usersApi.modifyApplication);
router.post('/generateOTP', usersApi.generateOtp);
router.post('/verifyOTP', usersApi.verifyOtp);
router.post('/rejectapplication', usersApi.rejectApplication);
router.post('/closejob', jsonParser, usersApi.closeJob);
router.post('/createapplication', jsonParser, usersApi.createApplication);
router.post('/save', jsonParser, usersApi.saveJob);
router.delete('/save', jsonParser, usersApi.unsaveJob);

module.exports = router;
