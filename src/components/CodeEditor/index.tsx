/*
 * @Date: 2024-05-06 16:51:06
 * @Description: description
 */
import Editor from "./Editor";
import FileNameList from "./FileNameList";

export default function CodeEditor() {
  const file = {
    name: "han.tsx",
    value: 'import lodash from "lodash";\n\nconst a = <div>guang</div>',
    language: "typescript",
  };

  function onEditorChange() {
    console.log(...arguments);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <FileNameList />
      <Editor file={file} onChange={onEditorChange} />
    </div>
  );
}
