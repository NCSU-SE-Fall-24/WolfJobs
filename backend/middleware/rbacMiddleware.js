const jwt = require('jsonwebtoken');

const access = {
  'Manager': [
    '/api/v1/users/edit',
    '/api/v1/users/getprofile/:id',
    '/api/v1/users/search/:name',
    '/api/v1/users/createjob',
    '/api/v1/users/',
    '/api/v1/users/:id',
    'api/v1/users/fetchapplications',
    'api/v1/users/acceptapplication',
    'api/v1/users/modifyApplication',
    'api/v1/users/rejectapplication',
    'api/v1/users/closejob',
    'api/v1/users/createapplication',
    'api/v1/users/generateOTP',
    'api/v1/users/verifyOTP',
  ],
  'Applicant': [
    'api/v1/users/fetchapplications',
    'api/v1/users/acceptapplication',
    'api/v1/users/modifyApplication',
    'api/v1/users/save',
    'api/v1/users/generateOTP',
    'api/v1/users/verifyOTP',
  ],
  'open': [
    '/api/v1/users/create-session',
    '/api/v1/users/signup',
  ],
};
module.exports.checkPermission = async function(req, res, next) {
  if (!('Authorization' in req.headers || 'authorization' in req.headers) && access['open'].includes(req.originalUrl)) {
    next();
  } else if (('Authorization' in req.headers || 'authorization' in req.headers)) {
    const token = req.headers.authorization || req.headers.Authorization;
    const user = await jwt.verify(token.replace('Bearer ', ''), 'wolfjobs');
    console.log(user);
    if (access[user.role].includes(req.originalUrl)) {
      next();
    } else {
      res.status(403).json({
        message: 'Unauthorized',
      });
    }
  } else {
    res.status(403).json({
      message: 'Unauthorized',
    });
  }
};
