import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/hooks.jsx';

import SearchForm from './SearchForm';
import '../index.css'
import SearchModal from './SearchModal.jsx';
import Spinner from './Spinner.jsx';
import WeatherDisplay from './WeatherDisplay.jsx';
import { fetchGeoData, fetchForecastData } from '../services/weatherService';
import { formatTime } from '../utils/utils.js';



function App() {

  let [text, setText] = useState('');
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [geoData, setGeoData] = useState({});
  const [debouncedSearch, cancelDebounce] = useDebounce(text);
  const [isForecastLoading, setForecastLoading] = useState(false);


  useEffect(() => {
    const initialFetch = async () => {

      const fetchedGeoData = await fetchGeoData("Vilnius");
      handleFetchForecast(fetchedGeoData[0]);

    };
    initialFetch();
  }, []);


  useEffect(() => {
    const loadSearchSuggestions = async () => {

      if (debouncedSearch && debouncedSearch.trim() !== "") {
        const fetchedGeoData = await fetchGeoData(debouncedSearch);
        setGeoData(fetchedGeoData || []);
      } else {
        setGeoData([]);
      }
    };
    loadSearchSuggestions();
  }, [debouncedSearch]);



  const handleSubmit = (e) => {

    if(e) e.preventDefault();
    if(!text) return;

    handleGeoDataFetch();
  }

  const handleGeoDataFetch = async () => {
    try {
      const fetchedGeoData = await fetchGeoData(text);
      if (!fetchedGeoData || fetchedGeoData.length === 0) throw new Error("No location data found.");
      handleFetchForecast(fetchedGeoData[0]);
    } catch (error) {
      handleError(error);
    }
  };

  const handleFetchForecast = async (geoData) => {
    setError('');
    cancelDebounce();
    setGeoData([]);
    setText('');
    setForecastLoading(true);

    try {
      const weatherData = await fetchForecastData(geoData.latitude, geoData.longitude);
      updateData(geoData, weatherData);
    } catch (error) {
      handleError(error);
    } finally {
      setForecastLoading(false);
    }
  };

  const updateData = (geoData, weatherData) => {

    const obj = {
      country : geoData.country,
      county: geoData.admin1,
      name : geoData.name,
      date: formatTime(),
      temperature : Math.round(weatherData.temperature),
    };

    if(weatherData.weathercode >= 0 && weatherData.weathercode <= 2){
      obj.background = 'Sunny';
    }
    else if(weatherData.weathercode >= 3 && weatherData.weathercode <= 57){
      obj.background = 'Cloudy';
    }
    else{
      obj.background = 'Rainy';
    }

    setData(obj);
  }

  function handleError(error) {
    setError(error.toString());
    console.error('There was a problem with the fetch operation:', error);
  }
 
  return (
    <div className={`app ${data.background ? data.background.toLowerCase() : ''}`}>
      <SearchForm text={text} setText={setText} handleSubmit={handleSubmit} />
      <SearchModal geoData={geoData} fetchForecastData={handleFetchForecast} />
      {isForecastLoading && <Spinner />}
      {!isForecastLoading && <WeatherDisplay data={data} error={error}/>}
    </div>
  );
}

export default App;
