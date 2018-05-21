const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const server = 'http://localhost:3000'

chai.use(chaiHttp)

describe('Users signup and signin', () => {
  it('expect to signup user', (done) => {
    chai.request(server)
    .post('/users/signup')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234',
      role: 'user'
    })
    .end((err, res) => {
      expect(res.status).to.equal(201)
      expect(res.body).to.ownProperty('message').to.equal('insert new user succeed')
      expect(res.body.data).to.ownProperty('_id').to.be.a('string')
      expect(res.body.data).to.ownProperty('email').to.be.a('string').to.equal('test@mail.com')
      expect(res.body.data).to.ownProperty('password').to.be.a('string')
      expect(res.body.data).to.ownProperty('role').to.be.a('string').to.equal('user')
      done()
    })
  })
  it('expect to signin user', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((err, res) => {
      expect(res.status).to.equal(200)
      expect(res.body).to.ownProperty('message').to.equal('sign in succeed')
      expect(res.body).to.ownProperty('token').to.be.a('string')
      expect(res.body).to.ownProperty('payload').to.be.a('object')
      done()
    })
  })
  
})

describe('Items', () => {
  it('expect to add item', (done) => {
    chai.request(server)
    .post('/items')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      name: 'Test',
      description: 'Test description',
      price: 1000,
      img: 'Image-test.jpg',
      item_obj: 'test.obj',
      item_mtl: 'test.mtl,test.jpg',
      scale: '1,1,1'
    })
    .end((err, res) => {
      expect(res).to.have.status(201)
      expect(res.body).to.ownProperty('message').to.equal('New item added')
      expect(res.body.data).to.ownProperty('_id').to.be.a('string')
      expect(res.body.data).to.ownProperty('name').to.be.a('string').to.equal('Test')
      // expect(res.body.item).to.ownProperty('description').to.be.a('string').to.equal('Test description')
      expect(res.body.data).to.ownProperty('price').to.be.a('number').to.equal(1000)
      expect(res.body.data).to.ownProperty('img').to.be.a('string').to.equal('Image-test.jpg')
      expect(res.body.data).to.ownProperty('item_obj').to.be.a('string').to.equal('test.obj')
      expect(res.body.data).to.ownProperty('item_mtl').to.be.a('array')
      expect(res.body.data).to.ownProperty('scale').to.be.a('array')
      done()
    })
  })
  it('expect read all item', (done) => {
    chai.request(server)
    .get('/items')
    .end((err, res) => {
      expect(res).to.have.status(200)
      expect(res.body).to.ownProperty('message').to.equal('List all item')
      expect(res.body).to.ownProperty('items').to.be.a('array')
      expect(res.body).to.ownProperty('items').have.length(1)
      done()
    })
  })
  it('expect read one item', (done) => {
    chai.request(server)
    .get('/items')
    .end((e, r) => {
      chai.request(server)
      .get('/items/'+r.body.items[0]._id)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.ownProperty('message').to.equal('Item data')
        expect(res.body.item).to.ownProperty('name').to.be.a('string').to.equal('Test')
        expect(res.body.item).to.ownProperty('description').to.be.a('string').to.equal('Test description')
        expect(res.body.item).to.ownProperty('price').to.be.a('number').to.equal(1000)
        expect(res.body.item).to.ownProperty('img').to.be.a('string').to.equal('Image-test.jpg')
        expect(res.body.item).to.ownProperty('item_obj').to.be.a('string').to.equal('test.obj')
        // expect(res.body.data).to.haveOwnProperty('item_mtl')
        // expect(res.body.data).to.haveOwnProperty('scale')
        done()
      })
    })
  })
  it('expect update item', (done) => {
    chai.request(server)
    .get('/items')
    .end((e, r) => {
      chai.request(server)
      .put('/items/'+r.body.items[0]._id)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        name: 'Test update',
        price: 2000,
        img: 'Image test update',
        item_obj: 'testupdate.obj'
      })
      .end((er, re) => {
        expect(re).to.have.status(200)
        expect(re.body).to.ownProperty('message').to.equal('Update item success')
        chai.request(server)
        .get('/items/'+r.body.items[0]._id)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.ownProperty('message').to.equal('Item data')
          expect(res.body.item).to.ownProperty('name').to.be.a('string').to.equal('Test update')
          expect(res.body.item).to.ownProperty('price').to.be.a('number').to.equal(2000)
          expect(res.body.item).to.ownProperty('img').to.be.a('string').to.equal('Image test update')
          expect(res.body.item).to.ownProperty('item_obj').to.be.a('string').to.equal('testupdate.obj')
          done()
        })
      })
    })
  })
  
})

