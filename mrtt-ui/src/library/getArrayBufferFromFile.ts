function getArrayBufferFromFile(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = () => {
      if (fr.result instanceof ArrayBuffer) resolve(fr.result)
      else reject(new Error('Could not read the file as binary data'))
    }
    fr.readAsArrayBuffer(file)
  })
}

export default getArrayBufferFromFile
