import { createRouter, createWebHistory } from 'vue-router'
import TeamList from '../views/TeamList.vue'
import PlayerList from '../views/PlayerList.vue'
import Dashboard from '../views/Dashboard.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/teams', component: TeamList },
  { path: '/players', component: PlayerList },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
