const jwt = require('jsonwebtoken');

const access = {
  'getprofile': ['Manager'],
  'edit': ['Manager'],
  'search ': ['Manager'],
  'createjob': ['Manager'],
  'getUsers': ['Manager'],
  'getJobs': ['Manager', 'Applicant'],
  'createUser': ['Manager'],
  'updateUser': ['Manager'],
  'deleteUser': ['Manager'],
  'fetchapplications': ['Manager', 'Applicant'],
  'acceptapplication': ['Manager', 'Applicant'],
  'modifyApplication': ['Manager', 'Applicant'],
  'generateOTP': ['Manager', 'Applicant'],
  'verifyOTP': ['Manager', 'Applicant'],
  'rejectapplication': ['Manager'],
  'closejob': ['Manager'],
  'createapplication': ['Manager'],
  'save': ['Applicant'],
  'open': [
    'creation-session',
    'signup',
  ],
};

exports.checkPermission = (permission) =>{
  return async (req, res, next) => {
    if (!('Authorization' in req.headers || 'authorization' in req.headers) && access['open'].includes(permission)) {
      next();
    } else if (('Authorization' in req.headers || 'authorization' in req.headers)) {
      const token = req.headers.authorization || req.headers.Authorization;
      const user = await jwt.verify(token.replace('Bearer ', ''), 'wolfjobs');
      if (access[permission].includes(user.role) ) {
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
};
