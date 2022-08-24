import { ReactElement } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import { FilePondFile } from 'filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { StateValue } from '../model/StateValue'

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

export interface FilePondBase64File extends FilePondFile {
  getFileEncodeBase64String: () => string
}

interface Props {
  files: StateValue<Array<FilePondBase64File>>
}
export default function Upload(props: Props): ReactElement {
  const setFiles = props.files[1]
  return (
    <FilePond
      onupdatefiles={(files: FilePondFile[]): void => {
        setFiles(files.map(f => f as FilePondBase64File))
      }}
      allowMultiple={true}
      allowFileEncode={true}
      maxFiles={1}
      name="files"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
    />
  )
}
