import App from '@/App.vue';
import i18n from '@/plugins/i18n';

import '@/style.css';

import { createApp, markRaw, ref } from 'vue';
import { createVuetify, components, directives }from 'vuetify/dist/vuetify.js';
import { createPinia } from 'pinia';
import LazyLoad from 'lazy-load-vue3';

// window.Vue = Vue;
import { DiamondhandWidgetPlugin } from 'dh-widget'
import 'dh-widget/dist/style.css'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import router from './router';
import { useBaseStore } from './stores/useBaseStore';
const vuetify = createVuetify({
  components, 
  directives,
  theme: {
    defaultTheme: 'dark'
  }
})

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router)
});
// Create vue app
let app = createApp(App);
// app.use(vuetify)
// app.component('dh-connect-wallet', DhConnectWallet)
app.use(pinia);
app.use(router);
app.use(vuetify)
// Use plugins
app.use(i18n);
app.use(LazyLoad, { component: true });

console.log(window)
console.log(app)

app.use(DiamondhandWidgetPlugin)
// Mount vue app
app.mount('#app');

// fetch latest block every 6s
const blockStore = useBaseStore();
const requestCounter = ref(0);
setInterval(() => {
  requestCounter.value += 1;
  if (requestCounter.value < 5) {
    // max allowed request
    blockStore.fetchLatest().finally(() => (requestCounter.value -= 1));
  }
}, 6000);