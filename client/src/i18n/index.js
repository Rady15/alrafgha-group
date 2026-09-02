import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './en/common.json';
import arCommon from './ar/common.json';
import enHome from './en/home.json';
import arHome from './ar/home.json';
import enVehicles from './en/vehicles.json';
import arVehicles from './ar/vehicles.json';
import enPricing from './en/pricing.json';
import arPricing from './ar/pricing.json';
import enBookings from './en/bookings.json';
import arBookings from './ar/bookings.json';
import enAuth from './en/auth.json';
import arAuth from './ar/auth.json';
import enDashboards from './en/dashboards.json';
import arDashboards from './ar/dashboards.json';
import enDocs from './en/docs.json';
import arDocs from './ar/docs.json';
import enVendor from './en/vendor.json';
import arVendor from './ar/vendor.json';

const STORAGE_KEY = 'ym_lang';
const savedLang = localStorage.getItem(STORAGE_KEY) || 'ar';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      home: enHome,
      vehicles: enVehicles,
      pricing: enPricing,
      bookings: enBookings,
      auth: enAuth,
      dashboards: enDashboards,
      docs: enDocs,
      vendor: enVendor,
    },
    ar: {
      common: arCommon,
      home: arHome,
      vehicles: arVehicles,
      pricing: arPricing,
      bookings: arBookings,
      auth: arAuth,
      dashboards: arDashboards,
      docs: arDocs,
      vendor: arVendor,
    },
  },
  lng: savedLang,
  fallbackLng: 'en',
  ns: ['common', 'home', 'vehicles', 'pricing', 'bookings', 'auth', 'dashboards', 'docs', 'vendor'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export function applyDir(lang) {
  const dir = lang && lang.startsWith('ar') ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang || 'en';
}

applyDir(savedLang);
i18n.on('languageChanged', applyDir);

export function changeLanguage(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
}

export default i18n;
