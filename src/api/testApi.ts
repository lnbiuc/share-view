import axios from 'axios'

export function getBlogList(pageNumber:number, pageSize:number) {
	return axios({
		url: './api/articles/title?pageNumber=' + pageNumber + '&pageSize=' + pageSize,
		method: 'GET',
	});
}