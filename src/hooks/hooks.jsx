import { useEffect, useState } from 'react';
import { timeout } from 'rxjs';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  let timeout;

  useEffect(() => {
    timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [value, delay]);

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return [debouncedValue, cancel];
};