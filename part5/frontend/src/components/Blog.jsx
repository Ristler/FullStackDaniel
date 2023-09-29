
import Togglable from '../components/Togglable'


const Blog = ({ blog, giveLikes, deleteBlogs, returnUsername }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5

  }

 

  return (

    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
      </div>
      <div>
        <Togglable buttonLabel="View">
          Url: {blog.url}
          <br/>
          Likes: {blog.likes}
          <button onClick={giveLikes}> Like</button>
          <br/>
          
          <br/>
          <br/>
          {returnUsername === true && (
            <button onClick={deleteBlogs}>Delete</button>
          )}

        </Togglable>
      </div>
    </div>
  )}

export default Blog