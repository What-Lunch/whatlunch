import { NextResponse } from 'next/server';

const CACHE_DURATION = 6 * 60 * 60 * 1000;

type TimeSlot = 'morning' | 'afternoon' | 'evening';

const weatherCache: Record<TimeSlot, WeatherData | null> = {
  morning: null,
  afternoon: null,
  evening: null,
};

const weatherCacheTimestamp: Record<TimeSlot, number | null> = {
  morning: null,
  afternoon: null,
  evening: null,
};

function getCurrentTimeSlot(): TimeSlot {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

export async function GET(request: Request) {
  try {
    const timeSlot = getCurrentTimeSlot();
    const now = Date.now();

    const { searchParams } = new URL(request.url);
    const latitude = Number(searchParams.get('lat') ?? 37.5665);
    const longitude = Number(searchParams.get('lon') ?? 126.978);

    const cachedWeather = weatherCache[timeSlot];
    const cachedAt = weatherCacheTimestamp[timeSlot];

    const isCacheValid = cachedWeather && cachedAt && now - cachedAt < CACHE_DURATION;

    if (isCacheValid) {
      return NextResponse.json(cachedWeather);
    }

    const apiKey = process.env.WEATHER_API_KEY!;
    const apiUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'OpenWeather error', detail: errorText },
        { status: response.status }
      );
    }

    const weatherData: WeatherData = await response.json();

    weatherCache[timeSlot] = weatherData;
    weatherCacheTimestamp[timeSlot] = now;

    return NextResponse.json(weatherData);
  } catch (error) {
    return NextResponse.json({ error: 'server crash', detail: String(error) }, { status: 500 });
  }
}
