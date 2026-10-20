export const makeValidClassName = (inputString: string) => {
  return inputString.replace(/[^a-zA-Z0-9]/g, '-')
}
