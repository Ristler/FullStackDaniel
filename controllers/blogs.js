

   
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})
  
//FIXAA TÄMÄ, ETTÄ APP EI CRASH JOS KENTÄT ON TYHJÄT.
blogsRouter.post('/', async (request, response) => {
 

  const { title, author, url, likes} = request.body

  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  try {

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
}catch (err) {
  console.log("error.")
  response.status(400)
}})

//TOIMII.
blogsRouter.delete('/:id', async (request, response) => {
 await  Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
  }
  Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})
module.exports = blogsRouter