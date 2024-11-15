/*
 * @Date: 2024-07-29 17:00:01
 * @Description: description
 */
import { useState } from 'react'
import { Button } from 'antd';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello World</h1>
      <Button>按钮</Button>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
      </div>
    </>
  )
}

export default App