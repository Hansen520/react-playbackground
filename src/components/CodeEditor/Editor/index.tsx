/*
 * @Date: 2024-05-06 17:04:57
 * @Description: description
 */
import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react'
import { createATA } from "./ata";
import { editor } from 'monaco-editor'


export interface EditorFile {
  name: string;
  value: string;
  language: string;
}

interface Props {
  file: EditorFile
  onChange?: EditorProps['onChange'],
  options?: editor.IStandaloneEditorConstructionOptions
}

export default function Editor(props: Props) {
  const { file, onChange, options } = props;
  // const code = `export default function App() {
  //       return <div>xxx</div>
  //   }
  //   `;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
      editor.getAction("editor.action.formatDocument")?.run();
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      esModuleInterop: true,
    });

    const ata = createATA((code, path) => {
      // 展示代码和文件路径
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`);
    });

    // 拿到的包若隐若现的展示在编辑器里面
    editor.onDidChangeModelContent(() => {
      ata(editor.getValue());
    });

    ata(editor.getValue());
  };

  return (
    <MonacoEditor
      height="100%"
      path={file.name}
      language={file.language}
      onMount={handleEditorMount}
      onChange={onChange}
      value={file.value}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false,
        },
        scrollbar: {
          verticalScrollbarSize: 6, // 设计滚动条垂直
          horizontalScrollbarSize: 6, // 水平
        },
        ...options
      }}
    />
  );
}
