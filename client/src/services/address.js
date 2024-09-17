import axios from 'axios';


const apiBaseUrl = 'https://api.countrystatecity.in/v1/countries';

const axiosCountryInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'X-CSCAPI-KEY': import.meta.env.VITE_KEYAPICOUNTRY,
  },
});

const fetchData = async (url) => {
  try {
    const response = await axiosCountryInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const fetchCountries = async () => {
  return await fetchData('/');
};

const fetchStates = async (iso2) => {
  return await fetchData(`/${iso2}/states`);
};

export { fetchCountries, fetchStates };
