import { useEffect, useState } from 'react'

export default function ProgressEllipsis () {
  const frames = ['.', '..', '...']
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex(() => (frameIndex + 1) % 3)
    }, 250)

    return () => clearInterval(interval)
  })

  return <>{frames[frameIndex]}</>
}
