import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type TextEditorComponent = {
  text:string,
  setText:React.Dispatch<React.SetStateAction<string>>
}
export const TextEditor : React.FC<TextEditorComponent> = (props) => {
  return <ReactQuill className="w-full bg-neutral-300"  theme="snow" value={props.text} onChange={props.setText} />;
}