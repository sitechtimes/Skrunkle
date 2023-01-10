import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _469daace = () => interopDefault(import('..\\pages\\details.vue' /* webpackChunkName: "pages/details" */))
const _26a61d83 = () => interopDefault(import('..\\pages\\intro.vue' /* webpackChunkName: "pages/intro" */))
const _1ce89d6d = () => interopDefault(import('..\\pages\\play.vue' /* webpackChunkName: "pages/play" */))
const _32c5b69b = () => interopDefault(import('..\\pages\\signin.vue' /* webpackChunkName: "pages/signin" */))
const _7adb862e = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

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
    component: _469daace,
    name: "details"
  }, {
    path: "/intro",
    component: _26a61d83,
    name: "intro"
  }, {
    path: "/play",
    component: _1ce89d6d,
    name: "play"
  }, {
    path: "/signin",
    component: _32c5b69b,
    name: "signin"
  }, {
    path: "/",
    component: _7adb862e,
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
