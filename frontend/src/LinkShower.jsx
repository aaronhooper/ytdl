export default function LinkShower (props) {
  if (props.downloadLink) {
    return <>Click <a href={props.downloadLink}>here</a> to download your video.</>
  }
}
