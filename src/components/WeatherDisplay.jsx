import { useEffect, useState, React } from 'react';
import ErrorMessage from './ErrorMessage';
import SunnyIcon from '../images/SunnyIcon';
import RainyIcon from '../images/RainyIcon';
import CloudyIcon from '../images/CloudyIcon';

function WeatherDisplay({ data, error, currentTime }) {

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className={`data ${isVisible ? 'show' : ''}`}>
      <div className='data-content'>
        {error ? (
          <ErrorMessage error={error} />
        ) : (
          data && (
            <div className="valid">
                <p className="location">
                    {data.name}
                    {data.name !== data.country && `, ${data.country}`}
                    {data.county && data.name !== data.county && `, ${data.county}`}
                </p>
                <p className="time">{data.date}</p>
                <p className="weather-icon">
                    {data.background === "Sunny" ? <SunnyIcon /> : data.background === "Rainy" ? <RainyIcon /> : <CloudyIcon />}
                </p>
                <p className="temperature">{data.temperature} °C</p>
                <p>{data.background}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default WeatherDisplay;
