import {createApp} from 'vue'
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
import App from './App.vue'
import {Card, CellGroup, Divider, Empty, Field, Form} from 'vant';
import router from "./router";

const app = createApp(App);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Empty);
app.use(router)
app.use(Card);
app.use(Divider);
app.mount('#app')


