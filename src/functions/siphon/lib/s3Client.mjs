import { S3Client } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

const s3Client = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.DDB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
  }
})

export default s3Client
