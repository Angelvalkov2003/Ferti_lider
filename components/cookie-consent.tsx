"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_PREFERENCES_KEY = "cookie_preferences";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsButton, setShowSettingsButton] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consent === "accepted") {
      // Load saved preferences
      if (savedPreferences) {
        try {
          const parsed = JSON.parse(savedPreferences);
          setPreferences(parsed);
          initializeAnalytics(parsed.analytics);
        } catch (e) {
          console.error("Error parsing cookie preferences:", e);
        }
      }
      // Show settings button if consent was already given
      setShowSettingsButton(true);
      return; // Don't show banner if already accepted
    }

    // Show banner after a short delay for better UX
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const initializeAnalytics = (enabled: boolean) => {
    if (!enabled || typeof window === "undefined") return;

    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    // Don't initialize if no ID or if explicitly set to "none"
    if (!gaId || gaId.trim() === "" || gaId.toLowerCase() === "none") {
      return; // Silently skip if not configured
    }

    // Check if already initialized
    if (window.dataLayer && typeof window.gtag === "function") {
      return;
    }

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    const gtagFunction = function(...args: any[]) {
      window.dataLayer.push(args);
    };
    (gtagFunction as any).l = +new Date();
    (gtagFunction as any).q = [];
    window.gtag = gtagFunction as typeof window.gtag;

    // Load Google Analytics script
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Configure gtag with GDPR compliance
    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      anonymize_ip: true, // GDPR compliance - anonymize IP addresses
      allow_google_signals: false, // Disable Google Signals for GDPR
      allow_ad_personalization_signals: false, // Disable ad personalization
    });
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    initializeAnalytics(prefs.analytics);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return; // Cannot disable necessary cookies
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  if (!showBanner && !showSettings) {
    // Show settings button if consent was already given
    if (showSettingsButton) {
      return (
        <button
          onClick={openSettings}
          className="fixed bottom-4 right-4 z-50 p-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          aria-label="Cookie настройки"
          title="Cookie настройки"
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </button>
      );
    }
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Използваме бисквитки
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Използваме бисквитки, за да подобрим вашето изживяване, да анализираме трафика и да персонализираме съдържанието. 
                  Като натиснете "Приеми всички", вие се съгласявате с използването на всички бисквитки. 
                  Можете да промените настройките по всяко време.{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Политика за поверителност
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <button
                  onClick={openSettings}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Настройки
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Отхвърли всички
                </button>
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Приеми всички
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Настройки на бисквитките
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Затвори"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Можете да изберете кои бисквитки да приемете. Необходимите бисквитки са задължителни за функционирането на сайта и не могат да бъдат деактивирани.
              </p>

              {/* Necessary Cookies */}
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Необходими бисквитки
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Тези бисквитки са задължителни за основното функциониране на уебсайта и не могат да бъдат деактивирани.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="h-5 w-5 text-blue-600 rounded border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Аналитични бисквитки
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Тези бисквитки ни помагат да разберем как посетителите използват нашия уебсайт, като събират и докладват информация анонимно. 
                      Използваме Google Analytics за тази цел.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => updatePreference("analytics", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Маркетингови бисквитки
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Тези бисквитки се използват за показване на реклами, които са по-релевантни за вас и вашите интереси.
                    </p>
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => updatePreference("marketing", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={saveCustomPreferences}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Запази настройките
                </button>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
                      setShowBanner(true);
                    }
                  }}
                  className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Отказ
                </button>
                <Link
                  href="/privacy-policy"
                  className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Политика за поверителност
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: {
      (...args: any[]): void;
      l?: number;
      q?: any[];
    };
    dataLayer: any[];
  }
}
