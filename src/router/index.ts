import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    },
    {
        path: '/',
        component: () => import('../views/Index.vue'),
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('../views/Home.vue'),
                redirect: '/i',
                children: [
                    {
                        path: '/i',
                        name: 'Index',
                        component: () => import('../views/nav/ArticleCardIndex.vue'),
                        meta: { title: 'index' },
                    },
                    {
                        path: '/a',
                        name: 'Article',
                        component: () => import('../views/nav/Article.vue'),
                        meta: { title: 'Article' },
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
            {
                path: '/a/:articleId',
                name: 'ArticleDetail',
                component: () => import('../views/detail/ArticleDetail.vue'),
                meta: { title: 'Article Detail' },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
