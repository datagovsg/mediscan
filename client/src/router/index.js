import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Index from '@/components/Index'
import Subscribe from '@/components/Subscribe'
import Verify from '@/components/Verify'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/:id',
      name: 'Index',
      component: Index,
      props: true
    },
    {
      path: '/:id/subscribe',
      name: 'Subscribe',
      component: Subscribe,
      props: true
    },
    {
      path: '/:id/verify/:phoneNumber',
      name: 'Verify',
      component: Verify,
      props: true
    }
  ]
})
