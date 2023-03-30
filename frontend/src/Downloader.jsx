import { useRef, useState } from 'react'
import DownloaderStatus from './DownloaderStatus'
import validator from 'validator'
import { postVideo, backoffUntilComplete } from './lib/backend.js'

export default function Downloader () {
  const [url, setUrl] = useState('https://youtu.be/jNQXAC9IVRw')
  const [status, setStatus] = useState('')
  const [downloadLink, setDownloadLink] = useState('')
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  function urlInvalid (url) {
    return !validator.isURL(url)
  }

  function handleChange (e) {
    // We capture the textbox value before setting with setUrl,
    // because we can't be sure that the React state has been updated
    // in time to be used reliably later in the function.
    const nextUrl = e.target.value
    setUrl(nextUrl)

    if (urlInvalid(nextUrl)) {
      setStatus('INVALID_URL')
      inputRef.current.setAttribute('aria-invalid', 'true')
      buttonRef.current.setAttribute('disabled', 'true')
    } else {
      setStatus('')
      inputRef.current.setAttribute('aria-invalid', 'false')
      buttonRef.current.removeAttribute('disabled')
    }
  }

  function handleClick (e) {
    e.target.setAttribute('aria-busy', 'true')
    e.target.classList.add('outline')
    setStatus('IN_PROGRESS')

    postVideo(url)
      .then(jobId => backoffUntilComplete(1000, jobId))
      .then(downloadLink => setDownloadLink(downloadLink))
      .then(() => setStatus('COMPLETED'))
      .catch(err => {
        console.error(err)
        setStatus('FAILED')
      })
      .finally(() => {
        e.target.setAttribute('aria-busy', 'false')
        e.target.classList.remove('outline')
      })
  }

  return (
    <div className='container'>
      <input type='url' onChange={handleChange} value={url} ref={inputRef} />
      <button onClick={handleClick} ref={buttonRef}>Download</button>
      <DownloaderStatus status={status} downloadLink={downloadLink} />
    </div>
  )
}
