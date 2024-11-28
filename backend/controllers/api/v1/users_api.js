const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const Job = require('../../../models/job');
const Application = require('../../../models/application');
const AuthOtp = require('../../../models/authOtp');

const nodemailer = require('nodemailer');

require('dotenv').config();

module.exports.createSession = async function(req, res) {
  try {
    console.log('********', req.body);
    const user = await User.findOne({email: req.body.email});
    console.log(user);
    const filterUserObject = {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user._id,
      isVerified: user.isVerified,
      _id: user._id,

    };
    console.log('********', user);
    console.log('********', filterUserObject);
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: 'Invalid username or password',
      });
    }
    return res.status(200).json({
      message: 'Sign In Successful, here is your token, please keep it safe',
      data: {
        token: jwt.sign(filterUserObject, 'wolfjobs', {expiresIn: 24 * 60 * 60 * 5}),
        user: filterUserObject,
      },
      success: true,
    });
  } catch (err) {
    console.log('*******', err);
    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.signUp = async function(req, res) {
  try {
    console.log('jiiiiii');

    if (req.body.password != req.body.confirm_password) {
      return res.json(422, {
        message: 'Passwords do not match',
      });
    }

    User.findOne({email: req.body.email}, function(err, user) {
      if (user) {
        res.set('Access-Control-Allow-Origin', '*');
        return res.json(200, {
          message: 'Sign Up Successful, here is your token, please keep it safe',
          data: {
            token: jwt.sign(user.toJSON(), 'wolfjobs', {
              expiresIn: '100000',
            }),
            user,
          },
          success: true,
        });
      }

      if (!user) {
        // Convert skills from a comma-separated string to an array of strings if it's provided as a string.
        if (typeof req.body.skills === 'string') {
          req.body.skills = req.body.skills.split(',').map((skill) => skill.trim());
        }

        User.create(req.body, function(err, user) {
          if (err) {
            console.log(err);

            return res.json(500, {
              message: 'Internal Server Error',
            });
          }

          res.set('Access-Control-Allow-Origin', '*');
          return res.status(200).json({
            message: 'Sign Up Successful, here is your token, please keep it safe',
            data: {
              token: jwt.sign(user.toJSON(), 'wolfjobs', {
                expiresIn: '100000',
              }),
              user,
            },
            success: true,
          });
        });
      } else {
        return res.json(500, {
          message: 'Internal Server Error',
        });
      }
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.getProfile = async function(req, res) {
  try {
    const user = await User.findById(req.params.id);
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'The User info is',

      data: {
        // user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        user: user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.editProfile = async function(req, res) {
  // if (req.body.password == req.body.confirm_password) {
  try {
    const user = await User.findById(req.body.id);

    user.name = req.body.name;
    user.password = req.body.password;
    user.role = req.body.role;
    user.address = req.body.address;
    user.phonenumber = req.body.phonenumber;
    user.hours = req.body.hours;
    user.availability = req.body.availability;
    user.gender = req.body.gender;
    // user.dob = req.body.dob;
    check = req.body.skills;
    user.skills = check;

    if (typeof req.body.skills === 'string') {
      user.skills = req.body.skills.split(',').map((skill) => skill.trim());
    } else {
      user.skills = req.body.skills;
    }

    await user.save();
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'User is updated Successfully',

      data: {
        // user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
  // } else {
  //   return res.json(400, {
  //     message: "Bad Request",
  //   });
  // }
};

module.exports.searchUser = async function(req, res) {
  try {
    const regex = new RegExp(req.params.name, 'i');

    const users = await Job.find({name: regex});
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'The list of Searched Users',

      data: {
        // user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        users: users,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};


module.exports.createJob = async function(req, res) {
  console.log('body', req.body);
  const user = await User.findOne({_id: req.body.id});
  console.log('Incoming skills:', req.body.skills);
  console.log(user);
  // const skills = req.body.skills ? req.body.skills.split(',').map((skill) => skill.trim()) : []; // Split skills string into an array
  check = req.body.skills;
  try {
    const job = await Job.create({
      name: req.body.name,
      managerid: user._id,
      managerAffilication: user.affiliation,
      type: req.body.type,
      location: req.body.location,
      skills: '',
      description: req.body.description,
      pay: req.body.pay,
      question1: req.body.question1,
      question2: req.body.question2,
      question3: req.body.question3,
      question4: req.body.question4,
    });
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      data: {
        job: job,
        // token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: 'Job Created!!',
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'NOT CREATED',
    });
  }
};

module.exports.getUsers = async function(req, res) {
  const users = await User.find({}).sort('-createdAt');

  // Whenever we want to send back JSON data
  res.set('Access-Control-Allow-Origin', '*');
  return res.json(200, {
    message: 'List of users',

    users: users,
  });
};

module.exports.createUser = async function(req, res) {
  const user = await User.create(req.body);

  // Whenever we want to send back JSON data
  res.set('Access-Control-Allow-Origin', '*');
  return res.json(201, {
    message: 'User Created',
    user: user,
  });
};

module.exports.updateUser = async function(req, res) {
  const update = {};
  for (const key of Object.keys(req.body)) {
    if (req.body[key] !== '') {
      update[key] = req.body[key];
    }
  }
  console.log(update);
  const user = await User.findOneAndUpdate({_id: req.params.id}, {$set: update}, {new: true});

  // Whenever we want to send back JSON data
  res.set('Access-Control-Allow-Origin', '*');
  return res.json(200, {
    message: 'User Updated',
    user: user,
  });
};

module.exports.deleteUser = async function(req, res) {
  await User.deleteOne({_id: req.params.id});
  // Whenever we want to send back JSON data
  res.set('Access-Control-Allow-Origin', '*');
  return res.json(200, {
    message: 'User Deleted',
  });
};
module.exports.fetchApplication = async function(req, res) {
  const application = await Application.find({}).sort('-createdAt');

  // Whenever we want to send back JSON data
  res.set('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    message: 'List of Applications',

    application: application,
  });
};

module.exports.getJobs = async function(req, res) {
  const jobs = await Job.find({}).sort('-createdAt');

  // Whenever we want to send back JSON data
  res.set('Access-Control-Allow-Origin', '*');
  return res.json(200, {
    message: 'List of jobs',

    jobs: jobs,
  });
};

module.exports.createApplication = async function(req, res) {
  // let user = await User.findOne({ _id: req.body.id });
  // check = req.body.skills;

  try {
    const existingApplication = await Application.findOne({
      applicantid: req.body.applicantId,
      jobid: req.body.jobId,
    });

    if (existingApplication) {
      res.set('Access-Control-Allow-Origin', '*');
      return res.json(400, {
        message: 'You have already applied for the job',
        error: true,
      });
    }

    const application = await Application.create({
      // applicantemail: req.body.applicantemail,

      applicantid: req.body.applicantid,
      applicantname: req.body.applicantname,
      applicantemail: req.body.applicantemail,
      applicantskills: req.body.applicantSkills,
      address: req.body.address,
      phonenumber: req.body.phonenumber,
      hours: req.body.hours,
      dob: req.body.dob,
      gender: req.body.gender,
      jobname: req.body.jobname,
      jobid: req.body.jobid,
      managerid: req.body.managerid,
    });
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      data: {
        application: application,
        // token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" })
      },
      message: 'Job Created!!',
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'NOT CREATED',
    });
  }
};

module.exports.modifyApplication = async function(req, res) {
  try {
    const application = await Application.findById(req.body.applicationId);

    application.status = req.body.status;

    // change answer only from screening to grading
    if (req.body.status === 'grading') {
      application.answer1 = req.body.answer1;
      application.answer2 = req.body.answer2;
      application.answer3 = req.body.answer3;
      application.answer4 = req.body.answer4;
    }

    if (req.body.status === 'rating') {
      application.rating = req.body.rating;
    }
    application.save();
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'Application is updated Successfully',
      data: {
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.acceptApplication = async function(req, res) {
  try {
    const application = await Application.findById(req.body.applicationId);

    application.status = '1';

    application.save();
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'Application is updated Successfully',

      data: {
        // user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.rejectApplication = async function(req, res) {
  try {
    const application = await Application.findById(req.body.applicationId);

    application.status = '2';

    application.save();
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'Application is updated Successfully',

      data: {
        // user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        application,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.closeJob = async function(req, res) {
  try {
    const job = await Job.findById(req.body.jobid);

    job.status = 'closed';

    job.save();
    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      message: 'Job is updated Successfully',

      data: {
        // user.JSON() part gets encrypted

        // token: jwt.sign(user.toJSON(), env.jwt_secret, {
        //   expiresIn: "100000",
        // }),
        job,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

/**
 * Creates and returns a nodemailer transport object.
 * @return {object} Nodemailer transport object.
 */
function getTransport() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
}

// Generate OTP ans send email to user
module.exports.generateOtp = async function(req, res) {
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await AuthOtp.create({
      userId: req.body.userId,
      otp: otp,
    });

    const {email} = await User.findById(req.body.userId);
    // Send mail to user
    const mailOptions = {
      from: '"Job Portal" <' + process.env.EMAIL + '>', // sender address
      to: email, // list of receivers
      subject: 'OTP', // Subject line
      html: `<p>Your OTP is ${otp}</p>`, // plain text body
    };

    await getTransport().sendMail(mailOptions);

    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      success: true,
      message: 'OTP is generated Successfully',
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};

module.exports.verifyOtp = async function(req, res) {
  try {
    const authOtp = await AuthOtp.findOne({
      userId: req.body.userId,
      otp: req.body.otp,
    });

    if (!authOtp) {
      return res.json(422, {
        error: true,
        message: 'OTP is not correct',
      });
    }

    authOtp.remove();

    await User.updateOne(
        {_id: req.body.userId},
        {$set: {isVerified: true}},
    );

    res.set('Access-Control-Allow-Origin', '*');
    return res.json(200, {
      success: true,
      message: 'OTP is verified Successfully',
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: 'Internal Server Error',
    });
  }
};
module.exports.saveJob = async function(req, res) {
  try {
    const {userId, jobId} = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }


    if (jobId) {
      if (!user.savedJobs.includes(jobId)) {
        user.savedJobs.push(jobId);
        await user.save();
      }
      await user.populate('savedJobs');

      return res.status(200).json({
        message: 'Job saved successfully',
        success: true,
        data: user.savedJobs,
      });
    } else {
      await user.populate('savedJobs');

      return res.status(200).json({
        message: 'List of saved jobs retrieved successfully',
        success: true,
        data: user.savedJobs,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
      success: false,
    });
  }
};

module.exports.unsaveJob = async function(req, res) {
  try {
    const {userId, jobId} = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false,
      });
    }

    user.savedJobs = user.savedJobs.filter((id) => id != jobId);
    await user.save();
    await user.populate('savedJobs');

    return res.status(200).json({
      message: 'Job unsaved successfully',
      success: true,
      data: user.savedJobs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
      success: false,
    });
  }
};
