import { useState, useCallback } from 'react';

export const useOtpTimer = (initialTime: number = 60) => {
  const [otpTime, setOtpTime] = useState(initialTime);
  const [timerActive, setTimerActive] = useState(false);

  const startOtpTimer = useCallback(() => {
    setOtpTime(initialTime);
    setTimerActive(true);
    const timer = setInterval(() => {
      setOtpTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  return { otpTime, timerActive, startOtpTimer };
};