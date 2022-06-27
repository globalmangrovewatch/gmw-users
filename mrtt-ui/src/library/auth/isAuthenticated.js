const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  // TODO: Validate token instead of just checking for existence
  return token != null
}

export default isAuthenticated
