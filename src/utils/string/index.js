/* eslint-disable import/prefer-default-export */
export const capitalize = (str) => {
  const capital = str.charAt(0).toUpperCase();
  const other = str.substr(1);
  return `${capital}${other}`;
};
