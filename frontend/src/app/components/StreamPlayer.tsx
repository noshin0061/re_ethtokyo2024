"use client"

import React, { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface StreamPlayerProps {
  streamName: string;
  serverUrl: string;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamName, serverUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      const hls = new Hls()
      const streamUrl = `${serverUrl}/live/livestream/index.m3u8`

      console.log('Attempting to load stream:', streamUrl)

      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifest parsed, attempting to play')
        video.play().catch(e => console.error("Error attempting to play:", e))
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', event, data)
      })

      return () => {
        hls.destroy()
      }
    }
  }, [streamName, serverUrl])

  return (
    <video ref={videoRef} controls className="w-full" />
  )
}

export default StreamPlayer