import { useState, useEffect } from 'react';
import SunnyIcon from './images/SunnyIcon'
import RainyIcon from './images/RainyIcon'
import CloudyIcon from './images/CloudyIcon'
import SearchIcon from './images/SearchIcon'
import './index.css'


function App() {

  const [text, setText] = useState('Vilnius');
  const [data, setData] = useState({})

  useEffect( () => {
    handleSubmit();
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleSubmit = (e) => {
    if(e) e.preventDefault();

    let geoData = new Object();
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${text}`)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        geoData = data.results[0];
        const lat = data.results[0].latitude;
        const lon = data.results[0].longitude;
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`)
            .then(res => res.json())
            .then(weatherData => {
                updateData(geoData, weatherData.current_weather);
            })
    })
  }

  const updateData = (geoData, weatherData) => {
    
    
    
    const obj = {
      country : geoData.country,
      name : geoData.name,
      temperature : Math.round(weatherData.temperature),
    };

    if(weatherData.weathercode == 0){
      obj.weather = <SunnyIcon/> ;
      obj.background = 'Sunny';
    }
    else if(weatherData.weathercode >= 1 && weatherData.weathercode <= 57){
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
    <div className={`App ${data.background}`}>
      <form>
          <input onChange={handleChange} type="text" placeholder='Search places' required />
          <button onClick={handleSubmit} className='search-button'> <SearchIcon/> </button>
      </form>

      <div className='data'>
        <p className='location'>{data.name}
        {data.name != data.country && `, ${data.country}`}
        </p>
        {data.weather}
        <p className='temperature'>{data.temperature} °C</p>
        <p>{data.background}</p>
      </div>
    </div>
  );
}

export default App;
