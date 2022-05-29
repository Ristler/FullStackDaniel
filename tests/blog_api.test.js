const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)


const User = require('../models/user')
const Blog = require('../models/blog')
//done
describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

//DONE
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
//DONE
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})
//DONE
test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'TDD harms architecture'
  )
})

describe('viewing a specific note', () => {

  //DONE
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

    expect(resultBlog.body).toEqual(processedBlogToView)
  })


  //DONE!
  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    console.log(validNonexistingId)

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  //FAILED!

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '628cad999c47f63aae4x7778'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})


//Adding valid blog works, invalid doesn't.
test('Adding a valid blog ', async () => {

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'testi',
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const authors = blogsAtEnd.map(n => n.title)
      expect(authors).toContain(
        'async/await simplifies making async calls')
  })
  test('Fails if invalid blog is added', async () => {
    const newBlog = {
      likes: 'Must fail'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
