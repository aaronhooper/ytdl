import { S3Client } from '@aws-sdk/client-s3'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

const s3Client = new S3Client({
  region: process.env.REGION
})

export default s3Client
