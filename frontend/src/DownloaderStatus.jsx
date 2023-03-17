import ProgressEllipsis from './ProgressEllipsis.jsx'

export default function DownloaderStatus (props) {
  function message (status) {
    if (status === 'IN_PROGRESS') {
      return <>Siphoning video data <ProgressEllipsis /></>
    } else if (status === 'COMPLETED') {
      return <>Done! <a href={props.downloadLink}>Click here</a> to download your video.</>
    } else if (status === 'INVALID_URL') {
      return <>Please enter a valid URL.</>
    } else if (status === 'FAILED') {
      return <>There was a problem getting your video. Please try again.</>
    } else {
      return ''
    }
  }

  return <>{message(props.status)}</>
}
