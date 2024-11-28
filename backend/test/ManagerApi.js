const chai = require('chai');
const chaiHttp = require('chai-http');
// eslint-disable-next-line no-unused-vars
const server = require('../index');
const User = require('../models/user');
chai.should();
chai.use(chaiHttp);

describe('Manager APIs', () => {
  email = 'admin@gmail.com';
  password = 'password';
  beforeEach(async () => {
    User.findOne = async () => {
      return {
        _id: '6742437b7ac6976625692013',
        email: 'admin@admin.com',
        isVerified: true,
        password: 'password',
        name: 'm1',
        role: 'Manager',
        address: '',
        phonenumber: '',
        hours: '',
        gender: '',
        availability: '',
        affiliation: 'nc-state-dining',
        skills: ['all'],
        savedJobs: [],
        createdAt: '2024-11-23T21:04:59.311Z',
        updatedAt: '2024-11-25T22:32:42.852Z',
        __v: 0,
      };
    };
    User.findById = async () => {
      return {
        _id: '6742437b7ac6976625692013',
        email: 'admin@admin.com',
        isVerified: true,
        password: 'password',
        name: 'm1',
        role: 'Manager',
        address: '',
        phonenumber: '',
        hours: '',
        gender: '',
        availability: '',
        affiliation: 'nc-state-dining',
        skills: ['all'],
        savedJobs: [],
        createdAt: '2024-11-23T21:04:59.311Z',
        updatedAt: '2024-11-25T22:32:42.852Z',
        __v: 0,
      };
    };
    User.create = async () => {
      return {
        _id: '6742437b7ac6976625692013',
        email: 'admin@admin.com',
        isVerified: true,
        password: 'password',
        name: 'm1',
        role: 'Manager',
        address: '',
        phonenumber: '',
        hours: '',
        gender: '',
        availability: '',
        affiliation: 'nc-state-dining',
        skills: ['all'],
        savedJobs: [],
        createdAt: '2024-11-23T21:04:59.311Z',
        updatedAt: '2024-11-25T22:32:42.852Z',
        __v: 0,
      };
    };
  });

  /**
   * Creates a session by sending a POST request to the create-session endpoint.
   * @return {Promise<Object>} The response from the server.
   */
  async function createSession() {
    const res = await chai.request('http://localhost:8000').post('/api/v1/users/create-session').send({
      email,
      password,
    });
    return res;
  }
  it('create-session should run successfully', async () => {
    const res = await createSession();
    res.should.have.status(200);
    res.should.be.json;
    res.body.data.should.have.property('token');
  });

  it('get-profile should run successfully', async () => {
    const token = (await createSession()).body.data.token;
    const res = await chai
        .request('http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000')
        .get('/api/v1/users/getprofile/6742437b7ac6976625692013')
        .set('authorization', token)
        .send();
    res.should.have.status(200);
    res.should.be.json;
    // res.body.data.should.have.property('user');
  });

  it('get-Users should run successfully', async () => {
    const token = (await createSession()).body.data.token;
    const res = await chai
        .request('http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000')
        .get('/api/v1/users/getUsers')
        .set('authorization', token)
        .send();
    res.should.have.status(200);
  });
});
