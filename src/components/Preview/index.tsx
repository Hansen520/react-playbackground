/*
 * @Date: 2024-05-06 16:51:08
 * @Description: description
 */
import { useContext, useEffect, useRef, useState } from "react";
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext";
// import Editor from "../CodeEditor/Editor";
import { Message } from '../Message';
import CompilerWorker from "./compiler.worker?worker";
import Abc from "./abc.worker?worker";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../ReactPlayground/files";
import { debounce } from "lodash-es";

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
    // console.log('持续拿出数据', msg);
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
    const post = new Abc();
    post.postMessage(12345666);
  }, [])

  // useEffect(() => {
  //   // const res = compile(files);
    // setCompiledCode('12323323');
  //   // console.log(111);
  //   compilerWorkerRef.current?.postMessage(files);
  // }, [files]);

  const compilerWorkerRef = useRef<Worker>(); // 每次组件重新渲染时，都会创建一个新的Worker实例，导致之前的Worker实例被垃圾回收，从而无法正常工作

  useEffect(() => {
    // console.log(files, compilerWorkerRef.current, 62);
    
    if (!compilerWorkerRef.current) {
      // 第二次时，url已经拿到数据了
      compilerWorkerRef.current = new CompilerWorker();
      compilerWorkerRef.current.addEventListener('message', ({ data }) => {
        console.log('worker', data) ;
        if (data.type === 'COMPILED_CODE') {
          setCompiledCode(data.data);
        } else {
          // console.log('error', data);
        }
      })
    }
  }, []);

  useEffect(debounce(() => {
    compilerWorkerRef.current?.postMessage(files);
  }, 500), [files]);

  useEffect(() => {
    // console.log(files[IMPORT_MAP_FILE_NAME].value, compiledCode, 82);
    setIframeUrl(getIframeUrl());
  }, [files[IMPORT_MAP_FILE_NAME].value, compiledCode]); // compiledCode有变化直接更新

  return (
    <div style={{ height: "100%" }}>
      {/* <div style={{ whiteSpace: 'pre-line' }}>{JSON.stringify(compiledCode)}</div>
      -------------------------------------- */}
      {JSON.stringify(iframeUrl)}
      {/* {JSON.stringify(compiledCode)} */}
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
