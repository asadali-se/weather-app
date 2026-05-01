// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Response types
export interface WeatherResponse {
  city: string
  temperature: number
  description: string
  humidity: number
  wind_speed: number
}

export interface ErrorResponse {
  error: string
}

// Get current weather for a city
export async function getCurrentWeather(city: string): Promise<WeatherResponse> {
  const response = await fetch(`${API_BASE_URL}/weather/?city=${city}`)
  
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.error || 'Failed to fetch weather data')
  }
  
  return response.json()
}
