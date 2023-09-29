import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const [user, setUser] = useState(null)

  const [loginVisible, setLoginVisible] = useState(false)
  const [createBlogVisible, setCreateBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

    }
  }, [])

  const blogFormRef = useRef()


  const giveLike = id => {
    const blog = blogs.find(b => b.id === id)
    const newLikes = { ...blog, likes: blog.likes + 1 }

    console.log('Tulostin to help yo! ' + newLikes.likes)

    blogService
      .update(id, newLikes)
      .then(newLikes => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : newLikes))
      })
      .catch(error => {
        setErrorMessage(
          'Error'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = id => {

    const blog = blogs.find(b => b.id === id)
    console.log(blog.user.username)


    if(returnUsername(blog) === true) {
      console.log('Sama logged in käyttäjä! ')


      console.log('Tulostin to help yo! ' + blog.id)
      console.log('User id ' + user.id)

      if(window.confirm('Do you want to remove blog ' + blog.title + ' by ' + blog.author + '?')) {
        blogService
          .deleteBlog(blog.id)
        location.reload()
      }
    } else {
      console.log('Cancelled.')
    }
  }
  //UNDER DEV
  const returnUsername = (blog) => {
    console.log('Stored User:', window.localStorage.getItem('loggedBlogappUser'))
    if(user.username === blog.user.username) {
      return true
    }
    return false
  }
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        location.reload()

      }
      )
  }
  const listBlogs = (blogsToShow) => {
    return (
      <div>
        <ul>
          {blogsToShow.map((blog, i) =>
            <Blog key={i} blog={blog} giveLikes={() => giveLike(blog.id)} deleteBlogs={() => deleteBlog(blog.id)} returnUsername={returnUsername(blog)}   />)}
        </ul>
      </div>
    )
  }

  const blogForm = () => (
    <div>
      <Togglable buttonLabel="New blog" ref={blogFormRef} >
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {listBlogs(blogsToShow)}
    </div>
  )
  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel="Sign in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />

        </Togglable>
      </div>
    )
  }
  const blogsToShow = showAll
    ? blogs
    : blogs.map(blog => blog.name)


  const handleLogout = (event) => {
    localStorage.clear()
    console.log('Logout pressed.. LOGGED OUT.')
    location.reload()

  }


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {


      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )


      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Blogs</h1>

      { errorMessage ? <Notification message={errorMessage} /> : null}
      { successMessage ? <Notification message={successMessage} /> : null}


      {!user && loginForm()}
      {user && <div>

        <p>{user.name} logged in {<button onClick={handleLogout} type="submit">Logout</button>} </p>
        {blogForm()}
      </div>

      }
      <Footer />
    </div>
  )
}


export default App