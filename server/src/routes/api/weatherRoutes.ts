import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const cityName = req.body.cityName;

  WeatherService.getWeatherForCity(cityName)

    .then((weather) => {
      res.status(200).json(weather);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// TODO: GET weather data from city name
router.get('/', async (req: Request, res: Response) => {
  try {
    const weather = await WeatherService.getWeatherForCity(req.body.cityName);
    res.status(200).json(weather);
  } catch (error) {
    res.status(500).json(error);
  }
});

// TODO: save city to search history
router.post('/history', async (req: Request, res: Response) => {
  const city = req.body.cityName;
  try {
    const history = await HistoryService.saveWeatherForCity(city);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json(error);
  }
}
);



// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => { });

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => { });

export default router;
