const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `MONGODB_URI=mongodb+srv://fullstack:${password}@cluster0.rhdkt.mongodb.net/blogApp?retryWrites=true&w=majority`

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: Boolean,
  likes: Number,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  title: 'CSS is hard',
  author: 'css',
  url: 'www.css.fi',
  likes: 2
})

// eslint-disable-next-line no-constant-condition
if ( false ) {
  blog.save().then(() => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})