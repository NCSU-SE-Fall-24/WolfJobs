const express = require('express');

const router = express.Router();
const sendEmail = require('../../../mailer');

const usersApi = require('../../../controllers/api/v1/users_api');

const bodyParser = require('body-parser');
const {checkPermission} = require('../../../middleware/rbacMiddleware');

const jsonParser = bodyParser.json();


router.post('/mail', jsonParser, async (req, res) => {
  const {to, subject, text} = req.body;
  console.log('ooo', req.body);

  if (!to || !subject || !text) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const emailInfo = await sendEmail.sendMail(to, subject, text);
    res.status(200).send({
      message: 'Email sent successfully',
      emailInfo,
    });
  } catch (error) {
    res.status(500).send('Failed to send email');
  }
});
router.post('/create-session', jsonParser, checkPermission('creation-session'), usersApi.createSession);
router.post('/signup', jsonParser, checkPermission('signup'), usersApi.signUp);
router.post('/edit', jsonParser, checkPermission('edit'), usersApi.editProfile);
router.get('/getprofile/:id', checkPermission('getprofile'), usersApi.getProfile);
router.get('/search/:name', checkPermission('search'), usersApi.searchUser);
router.post('/createjob', jsonParser, checkPermission('createjob'), usersApi.createJob);

router.get('/getUsers', jsonParser, checkPermission('getUsers'), usersApi.getUsers);
router.get('/getJobs', jsonParser, checkPermission('getJobs'), usersApi.getJobs);

router.post('/createUser', jsonParser, checkPermission('createUser'), usersApi.createUser);
router.put('/updateUser', jsonParser, checkPermission('updateUser'), usersApi.updateUser);
router.delete('/deleteUser', jsonParser, checkPermission('deleteUser'), usersApi.deleteUser);
router.get('/fetchapplications', jsonParser, checkPermission('fetchapplications'), usersApi.fetchApplication);
router.post('/acceptapplication', jsonParser, checkPermission('acceptapplication'), usersApi.acceptApplication);
router.post('/modifyApplication', jsonParser, checkPermission('modifyApplication'), usersApi.modifyApplication);
router.post('/generateOTP', jsonParser, checkPermission('generateOTP'), usersApi.generateOtp);
router.post('/verifyOTP', jsonParser, checkPermission('verifyOTP'), usersApi.verifyOtp);
router.post('/rejectapplication', jsonParser, checkPermission('rejectapplication'), usersApi.rejectApplication);
router.post('/closejob', jsonParser, checkPermission('closejob'), jsonParser, usersApi.closeJob);
router.post('/createapplication', jsonParser, checkPermission('createapplication'), usersApi.createApplication);
router.post('/save', jsonParser, checkPermission('save'), usersApi.saveJob);
router.delete('/save', jsonParser, checkPermission('save'), usersApi.unsaveJob);


module.exports = router;
