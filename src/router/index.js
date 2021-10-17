import Vue from 'vue'
import VueRouter from 'vue-router'
import WorkSpace from '../views/WorkSpace.vue'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'WorkSpace',
		component: WorkSpace,
		meta: {
			title: 'WeNotes'
		}
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
	}
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	if (to.meta.tittle) {
		document.title = to.meta.title || ''
	}
	next()
})

export default router