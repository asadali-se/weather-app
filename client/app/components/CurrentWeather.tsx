import { WeatherResponse } from "@/app/lib/weather";
import { getOpenWeatherIcon } from "@/app/lib/weatherIcons";
import Image from "next/image";
interface CurrentWeatherProps {
    weather: WeatherResponse;
}

export default function CurrentWeather({ weather }: CurrentWeatherProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
            {/* Weather icon */}
            <h1 className="text-4xl font-bold text-text-primary">{weather.city} ({weather.country})</h1>

            {/* Weather Icon */}
            <Image src={getOpenWeatherIcon(weather.icon)} alt={weather.description} width={120} height={120} priority />

            {/* Temperature */}
            <div className="text-7xl font-light text-text-primary">
                {Math.round(weather.temperature)}°
            </div>

            {/* Feels Like */}
            <div className="text-lg text-text-secondary">
                Feels like {Math.round(weather.feels_like)}°
            </div>

            {/* High/Low */}
            <div className="flex gap-4 text-text-primary">
                <span>High: {Math.round(weather.temp_max)}°</span>
                <span>Low: {Math.round(weather.temp_min)}°</span>
            </div>

            {/* Description */}
            <p className="text-xl text-text-secondary capitalize">
                {weather.description}
            </p>
        </div>
    );
};