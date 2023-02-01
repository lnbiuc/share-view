import axios from "axios";

interface articleParams {
  pageNumber: number;
  pageSize: number;
  filterBy: filterBy;
  sortBy: sortBy;
}

interface filterBy {
  authorId: string;
  categoryId: number;
  tagId: number;
  type: number;
  startDay: string;
  endDay: string;
}

interface sortBy {
  hot: boolean;
  lastUpdate: boolean;
  like: boolean;
  releaseTime: boolean;
  views: boolean;
}

export function getArticleList(data: articleParams) {
  return axios.post("./api/article/page", data);
}