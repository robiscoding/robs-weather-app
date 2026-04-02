import * as LocationApi from "@/api/location";
import * as WeatherApi from "@/api/weather";
import type { WeatherForecast } from "@robiscoding/shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WeatherPage from "./WeatherPage";

vi.mock("@/api/location");
vi.mock("@/api/weather");

const MOCK_COORDS = { lat: 35.22, lon: -80.84 };
const MOCK_LOCATION = {
  lat: 35.22,
  lon: -80.84,
  display_name: "Charlotte, NC, USA",
};
const MOCK_WEATHER: WeatherForecast = {
  timestamp: "2026-04-02T12:00:00Z",
  location: MOCK_COORDS,
  units: "imperial",
  condition: { code: 800, label: "Clear sky" },
  temp: 72,
  feels_like: 70,
  temp_min: 65,
  temp_max: 78,
  humidity: 55,
  visibility: 16093,
  wind: { speed: 5, deg: 180, gust: 8 },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function renderWeatherPage() {
  return render(<WeatherPage />, { wrapper: createWrapper() });
}

function geoRejects() {
  vi.mocked(LocationApi.getBrowserLocation).mockRejectedValue(
    new Error("denied"),
  );
}

function geoResolves() {
  vi.mocked(LocationApi.getBrowserLocation).mockResolvedValue(MOCK_COORDS);
  vi.mocked(LocationApi.reverseGeocode).mockResolvedValue(MOCK_LOCATION);
  vi.mocked(WeatherApi.fetchWeather).mockResolvedValue(MOCK_WEATHER);
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe("AppHeader always renders", () => {
  it("shows the app title in the landing state (geo denied)", async () => {
    geoRejects();
    renderWeatherPage();
    expect(
      screen.getByRole("heading", { name: /rob's weather app/i }),
    ).toBeInTheDocument();
  });

  it("shows the app title after geolocation succeeds and weather is displayed", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(screen.getByText("Clear sky")).toBeInTheDocument(),
    );
    expect(
      screen.getByRole("heading", { name: /rob's weather app/i }),
    ).toBeInTheDocument();
  });
});

describe("Geolocation success flow", () => {
  it("calls getBrowserLocation once on mount", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(vi.mocked(LocationApi.getBrowserLocation)).toHaveBeenCalledTimes(
        1,
      ),
    );
  });

  it("calls reverseGeocode with the browser coords", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(vi.mocked(LocationApi.reverseGeocode)).toHaveBeenCalledWith(
        MOCK_COORDS,
      ),
    );
  });

  it("calls fetchWeather with the browser coords", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(vi.mocked(WeatherApi.fetchWeather)).toHaveBeenCalledWith(
        MOCK_COORDS,
      ),
    );
  });

  it("renders WeatherDisplay after geolocation succeeds", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(screen.getByText("Clear sky")).toBeInTheDocument(),
    );
    expect(screen.queryByPlaceholderText(/charlotte/i)).not.toBeInTheDocument();
  });

  it("displays the reverse-geocoded location name", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(screen.getByText("Charlotte, NC, USA")).toBeInTheDocument(),
    );
  });
});

describe("Geolocation denied / landing state", () => {
  it("shows the location search form when geolocation is denied", async () => {
    geoRejects();
    renderWeatherPage();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /get weather/i }),
      ).toBeInTheDocument(),
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("submit button is disabled when the input is empty", async () => {
    geoRejects();
    renderWeatherPage();
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /get weather/i }),
      ).toBeDisabled(),
    );
  });
});

describe("Form submission flow", () => {
  beforeEach(() => {
    geoRejects();
    vi.mocked(LocationApi.fetchLocation).mockResolvedValue(MOCK_LOCATION);
    vi.mocked(WeatherApi.fetchWeather).mockResolvedValue(MOCK_WEATHER);
  });

  it("calls fetchLocation with the typed query on submit", async () => {
    const user = userEvent.setup();
    renderWeatherPage();
    await waitFor(() => expect(screen.getByRole("textbox")).not.toBeDisabled());

    await user.type(screen.getByRole("textbox"), "Charlotte, NC");
    await user.click(screen.getByRole("button", { name: /get weather/i }));

    await waitFor(() =>
      expect(vi.mocked(LocationApi.fetchLocation)).toHaveBeenCalledWith(
        "Charlotte, NC",
      ),
    );
  });

  it("calls fetchWeather with coords from fetchLocation result", async () => {
    const user = userEvent.setup();
    renderWeatherPage();
    await waitFor(() => expect(screen.getByRole("textbox")).not.toBeDisabled());

    await user.type(screen.getByRole("textbox"), "Charlotte, NC");
    await user.click(screen.getByRole("button", { name: /get weather/i }));

    await waitFor(() =>
      expect(vi.mocked(WeatherApi.fetchWeather)).toHaveBeenCalledWith(
        MOCK_LOCATION,
      ),
    );
  });

  it("renders WeatherDisplay after a successful form search", async () => {
    const user = userEvent.setup();
    renderWeatherPage();
    await waitFor(() => expect(screen.getByRole("textbox")).not.toBeDisabled());

    await user.type(screen.getByRole("textbox"), "Charlotte, NC");
    await user.click(screen.getByRole("button", { name: /get weather/i }));

    await waitFor(() =>
      expect(screen.getByText("Clear sky")).toBeInTheDocument(),
    );
  });

  it('submit button shows "Loading..." and is disabled while fetching', async () => {
    let resolveLocation!: (v: typeof MOCK_LOCATION) => void;
    vi.mocked(LocationApi.fetchLocation).mockReturnValue(
      new Promise((res) => {
        resolveLocation = res;
      }),
    );

    const user = userEvent.setup();
    renderWeatherPage();
    await waitFor(() => expect(screen.getByRole("textbox")).not.toBeDisabled());

    await user.type(screen.getByRole("textbox"), "Charlotte, NC");
    await user.click(screen.getByRole("button", { name: /get weather/i }));

    expect(screen.getByRole("button", { name: /loading/i })).toBeDisabled();

    resolveLocation(MOCK_LOCATION);
  });
});

describe("Change location flow", () => {
  it('clicking "Change selected location" returns to the search form', async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(screen.getByText("Clear sky")).toBeInTheDocument(),
    );

    await userEvent.click(
      screen.getByRole("button", { name: /change location/i }),
    );

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get weather/i }),
    ).toBeInTheDocument();
  });

  it("AppHeader heading remains visible after returning to the form", async () => {
    geoResolves();
    renderWeatherPage();
    await waitFor(() =>
      expect(screen.getByText("Clear sky")).toBeInTheDocument(),
    );

    await userEvent.click(
      screen.getByRole("button", { name: /change location/i }),
    );

    expect(
      screen.getByRole("heading", { name: /rob's weather app/i }),
    ).toBeInTheDocument();
  });
});
