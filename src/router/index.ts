import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    },
    {
        path: '/',
        name: 'Index',
        component: () => import('../views/Index.vue'),
        meta: { title: 'Index' },
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
                meta: { title: 'Home' },
            },
            {
                path: '/a',
                name: 'Article',
                component: () => import('../views/nav/Article.vue'),
                meta: { title: 'Article' },
            },
            {
                path: '/a/:articleId',
                name: 'ArticleDetail',
                component: () => import('../views/detail/ArticleDetail.vue'),
                meta: { title: 'Article Detail' },
            },
            {
                path: '/q',
                name: 'Question',
                component: () => import('../views/nav/Question.vue'),
                meta: { title: 'Question' },
            },
            {
                path: '/p',
                name: 'Post',
                component: () => import('../views/nav/Post.vue'),
                meta: { title: 'Post' },
            },
            {
                path: '/v',
                name: 'Video',
                component: () => import('../views/nav/Video.vue'),
                meta: { title: 'Video' },
            },
            {
                path: '/c',
                name: 'Category',
                component: () => import('../views/nav/Category.vue'),
                meta: { title: 'Category' },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
