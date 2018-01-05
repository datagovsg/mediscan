import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Subscribe from '@/components/Subscribe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/:id',
      name: 'Subscribe',
      component: Subscribe,
      props: true
    }
  ]
})
