import React, { useState, useRef } from 'react'
import { useUploader } from '@w3ui/react-uploader'
import { withIdentity } from './components/Authenticator'
import { Camera } from 'react-camera-pro'
import './spinner.css'

function dataURLtoFile (dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const blob = new Blob([u8arr], { type: mime })
  return new File([blob], 'camera-image')
}

export function ContentPage () {
  const [, uploader] = useUploader()
  const [status, setStatus] = useState('')
  const [error, setError] = useState(null)
  const [images, setImages] = useState([])

  const camera = useRef(null)

  const takePhoto = async (e) => {
    e.preventDefault()
    const imgdata = camera.current.takePhoto()
    const cid = null
    setImages([{ cid: cid, data: imgdata }, ...images])
  }

  if (!uploader) return null
  const printStatus = status === 'done' && error ? error : status

  return (
    <div>
       <p>
         <button onClick={takePhoto}>Take photo</button> {printStatus}
       </p>
       <Camera ref={camera} />
       <ul className='images'>
       {images.map(({ cid, data }) => (
         <ImageListItem key={cid} cid={cid} data={data} />
       ))}
       </ul>
     </div>
  )
}

function ImageListItem ({ cid, data }) {
  if (/bagb/.test(`${cid}`)) {
    return <li key={cid}>CAR cid: {cid}</li>
  }
  const imgUrl = `https://w3s.link/ipfs/${cid}`
  const imgSrc = data || imgUrl
  return (
    <li key={cid}>
      <a href={imgUrl}>
        <img width="200px" alt='camera output' src={imgSrc} />
      </a>
    </li>
  )
}

export default withIdentity(ContentPage)
