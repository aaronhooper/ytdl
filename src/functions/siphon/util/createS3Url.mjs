export default function createS3Url (filename) {
  return 'https://' + process.env.BUCKET + '.s3.' + process.env.REGION +
        '.amazonaws.com/' + encodeURIComponent(filename)
}
