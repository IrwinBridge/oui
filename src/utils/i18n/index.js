/* eslint-disable import/prefer-default-export */
export const getLocale = () => {
  const locale = window.ouidatepicker.localeId;
  const localeRegion = locale.split('-');
  return localeRegion[0] ?? locale;
};
