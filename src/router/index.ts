import * as VueRouter from 'vue-router'


const routes = [
    {path: '/', component: () => import("../pages/LoginUser.vue")},
    {path: '/team', component: () => import("../pages/TeamPage.vue")},
    {path: '/team/show/:teamId', name: 'teamShow', component: () => import("../pages/TeamShow.vue")},
    {path: '/index', component: () => import("../pages/IndexPage.vue")},
    {path: '/user', component: () => import("../pages/UserPage.vue")},
    {path: '/user/show/:userId', name: 'userShow', component: () => import("../pages/UserShow.vue")},
    {path: '/user/team/:teamsId', name: "userTeamPage", component: () => import("../pages/UserTeamPage.vue")},
    {path: '/user/edit', component: () => import("../pages/UserEdit.vue")},
    {path: '/search', component: () => import("../pages/search/UserSearch.vue")},
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

export default router


