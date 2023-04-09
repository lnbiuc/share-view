export const validateTitle = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('title is required'));
    } else if (value.length > 64) {
        callback(new Error('title too long'));
    }
    callback();
};

export const validateIntroduction = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('title is required'));
    } else if (value.length > 128) {
        callback(new Error('title too long'));
    }
    callback();
};
export const validateCategory = (rule: any, value: any, callback: any) => {
    if (value < 3000) {
        callback(new Error('category is required'));
    }
    callback();
};

export const validateTags = (rule: any, value: number[], callback: any) => {
    if (value.length > 5 || value.length < 1) {
        callback(new Error('require 1 - 5 tags'));
    }
    callback();
};
