import { useRef, useState } from 'react'
import DownloaderStatus from './DownloaderStatus'
import validator from 'validator'

export default function Downloader () {
  const [url, setUrl] = useState('https://youtu.be/jNQXAC9IVRw')
  const [status, setStatus] = useState('')
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  function urlInvalid (url) {
    return !validator.isURL(url)
  }

  function handleChange (e) {
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
  }

  return (
    <div class='container'>
      <input type='url' onChange={handleChange} value={url} ref={inputRef} />
      <button onClick={handleClick} ref={buttonRef}>Download</button>
      <DownloaderStatus status={status} />
    </div>
  )
}
