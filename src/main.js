import { createApp } from "vue";
import store from "./store.js";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

createApp(App).use(router).use(vuetify).use(store).mount("#app");
