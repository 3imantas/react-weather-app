
import { useState, useEffect } from 'react';

function SearchModal({ geoData, fetchForecastData }) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayData, setDisplayData] = useState(geoData);

  useEffect(() => {
    if (geoData.length > 0) {
      setDisplayData(geoData);
      setIsVisible(true);
    } else if (isVisible) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setDisplayData([]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [geoData, isVisible]);

  return (
    <div className={`modal ${isVisible ? 'show' : ''}`}>
      {displayData.length > 0 && (
        <ul>
          {displayData.map((item, index) => (
            <li key={index} onClick={() => fetchForecastData(item)}>
              {item.name} {item.country !== item.name && `, ${item.country}`} {item.admin1 && item.name !== item.admin1 && `, ${item.admin1}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchModal;
