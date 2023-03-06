export async function postVideo (url) {
  return fetch(import.meta.env.VITE_VIDEO_LAMBDA_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ url })
  }).then(response => response.json())
    .then(body => body.jobId)
}

async function getVideo (jobId) {
  return fetch(import.meta.env.VITE_VIDEO_LAMBDA_ENDPOINT + '?' + new URLSearchParams({ jobId }), {
    method: 'GET'
  })
}

export async function backoffUntilComplete (startMillis, jobId) {
  let currentMillis = startMillis

  for (;;) {
    const response = await getVideo(jobId)
    const json = await response.json()

    console.dir(json)

    if (json.status === 'COMPLETED') {
      return json.downloadLink
    }

    console.log(`Not ready yet, retrying in ${currentMillis} ms ...`)
    await timeout(currentMillis)
    currentMillis = currentMillis * 2
  }
}

async function timeout (millis) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, millis)
  })
}
