import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Practice from '../views/Practice.vue'
import WrongNotes from '../views/WrongNotes.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/practice/:type', component: Practice },
  { path: '/wrong', component: WrongNotes },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})