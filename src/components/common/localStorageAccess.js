export const getLocal = (key) => {
  return localStorage.getItem(key);
};

export const setLocal = (key, value) => {
  return localStorage.setItem(key, value);
};

export const clearLocal = () => {
  return localStorage.clear();
};
