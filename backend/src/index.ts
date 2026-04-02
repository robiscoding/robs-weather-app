import { createApp } from "./app.js";
import { OpenWeatherMapWeatherProvider } from "./services/weather/providers/OpenWeatherMapWeatherProvider.js";

const apiKey = process.env.OPENWEATHERMAP_API_KEY;
if (!apiKey) {
  throw new Error("OPENWEATHERMAP_API_KEY environment variable is required");
}

const weatherProvider = new OpenWeatherMapWeatherProvider(apiKey);
const app = createApp(weatherProvider);
const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
