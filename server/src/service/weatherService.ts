import dotenv from 'dotenv';
// import fs from 'node:fs/promises';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;

};

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  temp: number;
  conditions: string;
  humidity: number;
  windSpeed: number;

  constructor(city: string, temp: number, conditions: string, humidity: number, windSpeed: number) {
    this.city = city;
    this.temp = temp;
    this.conditions = conditions;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {



  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  // private cities: '';

  constructor() {
    this.baseURL = process.env.WEATHER_API_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/weather?q=${query}&appid=${this.apiKey}`
      );
      const locationData = await response.json();

      return locationData;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): { lat: number, lon: number } {
    const { lat, lon } = locationData;
    return { lat, lon };
  }


  // TODO: Create buildGeocodeQuery method, Changed to async
  // Do all async need to be Promise<>?
  private async buildGeocodeQuery(query: string) {
    try {
      const locationData = await this.fetchLocationData(query);
      const coordinates = this.destructureLocationData(locationData);
      return coordinates;
    } catch (err) {
      console.log('Error:', err);
      return err;
    }
  }


  // TODO: Create buildWeatherQuery method, Changed to async
  private async buildWeatherQuery(coordinates: Coordinates) {
    try {
      const { lat, lon } = coordinates;
      const weatherApiKey = '488bb23092f9b0c604104668507c605e';
      const weatherQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

      return weatherQuery;
    } catch (error) {
      console.log('Error building weather query:', error);
      throw error;
    }
  }

  private buildGeocodingQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;

    return geocodeQuery;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(url: string) {

    return await this.fetchLocationData(this.buildGeocodingQuery()).then(data => this.destructureLocationData(data));
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const { lat, lon } = coordinates;
      const weatherData = await fetch(
        `${this.baseURL}/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      );

      if (!weatherData.ok) {
        throw new Error('Error fetching weather data');
      }

      const weather = await weatherData.json();
      return weather;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  // TODO: Build parseCurrentWeather method
  private async parseCurrentWeather(response: any) {
    const weatherData = {
      temerature: response.main.temp,
      conditions: response.weather[0].description,
      humidity: response.main.humidity,
      windSpeed: response.wind.speed,
    };
    return weatherData;
  }

  // TODO: Complete buildForecastArray method
  private async buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherForecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((day: any) => {

      const forecast = new Weather(
        currentWeather.temp,
        day.temp.day,
        day.weather[0].description,
        day.weather[0].icon,
        day.humidity,
        day.wind.speed
      );
      return forecast;
    });

    return weatherForecast;
  }



  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();

      if (coordinates) {
        const weather = await this.fetchWeatherData(coordinates);
        return weather;
      }

    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw error;
    }
  }
}


export default new WeatherService();