describe('Cart', () => {
  it('expect to add to cart', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((e, r) => {
      chai.request(server)
      .get('/items')
      .end((er, re) => {
        chai.request(server)
        .post('/cart')
        .set('token', r.body.token)
        .send({
          itemId: re.body.items[0]._id,
          quantity: 1,
          totalPrice: re.body.items[0].price
        })
        .end((err, res) =>{
          expect(res).to.have.status(201)
          expect(res.body).to.ownProperty('message').to.equal('Added New Item to Cart')
          expect(res.body.data).to.ownProperty('isCheckout').to.be.a('boolean').to.equal(false)
          expect(res.body.data).to.ownProperty('userId').to.be.a('string')
          expect(res.body.data).to.ownProperty('itemId').to.be.a('string')
          expect(res.body.data).to.ownProperty('quantity').to.be.a('number').to.equal(1)
          expect(res.body.data).to.ownProperty('totalPrice').to.be.a('number').to.equal(2000)
          done()
        })
      })
    })
  })
  it('expect to show cart', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((e, r) => {
      chai.request(server)
      .get('/cart')
      .set('token', r.body.token)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.ownProperty('message').to.equal('Cart')
        expect(res.body).to.ownProperty('cart').to.be.a('array').to.have.length(1)
        expect(res.body.cart[0]).to.ownProperty('isCheckout').to.be.a('boolean').to.equal(false)
        expect(res.body.cart[0]).to.ownProperty('userId').to.be.a('string')
        expect(res.body.cart[0]).to.ownProperty('itemId')
        expect(res.body.cart[0]).to.ownProperty('quantity').to.be.a('number').to.equal(1)
        expect(res.body.cart[0]).to.ownProperty('totalPrice').to.be.a('number').to.equal(2000)
        done()
      })
    })
  })
  it('expect to checkout', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((e, r) => {
      chai.request(server)
      .get('/cart')
      .set('token', r.body.token)
      .end((er, re) => {
        chai.request(server)
        .put('/cart/'+re.body.cart[0]._id)
        .end((errr, ress) => {
          expect(ress).to.have.status(201)
          expect(ress.body).to.ownProperty('message').to.equal('Checkout')
          expect(ress.body).to.ownProperty('data').to.be.a('object')
          chai.request(server)
          .get('/cart')
          .set('token', r.body.token)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.ownProperty('message').to.equal('Cart')
            expect(res.body).to.ownProperty('cart').to.be.a('array').to.have.length(1)
            expect(res.body.cart[0]).to.ownProperty('isCheckout').to.be.a('boolean').to.equal(true)
            expect(res.body.cart[0]).to.ownProperty('userId').to.be.a('string')
            expect(res.body.cart[0]).to.ownProperty('itemId')
            expect(res.body.cart[0]).to.ownProperty('quantity').to.be.a('number').to.equal(1)
            expect(res.body.cart[0]).to.ownProperty('totalPrice').to.be.a('number').to.equal(2000)
            done()
          })
        })
      })
    })
  })
  it('expect tp increase quantity', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((e, r) => {
      chai.request(server)
      .get('/cart')
      .set('token', r.body.token)
      .end((er, re) => {
        chai.request(server)
        .put('/cart/increase/'+re.body.cart[0]._id)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.ownProperty('message').to.equal('quantity is increment by 1')
          done()
        })
      })
    })
  })
  it('expect tp decrease quantity', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((e, r) => {
      chai.request(server)
      .get('/cart')
      .set('token', r.body.token)
      .end((er, re) => {
        chai.request(server)
        .put('/cart/decrease/'+re.body.cart[0]._id)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.ownProperty('message').to.equal('quantity is decrement by 1')
          done()
        })
      })
    })
  })
  it('expect to clear cart', (done) => {
    chai.request(server)
    .post('/users/signin')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      email: 'test@mail.com',
      password: 'test1234'
    })
    .end((e, r) => {
      chai.request(server)
      .get('/cart')
      .set('token', r.body.token)
      .end((er, re) => {
        chai.request(server)
        .delete('/cart/'+re.body.cart[0]._id)
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res.body).to.ownProperty('message').to.equal('Clear cart')
          done()
        })
      })
    })
  })
})

describe('delete user and item', () => {
  it('expect to remove user', (done) => {
    chai.request(server)
    .delete(`/users/test@mail.com`)
    .end((err, res) => {
      expect(res).to.have.status(200)
      expect(res.body).to.ownProperty('message').to.equal('user removed')
      done()
    })
  })
  it('expect to delete item', () => {
    chai.request(server)
    .get('/items')
    .end((e, r) => {
      chai.request(server)
      .delete('/items/'+r.body.items[0]._id)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.ownProperty('message').to.equal('Delete success')
      })
    })
  })
})
