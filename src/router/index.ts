import * as VueRouter from 'vue-router'
const routes = [
    {path: '/', component: () => import("../pages/IndexPage.vue")},
    {path: '/team', component: () => import("../pages/TeamPage.vue")},
    {path: '/team/show', name: 'teamShow', component: () => import("../pages/TeamShow.vue")},
    {path: '/team/create', name: 'teamCreate', component: () => import("../pages/TeamCreatePage.vue")},
    {path: '/team/edit', name: 'teamEdit', component: () => import("../pages/TeamEditPage.vue")},
    {path: '/user', component: () => import("../pages/UserPage.vue")},
    {path: '/user/more', component: () => import("../pages/UserPageMore.vue")},
    {path: '/user/more/password', component: () => import("../pages/PasswordEdit.vue")},
    {path: '/user/login', component: () => import("../pages/LoginUser.vue")},
    {path: '/user/register', component: () => import("../pages/RegisterUser.vue")},
    {path: '/user/show/:userId', name: 'userShow', component: () => import("../pages/UserShow.vue")},
    {path: '/user/team', name: "userTeamPage", component: () => import("../pages/UserTeamPage.vue")},
    {path: '/user/edit', component: () => import("../pages/UserEdit.vue")},
    {path: '/friends', component: () => import("../pages/FriendsPage.vue")},
    {path: '/chat', component: () => import("../pages/ChatPage.vue")},
    {path: '/public_chat', component: () => import("../components/Chat.vue")},
    {path: '/search', component: () => import("../pages/UserSearch.vue")},
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    // history: VueRouter.createWebHistory(),
    routes
})

export default router


