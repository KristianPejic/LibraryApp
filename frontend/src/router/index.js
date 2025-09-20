import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Home - Book Library',
        description: 'Discover millions of books and build your reading collection'
      }
    },

    // Books Browse Page
    {
      path: '/books',
      name: 'Books',
      component: () => import('../views/Books.vue'),
      meta: {
        title: 'Browse Books - Book Library',
        description: 'Search and browse our extensive book collection'
      }
    },

    // Book Details Page
    {
      path: '/books/:workId',
      name: 'BookDetails',
      component: () => import('../views/BookDetails.vue'),
      meta: {
        title: 'Book Details - Book Library'
      },
      props: true
    },

    // My Library Page (CRUD functionality)
    {
      path: '/my-library',
      name: 'MyLibrary',
      component: () => import('../views/MyLibrary.vue'),
      meta: {
        title: 'My Library - Book Library',
        description: 'Manage your personal book collection and reading lists'
      }
    },

    // About Page
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue'),
      meta: {
        title: 'About - Book Library',
        description: 'Learn more about our book library project and technologies used'
      }
    },

    // 404 Not Found
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: '404 - Page Not Found'
      }
    },

    // Search Results (redirect to Books with query)
    {
      path: '/search',
      redirect: to => {
        return { name: 'Books', query: to.query }
      }
    },

    // Genre browsing (redirect to Books with subject filter)
    {
      path: '/genre/:genre',
      redirect: to => {
        return {
          name: 'Books',
          query: { subject: to.params.genre }
        }
      }
    },

    // Author browsing (redirect to Books with author filter)
    {
      path: '/author/:author',
      redirect: to => {
        return {
          name: 'Books',
          query: { author: to.params.author }
        }
      }
    },

    // Catch all 404 - MUST be last route
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],

  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Book Library'
  }

  next()
})

export default router
