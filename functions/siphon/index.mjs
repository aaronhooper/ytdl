import {
  createResponseObject as response,
  pipeVideoToS3Bucket,
  generateS3Url,
  appendDownloadLinkToJob
} from './lib/util.mjs'

export const handler = async (event) => {
  const url = event.url
  const jobId = event.jobId
  const videoFilename = jobId + '.mp4'
  const oneHourInSecs = 3600
  let signedUrl = ''

  try {
    await pipeVideoToS3Bucket(url, videoFilename)
  } catch (err) {
    console.error(err)
    return response({ message: 'Could not stream video data to bucket' }, 500)
  }

  try {
    signedUrl = await generateS3Url(videoFilename, oneHourInSecs)
  } catch (err) {
    console.error(err)
    return response({ message: 'Could not create presigned url' }, 500)
  }

  try {
    await appendDownloadLinkToJob(jobId, signedUrl)
  } catch (err) {
    console.error(err)
    return response({ message: 'Could not update item in database' }, 500)
  }

  return response({ message: 'Done!' })
}
