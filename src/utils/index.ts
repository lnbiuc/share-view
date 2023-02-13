import { format } from 'timeago.js';

export function formatTime(data: string) {
    return format(data, 'zh_CN');
}
