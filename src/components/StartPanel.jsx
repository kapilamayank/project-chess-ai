import React, { useState } from 'react'
import TypingGradientText from './TypingGradientText';

function StartPanel({
    setTimeFormat
}) {
    
        const [time, setTime] = useState(5);


    return (
        <>
        <TypingGradientText fullText={'Welcome to Chess AI'} />
        <div className='w-md bg-gray-700 p-4 rounded-md border-3 border-gray-800'>
            <ul>
                <li>
                    <button className={`box-border block w-full text-white hover:bg-gray-800 rounded-md p-3 border-2  ${(time === 1)? 'bg-gray-800 border-amber-300' : 'border-transparent' }`}
                            onClick={() => setTime(1)}>
                        1 min
                    </button>
                </li>
                <li>
                    <button className={`box-border block w-full mt-2 text-white hover:bg-gray-800 rounded-md p-3 border-2 ${(time === 5)? 'bg-gray-800 border-amber-300' : 'border-transparent' }`}
                            onClick={() => setTime(5)} 
                            >
                        5 min
                    </button>
                </li>
                <li>
                    <button className={`box-border block w-full mt-2 text-white hover:bg-gray-800 rounded-md p-3 border-2 ${(time === 10)? 'bg-gray-800 border-amber-300' : 'border-transparent' }`}
                            onClick={() => setTime(10)}>
                        10 min
                    </button>
                </li>
                <li>
                    <button className={`box-border block w-full mt-2 text-white hover:bg-gray-800 rounded-md p-3 border-2 ${(time === 15)? 'bg-gray-800 border-amber-300' : 'border-transparent' }`}
                            onClick={() => setTime(15)}>
                        15 min
                    </button>
                </li>
                <li>
                    <button className={`box-border block w-full mt-2 text-white hover:bg-gray-800 rounded-md p-3 border-2 ${(time === 30)? 'bg-gray-800 border-amber-300' : 'border-transparent' }`}
                            onClick={() => setTime(30)}>
                        30 min
                    </button>
                </li>
                <li>
                    <button className='box-border block w-full mt-2 text-white rounded-md p-3 bg-green-600 hover:bg-green-700'
                            onClick={() => setTimeFormat(time * 60)}>
                        Start Game
                    </button>
                </li>
            </ul>
        </div>
        </>
  )
}

export default StartPanel