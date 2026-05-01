'use client'

import { useState } from 'react'
import { getCurrentWeather, WeatherResponse } from '@/lib/weather'

export default function Home() {
  // State variables with proper types
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherResponse | null>(null)  // Fixed: no more 'any'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Function to get weather data
  const getWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      // Use the API function from our library
      const data = await getCurrentWeather(city)
      setWeather(data)
      
    } catch (err: unknown) {  // Better error typing
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Weather App
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && getWeather()}
            placeholder="Enter city name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-700"
          />

          <button
            onClick={getWeather}
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
