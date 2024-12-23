import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { WeaviateClientJS, PersonImage } from '../weaviate/WeaviateClient'
import Upload, { FilePondBase64File } from '../components/Upload'
import logo from './logo.svg'
import './style.css'

export default function App(): ReactElement<HTMLElement> {
  const [results, setResults] = useState(Array<PersonImage>());
  const [files, setFiles] = useState(Array<FilePondBase64File>())

  const fetch = useCallback(() => {
    async function fetchImages() {
      const client: WeaviateClientJS = new WeaviateClientJS()
      let images: PersonImage[] = []
      if (files && files.length > 0) {
        images = await client.findImage(files[0].getFileEncodeBase64String())
      } else {
        images = await client.findImages()
      }
      setResults(images)
    }
    fetchImages()
  }, [files])

  useEffect(() => {
    fetch()
  }, [fetch, files])

  const renderImage = (img: PersonImage, index: number): ReactElement<HTMLDivElement> => {
    return <div key={index} className='row'>
      <div className='row-image'>
        <img
          style={{ maxHeight: '100px' }}
          alt="Certainty: "
          src={
            'data:image/jpg;base64,' + img.image
          }
        />
      </div>
      <div className='row-details'>
        <div>Name: {img.name}</div>
        { img.certainty && <div>Certainty: {(img.certainty * 100).toFixed(2)}%</div> }
      </div>
    </div>
  }

  return (
    <div className='container'>
      <div className='contents'>
        <div className='weaviate'>
          <img
            alt="Weaviate Logo"
            src={logo}
            width="33%"
            style={{margin: '25px', maxHeight: '100px'}}
          />
          <div>
            <h2 className="title">
              Weaviate <code>v1.14.1</code> Image Module
            </h2>
            <h3 className="subtitle">Face Recognition Demo</h3>
          </div>
        </div>
        <div className='search'>
          <div className='upload'>
            <Upload files={[files, setFiles]}/>
          </div>
          <div>
            <div>Results</div>
            { results.length > 0 && results.map((r, i) => renderImage(r, i))}
          </div>
        </div>
        <div className='footer'>
          All of the images used in this demo are generated by&nbsp;
          <a target='_blank' rel='noopener noreferrer' href='https://generated.photos'>
            generated.photos
          </a>
        </div>
      </div>
    </div>
  )
}
