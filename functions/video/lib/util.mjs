import { URL } from 'url'

export function isValidUrl (str) {
  try {
    new URL(str) // eslint-disable-line no-new
    return true
  } catch (err) {
    return false
  }
}

export function createResponseObject (object, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(object)
  }
}
