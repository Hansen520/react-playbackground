/*
 * @Date: 2024-05-06 16:51:08
 * @Description: description
 */
import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext";
import Editor from "../CodeEditor/Editor";
import { Message } from '../Message';
import { compile } from "./compiler";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../ReactPlayground/files";

interface MessageData {
  data: {
    type: string
    message: string
  }
}

export default function Preview() {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");
  const getIframeUrl = () => {
    // console.log(files[IMPORT_MAP_FILE_NAME].value, 16);
    const res = iframeRaw
      .replace(
        '<script type="importmap"></script>',
        `<script type="importmap">${files[IMPORT_MAP_FILE_NAME].value}</script>`
      )
      .replace(
        '<script type="module" id="appSrc"></script>',
        `<script type="module" id="appSrc">${compiledCode}</script>`
      );
    return URL.createObjectURL(new Blob([res], { type: "text/html" }));
  };
  const [iframeUrl, setIframeUrl] = useState(getIframeUrl());
  const [error, setError] = useState('');

  const handleMessage = (msg: MessageData) => {
    const { type, message } = msg.data;
    if (type === 'error') {
      setError(message);
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    }
  }, [])

  useEffect(() => {
    const res = compile(files);
    setCompiledCode(res);
  }, [files]);

  useEffect(() => {
    setIframeUrl(getIframeUrl());
    console.log(files[IMPORT_MAP_FILE_NAME].value, compiledCode, 37);
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]); // compiledCode有变化直接更新

  return (
    <div style={{ height: "100%" }}>
      {/* <div style={{ whiteSpace: 'pre-line' }}>{JSON.stringify(compiledCode)}</div>
      -------------------------------------- */}
      {JSON.stringify(iframeUrl)}
      <iframe
        src={iframeUrl}
        style={{
          width: "100%",
          height: "100%",
          padding: 0,
          border: "none",
        }}
      />
      <Message type='error' content={error} />

      {/* <Editor
        file={{
          name: "dist.js",
          value: compiledCode,  
          language: "javascript",
        }}
      /> */}
    </div>
  );
}
