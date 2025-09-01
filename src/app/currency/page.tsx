'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SharedLayout from '@/components/SharedLayout';

// Fallback rates in case API fails
const fallbackRates = {
  thb_to_eur: 0.026,
  thb_to_usd: 0.029,
  eur_to_thb: 38.5,
  eur_to_usd: 1.12,
  usd_to_thb: 34.5,
  usd_to_eur: 0.89,
};

interface ExchangeRates {
  thb_to_eur: number;
  thb_to_usd: number;
  eur_to_thb: number;
  eur_to_usd: number;
  usd_to_thb: number;
  usd_to_eur: number;
}

export default function CurrencyPage() {
  const [thb, setThb] = useState('');
  const [eur, setEur] = useState('');
  const [usd, setUsd] = useState('');
  const [activeInput, setActiveInput] = useState<'thb' | 'eur' | 'usd' | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(fallbackRates);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch live exchange rates
  const fetchExchangeRates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Using exchangerate-api.com (free tier: 1500 requests/month)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/THB');
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data = await response.json();
      
      const newRates: ExchangeRates = {
        thb_to_eur: data.rates.EUR,
        thb_to_usd: data.rates.USD,
        eur_to_thb: 1 / data.rates.EUR,
        eur_to_usd: data.rates.USD / data.rates.EUR,
        usd_to_thb: 1 / data.rates.USD,
        usd_to_eur: data.rates.EUR / data.rates.USD,
      };
      
      setExchangeRates(newRates);
      setLastUpdated(new Date());
      
      // Cache the rates in localStorage with timestamp
      localStorage.setItem('currencyRates', JSON.stringify({
        rates: newRates,
        timestamp: new Date().getTime()
      }));
      
    } catch (err) {
      console.error('Currency API error:', err);
      setError('Using offline rates');
      
      // Try to load cached rates
      const cached = localStorage.getItem('currencyRates');
      if (cached) {
        const { rates, timestamp } = JSON.parse(cached);
        const hoursSinceCache = (new Date().getTime() - timestamp) / (1000 * 60 * 60);
        
        if (hoursSinceCache < 24) { // Use cache if less than 24 hours old
          setExchangeRates(rates);
          setLastUpdated(new Date(timestamp));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load exchange rates on component mount
    fetchExchangeRates();
  }, []);

  const convertFromTHB = (value: string) => {
    const thbValue = parseFloat(value) || 0;
    setThb(value);
    setEur((thbValue * exchangeRates.thb_to_eur).toFixed(2));
    setUsd((thbValue * exchangeRates.thb_to_usd).toFixed(2));
  };

  const convertFromEUR = (value: string) => {
    const eurValue = parseFloat(value) || 0;
    setEur(value);
    setThb((eurValue * exchangeRates.eur_to_thb).toFixed(0));
    setUsd((eurValue * exchangeRates.eur_to_usd).toFixed(2));
  };

  const convertFromUSD = (value: string) => {
    const usdValue = parseFloat(value) || 0;
    setUsd(value);
    setThb((usdValue * exchangeRates.usd_to_thb).toFixed(0));
    setEur((usdValue * exchangeRates.usd_to_eur).toFixed(2));
  };

  const clearAll = () => {
    setThb('');
    setEur('');
    setUsd('');
    setActiveInput(null);
  };

  return (
    <SharedLayout activeSection="overview">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <span className="text-5xl">💱</span>
            Currency Converter
          </h1>
          <p className="text-emerald-100 text-lg">
            Real-time THB, EUR, and USD exchange rates for Thailand 2025
          </p>
        </motion.div>

        {/* Main Converter Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-6"
        >
          {/* Currency Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* THB Input */}
            <motion.div 
              className={`border-2 rounded-2xl p-6 transition-all ${
                activeInput === 'thb' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🇹🇭</div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Thai Baht
                </label>
              </div>
              <input
                type="number"
                placeholder="0"
                value={thb}
                onChange={(e) => convertFromTHB(e.target.value)}
                onFocus={() => setActiveInput('thb')}
                onBlur={() => setActiveInput(null)}
                className="w-full text-3xl font-bold text-center bg-transparent border-none outline-none placeholder-gray-400"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
              />
              <div className="text-center text-xs text-gray-500 mt-2 font-medium">THB</div>
            </motion.div>

            {/* EUR Input */}
            <motion.div 
              className={`border-2 rounded-2xl p-6 transition-all ${
                activeInput === 'eur' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🇪🇺</div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Euro
                </label>
              </div>
              <input
                type="number"
                placeholder="0"
                value={eur}
                onChange={(e) => convertFromEUR(e.target.value)}
                onFocus={() => setActiveInput('eur')}
                onBlur={() => setActiveInput(null)}
                className="w-full text-3xl font-bold text-center bg-transparent border-none outline-none placeholder-gray-400"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
              />
              <div className="text-center text-xs text-gray-500 mt-2 font-medium">EUR</div>
            </motion.div>

            {/* USD Input */}
            <motion.div 
              className={`border-2 rounded-2xl p-6 transition-all ${
                activeInput === 'usd' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 bg-gray-50'
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🇺🇸</div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  US Dollar
                </label>
              </div>
              <input
                type="number"
                placeholder="0"
                value={usd}
                onChange={(e) => convertFromUSD(e.target.value)}
                onFocus={() => setActiveInput('usd')}
                onBlur={() => setActiveInput(null)}
                className="w-full text-3xl font-bold text-center bg-transparent border-none outline-none placeholder-gray-400"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
              />
              <div className="text-center text-xs text-gray-500 mt-2 font-medium">USD</div>
            </motion.div>
          </div>
          
          {/* Clear Button */}
          <div className="text-center mb-6">
            <motion.button
              onClick={clearAll}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Clear All
            </motion.button>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              💡 Current Exchange Rates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">100 THB =</div>
                <div className="text-xl font-bold text-emerald-600">
                  {(100 * exchangeRates.thb_to_eur).toFixed(2)} EUR
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">100 THB =</div>
                <div className="text-xl font-bold text-emerald-600">
                  {(100 * exchangeRates.thb_to_usd).toFixed(2)} USD
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">1 EUR =</div>
                <div className="text-xl font-bold text-emerald-600">
                  {exchangeRates.eur_to_thb.toFixed(1)} THB
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status & Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <span className="text-blue-600 font-medium">🔄 Updating exchange rates...</span>
              ) : error ? (
                <span className="text-orange-600 font-medium">⚠️ {error}</span>
              ) : (
                <span className="text-green-600 font-medium">✅ Live exchange rates</span>
              )}
              {lastUpdated && (
                <span className="text-gray-500 text-sm">
                  • Last updated: {lastUpdated.toLocaleString('en-US', { 
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              )}
            </div>
            
            <motion.button
              onClick={fetchExchangeRates}
              disabled={isLoading}
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '⏳ Updating...' : '🔄 Refresh Rates'}
            </motion.button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 leading-relaxed">
              <strong>💡 Thailand Currency Tips:</strong>
              <ul className="mt-2 space-y-1 ml-4">
                <li>• Most places accept cash (THB) - ATMs are widely available</li>
                <li>• Credit cards accepted at hotels, malls, and restaurants in cities</li>
                <li>• Street vendors and local markets prefer cash</li>
                <li>• Exchange rates at banks are usually better than airports</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </SharedLayout>
  );
}