// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'

// Response types
export interface WeatherResponse {
  city: string
  temperature: number
  feels_like: number           // ← NEW
  description: string
  icon: string                 // ← NEW - OpenWeatherMap icon code (e.g., "01d")
  humidity: number
  wind_speed: number
  wind_deg: number             // ← NEW
  visibility: number           // ← NEW
  pressure: number             // ← NEW
  temp_min: number             // ← NEW
  temp_max: number             // ← NEW
  dew_point: number            // ← NEW
  country: string
  weather_code: number         // ← NEW
}

export interface ForecastItem {
  temp: number
  temp_min: number             // ← NEW
  temp_max: number             // ← NEW
  description: string
  icon: string                 // ← NEW - OpenWeatherMap icon code
  weather_code: number         // ← NEW - Weather condition code
  dt_txt: string
  pop: number                  // ← NEW (0-100%)
  humidity: number             // ← NEW
  wind_speed: number           // ← NEW
}

export interface ForecastResponse {
  forecast: ForecastItem[]
  city: string
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
export async function getForecast(city: string): Promise<ForecastResponse> {
  const response = await fetch(`${API_BASE_URL}/forecast/?city=${city}`)
  
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.error || 'Failed to fetch weather data')
  }
  return response.json()
}