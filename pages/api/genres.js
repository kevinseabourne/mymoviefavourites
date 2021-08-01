import http from "./httpService";

const apiEndPoint = `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&language=en-US`;

export function getGenres() {
  return http.get(apiEndPoint);
}
