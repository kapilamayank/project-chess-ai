import React, { useState, useEffect, useRef } from 'react';

const TypingGradientText = ({
    fullText
}) => {


  const [typedText, setTypedText] = useState("");
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
        const nextChar = fullText.charAt(indexRef.current);
        setTypedText(prevText => prevText + nextChar);
        indexRef.current += 1;

        if (indexRef.current === fullText.length) {
            clearInterval(intervalRef.current);
        }
    }, 100); 

    return () => clearInterval(intervalRef.current);
  }, []);


  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        {typedText}
        <span className="animate-blink border-r-2 border-white ml-1 h-full inline-block" />
      </h1>
    </div>
  );
};

export default TypingGradientText;
