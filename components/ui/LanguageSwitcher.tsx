"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname, routing } from '@/i18n/routing';
import { useState, useTransition } from 'react';
import { Globe } from 'lucide-react';

const localeNames: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  id: 'Indonesia',
  es: 'Español',
  ar: 'العربية',
  pt: 'Português',
  af: 'Afrikaans',
  sw: 'Kiswahili',
  ja: '日本語'
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  function onLocaleChange(nextLocale: string) {
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
      >
        <Globe size={16} className="text-[#eb5017]" />
        <span>{localeNames[locale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="py-1">
              {routing.locales.map((cur) => (
                <button
                  key={cur}
                  onClick={() => onLocaleChange(cur)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    locale === cur 
                      ? 'bg-orange-50 text-[#eb5017] font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{localeNames[cur]}</span>
                  {locale === cur && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#eb5017]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
