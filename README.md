# Rob's Weather App

This is a simple weather app that allows you to search for a city and get the current weather conditions.

### Getting started

First, create a `.env` file in the `backend/` directory of the project and add your OpenWeatherMap API key.

```
OPENWEATHERMAP_API_KEY=your_api_key
```

Then, from the root of the project, install the dependencies:

```
pnpm -r install
```

Then, run the following commands to start the development servers:

```
pnpm dev
```

You can now access the app at `http://localhost:5173`. The backend server will be running on `http://localhost:3001`.

### Running the tests

To run the tests, run the following command from the root of the project:

```
pnpm test
```

### API Documentation

To access the API documentation, ensure the backend server is running and then navigate to the following URL:

```
http://localhost:3001/api/docs
```


