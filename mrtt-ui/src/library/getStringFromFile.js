function getStringFromFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = function (e) {
      resolve(e.target.result)
    }
    fr.readAsText(file)
  })
}

export default getStringFromFile
