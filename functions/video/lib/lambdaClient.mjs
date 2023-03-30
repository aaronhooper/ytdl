import { LambdaClient } from '@aws-sdk/client-lambda'

const lambdaClient = new LambdaClient({
  region: process.env.REGION
})

export default lambdaClient
