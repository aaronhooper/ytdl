import { URL } from 'url'

export function isValidUrl (str) {
  try {
    new URL(str) // eslint-disable-line no-new
    return true
  } catch (err) {
    return false
  }
}
