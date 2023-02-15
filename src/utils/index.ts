import { format } from 'timeago.js';

export const formatTime = (data: string) => {
    return format(data, 'zh_CN');
};
