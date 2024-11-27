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
router.post('/create-session', jsonParser, checkPermission, usersApi.createSession);
router.post('/signup', jsonParser, checkPermission, usersApi.signUp);
router.post('/edit', jsonParser, checkPermission, usersApi.editProfile);
router.get('/getprofile/:id', checkPermission, usersApi.getProfile);
router.get('/search/:name', checkPermission, usersApi.searchUser);
router.post('/createjob', jsonParser, checkPermission, usersApi.createJob);

router.get('/getUsers', jsonParser, checkPermission, usersApi.getUsers);
router.get('/getJobs', jsonParser, checkPermission, usersApi.getJobs);

router.post('/createUser', jsonParser, checkPermission, usersApi.createUser);
router.put('/updateUser', jsonParser, checkPermission, usersApi.updateUser);
router.delete('/deleteUser', jsonParser, checkPermission, usersApi.deleteUser);
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
