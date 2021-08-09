import http from "./httpService";

export async function getTrendingMovies(page) {
  let movies = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&page=${i}&include_adult=false`
    );
    const results = data.results;
    results.map((movie) => {
      return movies.push(movie);
    });
  }
  // // This is adding a property to each movie object.
  // const allMovies = movies.map((obj) => {
  //   obj["favourite"] = false;
  //   return obj;
  // });

  // Only show movies that have been released
  const filteredMovies = movies.filter((movie) => {
    return movie.vote_average !== 0;
  });
  return filteredMovies;
}

export async function getMovies(page, genreId, sortBy) {
  const genreQuery = genreId ? `&with_genres=${genreId}` : "&";
  const sortByQuery = sortBy ? `&sort_by=${sortBy}` : "&";
  let movies = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&language=en-US${sortByQuery}&include_adult=false${genreQuery}&vote_average.gte=1&vote_count.gte=2200&page=${i}`
    );
    const results = data.results;
    results.map((movie) => {
      return movies.push(movie);
    });
  }
  return movies;
}

export async function getGenreMovies(page, genreId, sortBy) {
  const genreQuery = genreId ? `&with_genres=${genreId}` : "&";
  const sortByQuery = sortBy ? `&sort_by=${sortBy}` : "&";
  let movies = [];
  for (let i = page; i <= page + 2; i++) {
    let { data } = await http.get(
      `https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&language=en-US${sortByQuery}&include_adult=false${genreQuery}&vote_average.gte=1&vote_count.gte=2200&page=${i}`
    );
    let moviesArray = data.results;
    moviesArray.map((obj) => {
      return movies.push(obj);
    });
  }
  // // This is adding a property to each movie object.
  // const allMovies = promises.map((obj) => {
  //   obj["favourite"] = false;
  //   return obj;
  // });
  return allMovies;
}

export async function textSearchMovies(query) {
  let { data } = await http.get(
    `http://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_MOVIES_DB_API_KEY}&query=${query}&include_adult=false`
  );

  let moviesArray = data.results;

  // Only Show movies have a vote count higher that 300
  const movies = moviesArray.filter((movie) => {
    return movie.vote_count > 300;
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
