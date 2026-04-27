'use client'

import { useState } from 'react'

// Define the shape of our weather data
type WeatherData = {
  city: string
  temperature: number
  description: string
  humidity: number
  wind_speed: number
}

export default function Home() {
  // Now TypeScript knows exactly what weather looks like
  const [city, setCity] = useState<string>('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  async function fetchWeather(): Promise<void> {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/weather/?city=${city}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to fetch weather')
      }
      
      const data = await response.json()
      setWeather(data)
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Weather App
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
            placeholder="Enter city name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-700"
          />

          <button
            onClick={fetchWeather}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {weather && (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{weather.city}</h2>
              <p className="text-gray-600 capitalize">{weather.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Temperature</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(weather.temperature)}°C
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-gray-600 text-sm">Humidity</p>
                <p className="text-3xl font-bold text-blue-600">
                  {weather.humidity}%
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center col-span-2">
                <p className="text-gray-600 text-sm">Wind Speed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {weather.wind_speed} m/s
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
