import React, { useEffect, useState } from 'react';
import { Card, Loader } from '../ui/Card';
import apiClient from '../../services/apiClient';

/* =========================================
   WEATHER WIDGET
========================================= */
export const WeatherWidget = ({ city = 'Islamabad' }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);

        const apiKey = import.meta.env.VITE_WEATHER_KEY;

        if (!apiKey) {
          setError('Weather API key not configured');
          return;
        }

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) throw new Error('Failed to fetch weather');

        const data = await res.json();

        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          city: data.name,
        });

      } catch (err) {
        console.error(err);
        setError('Weather unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading)
    return (
      <Card className="p-6 flex justify-center items-center min-h-[150px]">
        <Loader />
      </Card>
    );

  if (error)
    return (
      <Card className="p-6">
        <p className="text-danger-600 text-sm">{error}</p>
      </Card>
    );

  if (!weather) return null;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-sm text-neutral-600 uppercase mb-1">Weather</h3>
          <p className="text-xl font-bold">{weather.city}</p>
          <p className="text-3xl font-bold text-primary-600">{weather.temp}°C</p>
          <p className="text-sm text-neutral-600">{weather.condition}</p>
        </div>

        <div className="text-4xl">
          {weather.condition === 'Clear' && '☀️'}
          {weather.condition === 'Clouds' && '☁️'}
          {weather.condition === 'Rain' && '🌧️'}
          {weather.condition === 'Snow' && '❄️'}
          {weather.condition === 'Mist' && '🌫️'}
          {weather.condition === 'Thunderstorm' && '⛈️'}
        </div>
      </div>
    </div>
  );
};

/* =========================================
   FUEL PRICE WIDGET (OilPriceAPI)
========================================= */


export const FuelPriceWidget = () => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);

        const res = await apiClient.get('/reports/fuel-prices');

        console.log('Fuel API:', res.data); // DEBUG

        const raw = res.data?.data || res.data;

        // SAFELY EXTRACT VALUES (NO MAP)
        const extracted = {
          petrol: raw?.petrol || raw?.gasoline || raw?.Petrol || null,
          diesel: raw?.diesel || raw?.Diesel || null,
          crude: raw?.crude || raw?.oil || null,
        };

        setPrices(extracted);

      } catch (err) {
        console.error('Fuel price error:', err);
        setError('Fuel prices unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center min-h-[200px]">
        <Loader />
      </Card>
    );
  }

  if (error || !prices) {
    return (
      <Card className="p-6">
        <p className="text-sm text-danger-600">
          {error || 'No price data available'}
        </p>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-4">
        Global Fuel Snapshot
      </h3>

      <div className="space-y-3">

        <div className="flex justify-between">
          <span className="text-sm text-neutral-700">Petrol</span>
          <span className="font-bold">
            {prices.petrol ? `$${Number(prices.petrol).toFixed(2)}` : '--'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-neutral-700">Diesel</span>
          <span className="font-bold">
            {prices.diesel ? `$${Number(prices.diesel).toFixed(2)}` : '--'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-sm text-neutral-700">Crude Oil</span>
          <span className="font-bold">
            {prices.crude ? `$${Number(prices.crude).toFixed(2)}` : '--'}
          </span>
        </div>

      </div>

      <p className="text-xs text-neutral-500 mt-4 font-medium">
        Market reference (not your selling rate)
      </p>
    </div>
  );
};