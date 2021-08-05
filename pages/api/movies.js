import http from "./httpService";

const apiEndPoint = `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&append_to_response=videos&page=`;

function movieUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getTrendingMovies(page) {
  let promises = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&page=${i}&vote_average.gte=1`
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
  // const movies = allMovies.filter((movie) => {
  //   return movie.vote_average !== 0;
  // });
  return allMovies;
}

export async function getPopularOrTopRatedMovies(page, sortBy) {
  let promises = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/movie/${sortBy}?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&language=en-US&page=${i}&vote_average.gte=1`
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

export async function getGenreMovies(page, genreId) {
  let promises = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&page=${i}&with_genres=${genreId}&vote_average.gte=1`
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

export async function textSearchMovies(query) {
  let { data } = await http.get(
    `http://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&query=${query}`
  );

  let moviesArray = data.results;
  // Only Show movies that are released
  const movies = moviesArray.filter((movie) => {
    return movie.vote_count > 300;
  });

  // movies are sorted in descending order based on the vote average
  movies.sort((a, b) => b.vote_average - a.vote_average);

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
