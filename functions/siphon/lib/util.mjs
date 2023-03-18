export function createResponseObject (object, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(object)
  }
}
