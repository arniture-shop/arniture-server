const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../app')

chai.use(chaiHttp)

describe('Sign Up and Sign In', () => {
  it('Expect create new user', (done) => {
    chai.request(app)
    .post('/users/signup')
    .set('content-type', 'application/x-www-form-urlencoded')
    .type('form')
    .send({
      email: 'test@mail.com',
      password: 'test123',
      role: 'user'
    })
    .end((err, res) => {
      expect(err).to.be.null
      expect(res).to.have.status(201)
      expect(res.body).to.ownProperty('message').to.equal('insert new user succeed')
      expect(res.body).to.ownProperty('data').to.be.an('object')
      expect(res.body.data).to.ownProperty('email').to.be.a('string')
      expect(res.body.data).to.ownProperty('password').to.be.a('string')
      expect(res.body.data).to.ownProperty('role').to.be.a('string')
      expect(res.body.data).to.ownProperty('createdAt').to.be.a('string')
      expect(res.body.data).to.ownProperty('updatedAt').to.be.a('string')
      done()
    })
  })
})