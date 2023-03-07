import Team from "../pages/Team.vue";
import * as VueRouter from 'vue-router'
import LoginUser from "../components/LoginUser.vue"
import Index from "../pages/Index.vue";
import UserEdit from "../pages/UserEdit.vue";

import User from "../pages/User.vue";
import UserSearch from "../pages/search/UserSearch.vue";


const routes = [
    {path: '/', component: LoginUser},
    {path: '/team', component: Team},
    {path: '/index', component: Index},
    {path: '/user', component: User},
    {path: '/search', component: UserSearch},
    {path: '/user_edit', component: UserEdit},
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

export default router


