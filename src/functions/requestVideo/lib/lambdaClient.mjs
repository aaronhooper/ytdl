import { LambdaClient } from '@aws-sdk/client-lambda'
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
  dotenv.config()
}

const lambdaClient = new LambdaClient({
  region: process.env.REGION
})

export default lambdaClient
