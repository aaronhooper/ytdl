import ProgressEllipsis from './ProgressEllipsis.jsx'

export default function DownloaderStatus (props) {
  function message (status) {
    if (status === 'IN_PROGRESS') {
      return <>Siphoning video data <ProgressEllipsis /></>
    } else if (status === 'COMPLETED') {
      return <>Done! <a>Click here</a> to download your video.</>
    } else {
      return ''
    }
  }

  return <>{message(props.status)}</>
}
