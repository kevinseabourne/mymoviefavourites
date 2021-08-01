import http from "./httpService";

const apiEndPoint = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&append_to_response=videos&page=`;

function movieUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getTrendingMovies(page) {
  let promises = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&page=${i}`
    );
    let moviesArray = data.results;
    moviesArray.map((obj) => {
      return promises.push(obj);
    });
  }
  // This is adding a property to each movie object.
  const allMovies = promises.map((obj) => {
    obj["favourite"] = false;
    return obj;
  });
  // Only Show movies that are released
  const movies = allMovies.filter((movie) => {
    return movie.vote_average !== 0;
  });
  return movies;
}

export async function getPopularMovies() {
  let promises = [];
  for (let i = 1; i <= 7; i++) {
    let { data: popularData } = await http.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&language=en-US&page=${i}`
    );
    let moviesArray = popularData.results;
    moviesArray.map((obj) => {
      return promises.push(obj);
    });
  }
  // This is adding a property to each movie object.
  const allMovies = promises.map((obj) => {
    obj["favourite"] = false;
    return obj;
  });
  // Only Show movies that are released
  const movies = allMovies.filter((movie) => {
    return movie.vote_average !== 0;
  });
  return movies;
}

export async function getTopRatedMovies() {
  let promises = [];
  for (let i = 1; i <= 7; i++) {
    let { data: topRatedData } = await http.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&language=en-US&page=${i}`
    );
    let moviesArray = topRatedData.results;
    moviesArray.map((obj) => {
      return promises.push(obj);
    });
  }
  // This is adding a property to each movie object.
  const movies = promises.map((obj) => {
    obj["favourite"] = false;
    return obj;
  });
  return movies;
}

export async function getVideoObject(id) {
  let { data: videoObj } = await http.get(
    `http://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}`
  );
  // This is adding a property to each movie object.
  const movies = videoObj;
  return movies;
}

export function getMovie(movieId) {
  return http.get(movieUrl(movieId));
}
