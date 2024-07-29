/*
 * @Date: 2024-05-06 16:51:06
 * @Description: description
 */
import { useContext } from "react";
import Editor from "./Editor";
import FileNameList from "./FileNameList";
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext";
import { debounce } from 'lodash-es';

export default function CodeEditor() {
  // const file = {
  //   name: "han.tsx",
  //   value: 'import lodash from "lodash";\n\nconst a = <div>guang</div>',
  //   language: "typescript",
  // };
  const {files, setFiles, selectedFileName, setSelectedFileName} = useContext(PlaygroundContext)

  const file = files[selectedFileName];

  function onEditorChange(value?: string) {
    // console.log(...arguments);
    files[file.name].value = value!
    console.log(value, files, 24);
    setFiles({...files});
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <FileNameList />
      <Editor file={file} onChange={debounce(onEditorChange, 500)} />
    </div>
  );
}
