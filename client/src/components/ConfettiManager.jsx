import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const ConfettiManager = ({ trigger, setTrigger }) => {
  const { width, height } = useWindowSize();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTrigger(false);
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
