export const getWeatherIcon = (
    description: string,
    isDay: boolean = true
): string => {
    const desc = description.toLowerCase();

    // ========== CLEAR / SUNNY ==========                                                                                                                   
    if (desc.includes('clear') || desc.includes('sunny')) {
        return isDay ? '/SunnyDayV3.svg' : '/ClearNightV3.svg';
    }

    // ========== MOSTLY SUNNY ==========
    if (desc.includes('mostly sunny') || desc.includes('partly sunny')) {
        return isDay ? '/MostlySunnyDay.svg' : '/ClearNightV3.svg';
    }

    // ========== FEW CLOUDS / SCATTERED CLOUDS (OpenWeatherMap "sunny" variations) ==========
    if (desc.includes('few clouds') || desc.includes('scattered clouds')) {
        return isDay ? '/SunnyDayV3.svg' : '/ClearNightV3.svg';
    }

    // ========== CLOUDY ==========
    if (desc.includes('cloud') && !desc.includes('rain')) {
        if (desc.includes('mostly cloudy')) {
            return isDay ? '/MostlyCloudyDayV2.svg' : '/MostlyCloudyNightV2.svg';
        }
        if (desc.includes('partly cloudy')) {
            return isDay ? '/D200PartlySunnyV2.svg' : '/PartlyCloudyNightV2.svg';
        }
        return '/CloudyV3.svg';
    }

    // ========== SNOW ==========
    if (desc.includes('snow') || desc.includes('sleet') || desc.includes('blizzard') || desc.includes('flurries')) {
        return '/snow.png';
    }

    // ========== THUNDERSTORM ==========
    if (desc.includes('thunder') || desc.includes('storm')) {
        return isDay ? '/daythunderstorm.svg' : '/nightthunderstorm.svg';
    }

    // ========== RAIN ==========                                                                                                                            
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
        if (desc.includes('light')) {
            return isDay ? '/D210LightRainShowersV2.svg' : '/N210LightRainShowersV2.svg';
        }
        if (desc.includes('moderate')) {
            return '/ModerateRainV2.svg';
        }
        return isDay ? '/RainShowersDayV2.svg' : '/LightRainShowerNight.svg';
    }

    // ========== FOG / MIST / HAZE ==========                                                                                                               
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) {
        return '/icons8-fog-50.png';
    }

    // ========== WINDY ==========                                                                                                                           
    if (desc.includes('wind') || desc.includes('breeze')) {
        return '/WindyV2.svg';
    }

    // Default fallback                                                                                                                                      
    return '/CloudyV3.svg';
};

export const isDayTime = (dt_txt?: string): boolean => {
    if (!dt_txt) return true;
    const hour = new Date(dt_txt).getHours();
    return hour >= 6 && hour < 18;
}; export const getWeatherIconByCode = (
    code: number,
    isDay: boolean = true
): string => {
    // Clear                                                                                                                                                 
    if (code === 800) {
        return isDay ? '/SunnyDayV3.svg' : '/ClearNightV3.svg';
    }

    // Few clouds (11-25%) → Mostly sunny                                                                                                                    
    if (code === 801) {
        return isDay ? '/MostlySunnyDay.svg' : '/ClearNightV3.svg';
    }

    // Scattered clouds (25-50%) → Partly sunny/cloudy                                                                                                       
    if (code === 802) {
        return isDay ? '/D200PartlySunnyV2.svg' : '/PartlyCloudyNightV2.svg';
    }

    // Broken clouds (51-84%) → Mostly cloudy                                                                                                                
    if (code === 803) {
        return isDay ? '/MostlyCloudyDayV2.svg' : '/MostlyCloudyNightV2.svg';
    }

    // Overcast clouds (85-100%)                                                                                                                             
    if (code === 804) {
        return '/CloudyV3.svg';
    }

    // Rain (500-531)                                                                                                                                        
    if (code >= 500 && code <= 531) {
        return isDay ? '/RainShowersDayV2.svg' : '/LightRainShowerNight.svg';
    }

    // Snow (600-622)                                                                                                                                        
    if (code >= 600 && code <= 622) {
        return '/snow.png';
    }

    // Thunderstorm (200-232)                                                                                                                                
    if (code >= 200 && code <= 232) {
        return isDay ? '/daythunderstorm.svg' : '/nightthunderstorm.svg';
    }

    // Fog/Mist (701-781)
    if (code >= 701 && code <= 781) {
        return '/icons8-fog-50.png';
    }

    // Default
    return '/CloudyV3.svg';
};

// Get OpenWeatherMap official icon URL
export const getOpenWeatherIcon = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
                       