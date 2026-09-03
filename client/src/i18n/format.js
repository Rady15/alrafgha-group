import i18n from './index';

const getLocale = () => (i18n.language && i18n.language.startsWith('ar') ? 'ar-SA' : 'en-SA');

export const formatPrice = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return new Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'SAR' }).format(0);
  return new Intl.NumberFormat(getLocale(), { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(num);
};

export const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return '0';
  return new Intl.NumberFormat(getLocale()).format(n);
};

export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(getLocale(), { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString(getLocale(), { dateStyle: 'medium', timeStyle: 'short' });
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
};
