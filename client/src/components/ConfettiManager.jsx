import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // npm install react-use

// Note: You need to install: npm install react-use react-confetti

const ConfettiManager = ({ trigger, setTrigger }) => {
  const { width, height } = useWindowSize();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      // Stop the confetti rain after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTrigger(false); // Reset parent state
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [trigger, setTrigger]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <Confetti
        width={width}
        height={height}
        recycle={true}
        numberOfPieces={200}
        gravity={0.2}
      />
    </div>
  );
};

export default ConfettiManager;