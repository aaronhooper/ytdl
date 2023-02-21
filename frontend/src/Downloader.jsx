import { useState } from 'react'
import DownloaderStatus from './DownloaderStatus'

export default function Downloader () {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('')

  function handleChange (e) {
    setUrl(e.target.value)
  }

  function handleClick (e) {
    e.target.setAttribute('aria-busy', 'true')
    e.target.classList.add('outline')
    setStatus('IN_PROGRESS')
  }

  return (
    <div class='container'>
      <input type='url' onChange={handleChange} value={url} placeholder='https://youtu.be/jNQXAC9IVRw' />
      <button onClick={handleClick}>Download</button>
      <DownloaderStatus status={status} />
    </div>
  )
}
