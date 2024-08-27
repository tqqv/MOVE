import { createApp } from 'vue';
import 'primeicons/primeicons.css';
import './style.css';
import './custom.css';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import App from './App.vue';

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.fake-dark-selector', // Force a non-usage of the dark mode
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities',
      },
    },
  },
});
app.mount('#app');
