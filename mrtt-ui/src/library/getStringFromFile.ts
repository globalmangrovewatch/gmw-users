function getStringFromFile(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = () => {
      if (typeof fr.result === 'string') resolve(fr.result)
      else reject(new Error('Could not read the file as text'))
    }
    fr.readAsText(file)
  })
}

export default getStringFromFile
