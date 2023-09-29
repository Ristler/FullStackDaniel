const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if(message === 'Wrong username or password') {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
  return (
    <div className="success">
      {message}
    </div>
  )}


export default Notification