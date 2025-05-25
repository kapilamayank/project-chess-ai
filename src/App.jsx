import { useState } from 'react';
import Board from './components/Board.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='min-h-screen bg-gray-600 flex items-center justify-center'>
      <div className='w-[600px]'>
         <Board />
      </div>
    </div>
  )
}

export default App
