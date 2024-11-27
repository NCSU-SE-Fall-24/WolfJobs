let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');

chai.should();
chai.use(chaiHttp);

describe('Tasks API', () => {

    describe("GET /api/v1/users/fetchapplications", () => {
        it("IT SHOULD RETURN ALL THE APPLICATIONS", async () => {
            const response = await chai.request('http://localhost:8000').get("/api/v1/users/fetchapplications")
            response.body.should.be.a('object');
        })
    })

    describe("GET /api/v1/users/", () => {
        it("IT SHOULD RETURN ALL THE JOBS", async () => {
            const response = await chai.request('http://localhost:8000').get("/api/v1/users/")
            response.body.should.be.a('object');
        })

    })

    describe("GET /api/v1/users/", () => {
        it("IT SHOULD RETURN ALL THE JOBS", async () => {
            const response = await chai.request('http://localhost:8000').get("/api/v1/users/")
            response.body.should.be.a('object');
        })

    })

    describe("POST /api/v1/users/createjob", () => {
        it("IT SHOULD RETURN THE JOB", async () => {
            const body = {
                name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10',

            };
            const response = await chai.request('http://localhost:8000').post("/api/v1/users/createjob").send(body)
            response.body.should.be.a('object');
        })
    })

    describe("GET /api/v1/users/search", () => {
        it("IT SHOULD RETURN THE SEARCHED JOB", async () => {
            const body = {
                name: 'Shaan',
                managerid: '1234556',
                skills: 'C,java',
                location: 'Noida',
                description: 'xyz',
                pay: '10',
                schedule: '10/10/10',

            };
            const response = await chai.request('http://localhost:8000').get("/api/v1/users/search/TA").send(body)
            response.body.should.be.a('object');
        })
    })

    describe("POST /api/v1/users/create-session", () => {
        it("IT SHOULD RETURN THE USER", async () => {
            const body = {
                email: 'admin@admin.com',
                password: 'password',
            };
            const response = await chai.request('http://localhost:8000').post("/api/v1/users/create-session").send(body)
            response.body.should.be.a('object');
        })
    })
})