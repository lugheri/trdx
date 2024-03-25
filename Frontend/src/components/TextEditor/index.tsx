import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TextEditorComponent = {
  text:string,
  setText:React.Dispatch<React.SetStateAction<string>>
}
export const TextEditor : React.FC<TextEditorComponent> = (props) => {
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }], [{ 'color': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'color','video'
  ]
  return <ReactQuill 
          className="w-full bg-neutral-300"  
          theme="snow" 
          modules={modules}
          formats={formats}
          value={props.text} 
          onChange={props.setText} />;
}


