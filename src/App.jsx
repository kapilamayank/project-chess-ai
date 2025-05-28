import { useState } from 'react';
import Board from './components/Board.jsx';
import StartPanel from './components/StartPanel.jsx';

function App() {
  const [timeFormat, setTimeFormat] = useState(0);

  return (
    <div className='min-h-screen bg-gray-600 flex flex-col items-center justify-center'>
      { (timeFormat !== 0) ? 
            <div className='w-[600px]'>
                <Board timeFormat={timeFormat} setTimeFormat={setTimeFormat} />
            </div> : <StartPanel 
                          setTimeFormat={setTimeFormat} /> }
    </div>
  )
}

export default App
