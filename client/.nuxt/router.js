import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _2431bccf = () => interopDefault(import('..\\pages\\details.vue' /* webpackChunkName: "pages/details" */))
const _3271c539 = () => interopDefault(import('..\\pages\\intro.vue' /* webpackChunkName: "pages/intro" */))
const _2dce26f7 = () => interopDefault(import('..\\pages\\play.vue' /* webpackChunkName: "pages/play" */))
const _bf21f4b6 = () => interopDefault(import('..\\pages\\signin.vue' /* webpackChunkName: "pages/signin" */))
const _634436c2 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/details",
    component: _2431bccf,
    name: "details"
  }, {
    path: "/intro",
    component: _3271c539,
    name: "intro"
  }, {
    path: "/play",
    component: _2dce26f7,
    name: "play"
  }, {
    path: "/signin",
    component: _bf21f4b6,
    name: "signin"
  }, {
    path: "/",
    component: _634436c2,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
