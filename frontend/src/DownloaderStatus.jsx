import ProgressEllipsis from './ProgressEllipsis.jsx'

export default function DownloaderStatus (props) {
  function message (status) {
    if (status === 'IN_PROGRESS') {
      return <>Siphoning video data <ProgressEllipsis /></>
    } else if (status === 'COMPLETED') {
      return <>Done! <a>Click here</a> to download your video.</>
    } else if (status === 'INVALID_URL') {
      return <>Please enter a valid URL.</>
    } else {
      return ''
    }
  }

  return <>{message(props.status)}</>
}
