import { useState, useEffect } from 'react';
import SunnyIcon from './images/SunnyIcon'
import RainyIcon from './images/RainyIcon'
import CloudyIcon from './images/CloudyIcon'
import SearchIcon from './images/SearchIcon'
import './index.css'


function App() {

  const [text, setText] = useState('Vilnius');
  const [data, setData] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');

  
  useEffect( () => {
    handleSubmit();
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleSubmit = (e) => {
    if(e) e.preventDefault();

    setError('');

    setIsVisible(false);
    setTimeout(() => {
      setIsVisible(true);
   }, 300) 

    let geoData = new Object();
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${text}`)
    .then(res => {
      //console.log(res.status);
      if(!res.ok){
        throw new Error('Network response was not ok');
      }
      return res.json()
    })
    .then(data => {
      if(typeof data.results === 'undefined'){
        throw new Error('No such place was found');
      }
      geoData = data.results[0];
      //console.log(geoData);
      return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoData.latitude}&longitude=${geoData.longitude}&current_weather=true&timezone=auto`)
    })
    .then(res => {
      if(!res.ok){
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(weatherData => {
      updateData(geoData, weatherData.current_weather);
    })
    .catch(error => {
      setError(error.toString());
      console.error('There was a problem with the fetch operation:', error);
    });

  }

  const updateData = (geoData, weatherData) => {
    
    const obj = {
      country : geoData.country,
      name : geoData.name,
      temperature : Math.round(weatherData.temperature),
    };

    if(weatherData.weathercode >= 0 && weatherData.weathercode <= 2){
      obj.weather = <SunnyIcon/> ;
      obj.background = 'Sunny';
    }
    else if(weatherData.weathercode >= 3 && weatherData.weathercode <= 57){
      obj.weather = <CloudyIcon/> ;
      obj.background = 'Cloudy';
    }
    else{
      obj.weather = <RainyIcon/>;
      obj.background = 'Rainy';
    }

    setData(obj);
  }
 
  return (
    
    <div className={`App ${data.background} ${isVisible ? 'visible' : ''}`}>
      <form>
          <input onChange={handleChange} type="text" placeholder='Search places' required />
          <button onClick={handleSubmit} className='search-button'> <SearchIcon/> </button>
      </form>

      {error.length != 0 ? (
        <div className='error'>
          <p className='oops'>Oops!</p>
          <p> {error} </p>
         </div>
      ) : (
        <div className={`data ${isVisible ? 'visible' : ''}`}>
          <p className='location'>{data.name}
          {data.name != data.country && `, ${data.country}`}
          </p>
          {data.weather}
          <p className='temperature'>{data.temperature} °C</p>
          <p>{data.background}</p>
        </div>
  )}
    </div>
  );
}

export default App;
