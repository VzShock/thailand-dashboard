'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function CurrencyConverter() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Load exchange rates on component mount
    fetchExchangeRates();
    
    return () => window.removeEventListener('resize', checkIfMobile);
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

  // Mobile Bottom Bar Version
  if (isMobile) {
    return (
      <>
        {/* Mobile FAB */}
        <AnimatePresence>
          {isMinimized && (
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMinimized(false)}
              className="fixed bottom-4 left-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center z-[80]"
            >
              <span className="text-xl">💱</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Mobile Bottom Sheet Converter */}
        <AnimatePresence>
          {!isMinimized && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-[85]"
                onClick={() => setIsMinimized(true)}
              />
              
              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-[90] bg-white rounded-t-3xl shadow-2xl"
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                </div>
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xl">💱</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Currency Converter</h3>
                      <p className="text-sm text-gray-500">Quick THB, EUR, USD conversion</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-gray-600">✕</span>
                  </button>
                </div>
                
                {/* Currency Inputs */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* THB Input */}
                    <motion.div 
                      className={`border-2 rounded-2xl p-4 transition-all ${
                        activeInput === 'thb' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🇹🇭</div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Thai Baht (THB)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={thb}
                            onChange={(e) => convertFromTHB(e.target.value)}
                            onFocus={() => setActiveInput('thb')}
                            onBlur={() => setActiveInput(null)}
                            className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* EUR Input */}
                    <motion.div 
                      className={`border-2 rounded-2xl p-4 transition-all ${
                        activeInput === 'eur' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🇪🇺</div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Euro (EUR)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={eur}
                            onChange={(e) => convertFromEUR(e.target.value)}
                            onFocus={() => setActiveInput('eur')}
                            onBlur={() => setActiveInput(null)}
                            className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* USD Input */}
                    <motion.div 
                      className={`border-2 rounded-2xl p-4 transition-all ${
                        activeInput === 'usd' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">🇺🇸</div>
                        <div className="flex-1">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            US Dollar (USD)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={usd}
                            onChange={(e) => convertFromUSD(e.target.value)}
                            onFocus={() => setActiveInput('usd')}
                            onBlur={() => setActiveInput(null)}
                            className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Clear Button */}
                  <motion.button
                    onClick={clearAll}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </motion.button>
                  
                  {/* Exchange Rate Info & Status */}
                  <div className="space-y-2">
                    <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                      💡 <strong>Live Rates:</strong> 100 THB = {(100 * exchangeRates.thb_to_eur).toFixed(1)} EUR = {(100 * exchangeRates.thb_to_usd).toFixed(1)} USD
                    </div>
                    
                    {/* Status & Refresh */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isLoading ? (
                          <span className="text-blue-600">🔄 Updating...</span>
                        ) : error ? (
                          <span className="text-orange-600">⚠️ {error}</span>
                        ) : (
                          <span className="text-green-600">✅ Live rates</span>
                        )}
                        {lastUpdated && (
                          <span className="text-gray-500">
                            • {lastUpdated.toLocaleTimeString('en-US', { 
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
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {isLoading ? '⏳' : '🔄'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop Version
  return (
    <div className={`fixed bottom-5 right-5 bg-white rounded-2xl shadow-xl z-50 transition-all duration-300 ${
      isMinimized ? 'p-3 cursor-pointer' : 'p-4'
    }`} onClick={isMinimized ? () => setIsMinimized(false) : undefined}>
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-blue-600 text-sm">💱 Quick Convert</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
          className="text-gray-600 hover:text-gray-800 font-bold"
        >
          {isMinimized ? '+' : '−'}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={thb}
            onChange={(e) => convertFromTHB(e.target.value)}
            placeholder="THB"
            className="w-20 p-2 border border-gray-400 rounded text-center text-sm text-gray-800"
          />
          <span>=</span>
          <input
            type="number"
            value={eur}
            onChange={(e) => convertFromEUR(e.target.value)}
            placeholder="EUR"
            className="w-20 p-2 border border-gray-400 rounded text-center text-sm text-gray-800"
          />
          <span>=</span>
          <input
            type="number"
            value={usd}
            onChange={(e) => convertFromUSD(e.target.value)}
            placeholder="USD"
            className="w-20 p-2 border border-gray-400 rounded text-center text-sm text-gray-800"
          />
        </div>
      )}
    </div>
  );
}