/*
 * @Date: 2024-05-06 16:51:08
 * @Description: description
 */
import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../ReactPlayground/PlaygroundContext";
import Editor from "../CodeEditor/Editor";
import { compile } from "./compiler";
import iframeRaw from "./iframe.html?raw";
import { IMPORT_MAP_FILE_NAME } from "../../ReactPlayground/files";

export default function Preview() {
  const { files } = useContext(PlaygroundContext);
  const [compiledCode, setCompiledCode] = useState("");
  const getIframeUrl = () => {
    console.log(files[IMPORT_MAP_FILE_NAME].value, 16);
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

  useEffect(() => {
    (async () => {
      const res = await compile(files);
      console.log(res, 18);
      console.log(files, 17);
      setCompiledCode(res);
      setIframeUrl(getIframeUrl());
    })();
  }, [files]);

  return (
    <div style={{ height: "100%" }}>
      {JSON.stringify(compiledCode)}
      --------------------------------------
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
