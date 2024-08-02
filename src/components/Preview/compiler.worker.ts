/*
 * @Date: 2024-07-29 17:38:20
 * @Description: description
 */
import { transform } from "@babel/standalone";
import { Files } from "../../ReactPlayground/PlaygroundContext";
import { ENTRY_FILE_NAME } from "../../ReactPlayground/files";
import { PluginObj } from "@babel/core";

export const beforeTransformCode = (filename: string, code: string) => {
  let _code = code;
  const regexReact = /import\s+React/g;
  if ((filename.endsWith(".jsx") || filename.endsWith(".tsx")) && !regexReact.test(code)) {
    _code = `import React from 'react';\n${code}`;
  }
  return _code;
};

export const babelTransform = (filename: string, code: string, files: Files) => {
  const _code = beforeTransformCode(filename, code)
  let result = "";
  try {
    result = transform(_code, {
      presets: ["react", "typescript"],
      filename,
      plugins: [customResolver(files)],
      retainLines: true, // retainLines 是编译后保持原有行列号不变。
    }).code!;
  } catch (e) {
    console.error("编译出错", e);
  }
  return result;
};

// babel转义
const getModuleFile = (files: Files, modulePath: string) => {
  let moduleName = modulePath.split("./").pop() || "";
  console.log(moduleName, 28);
  if (!moduleName.includes(".")) {
    const realModuleName = Object.keys(files)
      .filter((key) => {
        return key.endsWith(".ts") || key.endsWith(".tsx") || key.endsWith(".js") || key.endsWith(".jsx");
      })
      .find((key) => {
        return key.split(".").includes(moduleName);
      });
    console.log(realModuleName, 37);
    if (realModuleName) {
      moduleName = realModuleName;
    }
  }
  return files[moduleName];
};

// json -> js
const json2Js = (file: File & { value: string }) => {
  const js = `export default ${file.value}`;
  return URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
};

// css -> js
const css2Js = (file: File & { value: string }) => {
  const randomId = new Date().getTime();
  const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
    `;
  return URL.createObjectURL(new Blob([js], { type: "application/javascript" }));
};

// 可以通过 babel 插件来处理 import 语句，转换成 blob url 的方式
function customResolver(files: Files): PluginObj {
  return {
    visitor: {
      // 改变导入的import传值
      ImportDeclaration(path) {
        const modulePath = path.node.source.value;
        if (modulePath.startsWith(".")) {
          const file = getModuleFile(files, modulePath);
          if (!file) return;
          if (file.name.endsWith(".css")) {
            path.node.source.value = css2Js(file);
          } else if (file.name.endsWith(".json")) {
            path.node.source.value = json2Js(file);
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: "application/javascript",
              })
            );
          }
        }
        // path.node.source.value = '23333'
      },
    },
  };
}

export const compile = (files: Files) => {
  const main = files[ENTRY_FILE_NAME];
  return babelTransform(ENTRY_FILE_NAME, main.value, files);
};

self.addEventListener('message', async ({ data }) => {
  try {
      self.postMessage({
          type: 'COMPILED_CODE',
          data: compile(data)
      })
  } catch (e) {
       self.postMessage({ type: 'ERROR', error: e })
  }
})
