/*
 * @Date: 2024-05-06 16:35:50
 * @Description: description
 */
import ReactPlayground from './ReactPlayground';
import { PlaygroundProvider } from './ReactPlayground/PlaygroundContext';
import './App.scss'

function App() {

  return (
    <PlaygroundProvider>
      <ReactPlayground />
    </PlaygroundProvider>
  )
}

export default App
