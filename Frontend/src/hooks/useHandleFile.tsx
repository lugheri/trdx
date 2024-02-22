import { useEffect, useRef, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { v4 } from 'uuid';

type UseHandleFileProps = {
  input_file_id: string;
  _file_changes: (files: FileData[]) => void;
};

type FileData = {
  _file_id: string;
  file_blob_data: string;
  file_mime_type: string;
  file_name: string;
  formated_size: string;
  last_modification: number;
  size: number;
};

export const useHandleFile = (props:UseHandleFileProps) => {
  console.log('Handle Exec')
  const input_file_reference = useRef<HTMLInputElement>(null);
  const accepted_file_types = ['image/jpg', 'image/png', 'image/jpeg', 'video/mp4', 'video/wav','application/pdf'];
  const limit_file_size = 2;

  const _format_bytes = (bytes:number, just_num:boolean) => {
    const kb_conversion = (bytes / 1024).toFixed(2);
    const mb_conversion = (bytes / 1048576).toFixed(2);
    const gb_conversion = (bytes / 1073741824).toFixed(2)

    if (bytes < 1024)
      return bytes + " Bytes";

    if (bytes < 1048576)
      return just_num ? kb_conversion : kb_conversion + "KB";

    if (bytes < 1073741824)
      return just_num ? mb_conversion : mb_conversion + "MB";

    return just_num ? gb_conversion : gb_conversion + "GB";
  }

  const get_image_base64_data = async (blob_data: Blob): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob_data);
    })
  }

  const _handle_files_change = async (event: ChangeEvent<HTMLInputElement> ) => {
    console.log('_handle_files_change Exec')
    const files = event.target.files;
    if (!files) return;

    //input_file_reference.current.files = null;
    const _files: FileData[] = [];
    
    for (const file of files) {
      const get_file_size = _format_bytes(file.size, false);
      if (get_file_size.includes('GB') || (get_file_size.includes('MB') && parseInt(get_file_size.split('MB')[0]) > limit_file_size)) {
        toast.error('Arquivo muito grande.');
        return;
      }
      if (!accepted_file_types.includes(file.type)) {
        toast.error('Um dos arquivos selecionados não possui tipo de extensão permitido.');
        return;
      }

      const blob = new Blob([file], { type: file.type });
      const archive_data = await get_image_base64_data(blob);

      _files.push({
        _file_id: v4(),
        file_blob_data: archive_data,  
        file_mime_type: file.type,
        file_name: file.name,
        formated_size: get_file_size,
        last_modification: file.lastModified,
        size: file.size,
      })
      console.log('file.name',file.name)
    }
    
    props._file_changes(_files);
  }

  useEffect(() => {
    console.log("Handle File Change")
    const element = input_file_reference.current;
    if (!element) return;
    console.log("elements >",element)
    element.addEventListener('change', _handle_files_change as any);
    return () => {
      element.removeEventListener('change', _handle_files_change as any);
    }
  }, [])

  return input_file_reference;
}