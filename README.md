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

### Implementation Details

This project is a monorepo using pnpm workspaces. The frontend and backend are both in the `frontend/` and `backend/` directories respectively.

The frontend is a React app using Vite, Tailwind CSS, React Query, and Shadcn UI. The backend is a Node.js app using Express and TypeScript.

#### Shared

The shared package contains a set of types and schemas that are shared between the frontend and backend. This helps avoid duplication of code and ensures consistency between the frontend and backend.

- Schemas: Zod schemas for validating data passed to and from the backend.
- Types: TypeScript types for the data returned by the backend.

#### Backend

##### Services

The backend is composed of services which encapsulate the business logic for the app.
- `weather`: Handles weather related requests from the frontend.
- `location`: Handles location related requests from the frontend.

##### Providers

The backend injects dependencies for both weather and location (`backend/src/index.ts`). This allows for easy swapping of 3rd party APIs and makes the backend easier to test. Each service has its own provider class that implements the `WeatherProvider` and `LocationProvider` interfaces. Each provider implementation handles the actual API calls to the 3rd party API and maps the response data to a standardized data structure.

##### Middleware

The backend uses the following middleware:

- `errorHandler`: Standardizes error responses to a consistent format
- `rateLimiter`: Limits the number of requests to our downstream provider APIs to prevent abuse or quota depletion


#### Frontend

The frontend is a React app using Vite, Tailwind CSS, React Query, and Shadcn UI. The organization is as follows:

- `/src/pages`: The primary entry points for each function of the app
- `/src/components/ErrorBoundary`: A component that displays an error message if an error occurs in the app
- `/src/components/ui`: Shared, resuable UI components (Shadcn UI)
- `/src/api`: API calls to the backend

##### API Calls

- **react-query** The frontend uses React Query to fetch data from the backend. React Query allows for client-side caching, automatic refetching, and error handling. In production, I would move the queries to a separate file if they need to be shared between pages.
- **apiRequest** The frontend uses a custom `apiRequest` function to make API calls to the backend. This function handles error handling and response parsing. In production, it would also handle other cross-cutting concerns like authentication.

##### Location

On page load, the user is prompted to share their location. If the user grants permission, the browser's geolocation API is used to get the user's coordinates. These coordinates are then used to fetch the user's location name and weather forecast.

If the user does not grant permission, or the browser's geolocation API is not supported, the user is prompted to search for a location manually.

The user can always change the location by clicking the "Change location" button.

##### Units

The user can select the units for the weather forecast. The available units are:

- **metric**: Celsius
- **imperial**: Fahrenheit
- **standard**: Kelvin

##### Weather Display

The weather forecast is displayed in a card format. The card contains the following information:
