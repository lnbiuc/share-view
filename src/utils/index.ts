import { format } from 'timeago.js';
import { articleParams, getArticleListBySubscribe } from '../api/articleApi';
import { useDialogControlStore, useUserStore } from '../pinia';
import { storeToRefs } from 'pinia';

export const formatTime = (data: string) => {
    return format(data, 'zh_CN');
};

export const renderToc = () => {
    // 生成目录插件初始化
    // @ts-ignore
    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '.js-toc', // 生成的目录放在哪儿 , 这里用css选中
        // Where to grab the headings to build the table of contents.
        contentSelector: '#markdown', // 生成目录的源在那儿 , 就是给谁生成目录
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h1, h2, h3', // 能给生成的几级标题
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
        // Smooth scrolling enabled.
        scrollSmooth: true,
        // Smooth scroll duration.
        scrollSmoothDuration: 750,
        // 到顶部导航条的距离
        scrollSmoothOffset: -10,
        // Headings offset between the headings and the top of the document (this is meant for minor adjustments).
        // Can also be used to account for scroll height discrepancies from the use of css scroll-padding-top
        headingsOffset: 10,
    });
};

export const formatDate = (date: any | object) => {
    let mouth;
    let day;
    if (date.getMonth() + 1 < 10) {
        mouth = '0' + (date.getMonth() + 1);
    } else {
        mouth = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
        day = '0' + date.getDate();
    } else {
        day = date.getDate();
    }
    return date.getFullYear() + '-' + mouth + '-' + day;
};
