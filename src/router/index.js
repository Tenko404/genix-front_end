import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TinderMode from '../views/TinderMode.vue';
import UsuarioView from '@/views/UsuarioView.vue';
import PartyView from '@/views/PartyView.vue';
import MovieView from '@/views/MovieView.vue';
import GitHubTeam from '@/views/GitHubTeam.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tinder',
    name: 'tinder',
    component: TinderMode
  },
  {
    path: '/profile',
    name: 'profile',
    component: UsuarioView
  },
  {
    path: '/party',
    name: 'party',
    component: PartyView
  },
  {
    path: '/movie/:id',
    name: 'movie',
    component: MovieView
  },
  {
    path: '/team',
    name: 'team',
    component: GitHubTeam
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;