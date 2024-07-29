/*
 * @Date: 2024-07-29 17:38:20
 * @Description: description
 */
import { transform } from "@babel/standalone";
import { Files } from "../../ReactPlayground/PlaygroundContext";
import { ENTRY_FILE_NAME } from "../../ReactPlayground/files";

export const babelTransform = (filename: string, code: string, files: Files) => {
  let result = "";
  try {
    result = transform(code, {
      presets: ["react", "typescript"],
      filename,
      plugins: [],
      retainLines: true, // retainLines 是编译后保持原有行列号不变。
    }).code!;
  } catch (e) {
    console.error("编译出错", e);
  }
  return result;
};

export const compile = (files: Files) => {
    const main = files[ENTRY_FILE_NAME];
    return babelTransform(ENTRY_FILE_NAME, main.value, files)
}
