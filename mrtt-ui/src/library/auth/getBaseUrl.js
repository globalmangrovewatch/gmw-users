const getBaseUrl = (url) => {
  const pathArray = url.split('/')
  const protocol = pathArray[0]
  const host = pathArray[2]
  return protocol + '//' + host
}

export default getBaseUrl
