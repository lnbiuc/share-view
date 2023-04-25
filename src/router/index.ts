import { createRouter, createWebHistory } from 'vue-router';
import { useFilterAndSortStore } from '../pinia';

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
                        component: () => import('../views/card/ArticleCardIndex.vue'),
                        meta: { title: 'index' },
                    },
                    {
                        path: '/a',
                        name: 'Article',
                        component: () => import('../views/card/ArticleCard.vue'),
                        meta: { title: 'Article' },
                    },
                    {
                        path: '/q',
                        name: 'Question',
                        component: () => import('../views/card/QuestionCard.vue'),
                        meta: { title: 'Question' },
                    },
                    {
                        path: '/p',
                        name: 'Post',
                        component: () => import('../views/card/PostCard.vue'),
                        meta: { title: 'Post' },
                    },
                    {
                        path: '/v',
                        name: 'Video',
                        component: () => import('../views/card/VideoCard.vue'),
                        meta: { title: 'Video' },
                    },
                    {
                        path: '/c',
                        name: 'Category',
                        component: () => import('../views/card/CategoryCard.vue'),
                        meta: { title: 'Category' },
                    },
                    {
                        path: '/t/:tagId',
                        name: 'Tag',
                        component: () => import('../views/card/TagCard.vue'),
                        meta: { title: 'Tag' },
                    },
                ],
            },
            {
                path: '/a/:articleId',
                name: 'ArticleDetail',
                component: () => import('../views/detail/ArticleDetail.vue'),
                meta: { title: 'Article Detail' },
            },
            {
                path: '/q/:questionId',
                name: 'QuestionDetail',
                component: () => import('../views/detail/QuestionDetail.vue'),
                meta: { title: 'Question Detail' },
            },
            {
                path: '/p/:postId',
                name: 'PostDetail',
                component: () => import('../views/detail/PostDetail.vue'),
                meta: { title: 'Post Detail' },
            },
            {
                path: '/v/:videoId',
                name: 'VideoDetail',
                component: () => import('../views/detail/VideoDetail.vue'),
                meta: { title: 'Video Detail' },
            },
            {
                path: '/c/:categoryId',
                name: 'CategoryDetail',
                component: () => import('../views/detail/CategoryDetail.vue'),
                meta: { title: 'Category Detail' },
            },
            {
                path: '/u/:userId',
                name: 'UserCenter',
                component: () => import('../views/user/UserCenter.vue'),
                redirect: '/u/p/:userId',
                children: [
                    {
                        path: '/u/p/:userId',
                        name: 'Profile',
                        component: () => import('../views/user/UserProfile.vue'),
                        meta: { title: 'Profile' },
                    },
                    {
                        path: '/u/s/:userId',
                        name: 'Settings',
                        component: () => import('../views/user/UserSettings.vue'),
                        meta: { title: 'Settings' },
                    },
                ],
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(() => {
    const store = useFilterAndSortStore();
    store.setDefault();
    window.scrollTo(0, 0);
});

export default router;
