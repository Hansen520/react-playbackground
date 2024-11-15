<!--
 * @Date: 2024-05-06 16:35:50
 * @Description: description
-->
```javascript
  import { transform } from '@babel/standalone';
import type { PluginObj } from '@babel/core';

function App() {

    const code1 =`
    function add(a, b) {
        return a + b;
    }
    export { add };
    `;

    const url = URL.createObjectURL(new Blob([code1], { type: 'application/javascript' }));

    const transformImportSourcePlugin: PluginObj = {
        visitor: {
            ImportDeclaration(path) {
                path.node.source.value = url; // 将code1当作一个blob外联引导进来
            }
        },
    }


  const code = `import { add } from './add.ts'; console.log(add(2, 3));`

  function onClick() {
    const res = transform(code, { // code放入之后, 通过babel翻译，transformImportSourcePlugin，就是将./add.ts替换为url
      presets: ['react', 'typescript'],
      filename: 'guang.ts',
      plugins: [transformImportSourcePlugin]
    });
    console.log(res.code);
  }

  return (
    <div>
      <button onClick={onClick}>编译</button>
    </div>
  )
}

export default App

```
# 第一部分
如何引入编辑器里写的 ./Aaa.tsx 这种模块，如何引入 react、react-dom 这种模块我们就都清楚了。

分别用 Blob + URL.createBlobURL（核心包：@types/babel__core） 和 import maps机制 + esm.sh 来做。

# 第二部分
编辑器部分用 @monaco-editor/react

npm install --save allotment 实现文本与预览实现拖拽的功能

npm install --save @typescript/ata -f  // 让引入第三方包的时候有提示信息

@babel/standalone // 用于文件的编译
