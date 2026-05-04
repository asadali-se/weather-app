"use client";

import { useState } from "react";
import Image from "next/image";
import { getCurrentWeather, WeatherResponse, getForecast, ForecastResponse } from "@/app/lib/weather";
import { getOpenWeatherIcon, isDayTime } from "@/app/lib/weatherIcons";
import CurrentWeather from "@/app/components/CurrentWeather";

export default function Home() {
  // State variables with proper types
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);

  // Helper function to format date and time
  const formatDateTime = (dt_txt: string): string => {
    const date = new Date(dt_txt);
    const dateStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${dateStr}, ${timeStr}`;
  };

  // Function to get current weather data
  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setForecast(null);

    try {
      // Use the API function from our library
      const data = await getCurrentWeather(city);
      setWeather(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get forecast data
  const getForecastData = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);
    setError("");
    setForecast(null);

    try {
      const data = await getForecast(city);
      setForecast(data);
      setWeather(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-card-bg backdrop-blur-lg border border-card-border rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-text-primary mb-6">
          Weather App
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getWeather()}
            placeholder="Enter city name"
            className="w-full px-4 py-3 border-2 border-input-border rounded-lg focus:border-input-focus focus:outline-none text-text-primary bg-input-bg 
  placeholder-text-secondary"
          />

          <button
            onClick={getWeather}
            disabled={loading}
            className="w-full bg-accent-secondary hover:bg-btn-primary-hover disabled:bg-accent-secondary/50 text-white font-semibold py-3 rounded-lg 
  transition-colors"
          >
            {loading ? "Loading..." : "Get Weather"}
          </button>

          <button
            onClick={getForecastData}
            disabled={loading}
            className="w-full bg-accent-primary hover:bg-btn-secondary-hover disabled:bg-accent-primary/50 text-gray-900 font-semibold py-3 rounded-lg                 
  transition-colors"
          >
            {loading ? "Loading..." : "View 5-Day Forecast"}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-accent-warning/20 border-l-4 border-accent-warning text-text-primary rounded">
            {error}
          </div>
        )}

        {weather && (
          <div className="mt-6">
            <CurrentWeather weather={weather} />

            {/* Optional: Keep existing metrics for now */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Your existing metric cards */}
            </div>
          </div>
        )}

        {forecast && (
          <div className="mt-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-text-primary">
              5-Day Forecast for {forecast.city}
            </h2>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {forecast.forecast.map((item, index) => (
                <div
                  key={index}
                  className="bg-card-bg p-3 rounded-lg flex items-center gap-3 border border-card-border"
                >
                  {/* Weather Icon */}
                  <Image
                    src={getOpenWeatherIcon(item.icon)}
                    alt={item.description}
                    width={48}
                    height={48}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary">{formatDateTime(item.dt_txt)}</p>
                    <p className="text-text-primary capitalize font-medium">
                      {item.description}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-accent-primary">
                    {Math.round(item.temp)}°C
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
