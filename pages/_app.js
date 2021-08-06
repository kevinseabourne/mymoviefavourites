import App from "next/app";
import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { useRouter } from "next/router";
import AppContext from "../context/appContext";
import { getGenres } from "./api/genres";
import {
  getTrendingMovies,
  getPopularOrTopRatedMovies,
  getGenreMovies,
  textSearchMovies,
} from "./api/movies";
import { GlobalStyle } from "../globalStyle";
import styled, { ThemeProvider } from "styled-components";
import { isArrayEmpty } from "../components/common/utils/isEmpty";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default function MyApp({
  Component,
  pageProps,
  allGenres,
  allTrendingMovies,
}) {
  const router = useRouter();
  const ref = useRef(null);
  const [status, setStatus] = useState("idle");
  const [dataTitle, setDataTitle] = useState("Trending");
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [genres, setGenres] = useState([]);
  const [secondGenreFilter, setSecondGenreFilter] = useState(false);
  const [secondSortByFilter, setSecondSortByFilter] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("Trending");
  const [searching, setSearching] = useState(false);
  const [noSearchResult, setNoSearchResult] = useState(false);
  // const [page, setPage] = useState(1);

  useEffect(() => {
    setGenres(allGenres);
    setMovies(allTrendingMovies);
    // window.addEventListener("scroll", getMoreMovies);
    // return () => window.removeEventListener("scroll", getMoreMovies);
  }, []);

  // ------------------------ Genre ------------------------ //

  // secondGenreFilter
  // If false, it allows the current data to be filtered without making a data request
  // if true a data request will be made for the current data title which could be either Trending, Popular or Top Rated
  // this is to avoid filtering data that has already been filtered.

  const handleSelectedGenre = (selected) => {
    const genresClone = [...genres];
    const selectedGenre = genresClone.find((genre) => genre.name === selected);

    setSelectedGenre(selected.name);
    if (selected.name === "All") {
      handleSelectedSortBy(dataTitle);
    } else {
      handleGenreFilter(selected);
    }
  };

  const handleGenreFilter = async (selectedGenre) => {
    // const filteredMovies = movies.filter((m) => {
    //   const genreIdsClone = [...m.genre_ids];
    //   console.log(selectedGenre);
    //   const answer = genreIdsClone.find((id) => id === selectedGenre.id);
    //   return answer;
    //
    //   // return _.includes(m.genre_ids, selectedGenre.id);
    // });
    // setMovies(filteredMovies);
    const response = await getGenreMovies(1, selectedGenre.id);

    if (response) {
      // movies are reset to empty to allow for animation
      setMovies([]);
      setMovies(response);
    }
  };

  // ------------------------ Sort By ------------------------ //
  // secondSortByFilter
  // If false, it allows the current data to be filtered without making a data request
  // if true a data request will be made for the current data title which could be either Trending, Popular or Top Rated
  // this is to avoid filtering data that has already been filtered.

  const handleSelectedSortBy = (selected) => {
    switch (selected) {
      case "Trending":
        handleGetTrendingMovies();
        break;
      case "Popular":
        handleGetPopularMovies();
        break;
      case "Top Rated":
        handleGetTopRatedMovies();
        break;
      case "Year":
        handleYearFilter();
        break;
      case "Title":
        handleTitleFilter();
        break;
      case "Rating":
        handleRatingFilter();
        break;

      default:
    }
  };

  const handleGetTrendingMovies = async () => {
    router.pathname === "/favourites" && router.push("/");
    setSearching(false);
    setStatus("pending");
    const trendingMovies = await getTrendingMovies(1);
    if (trendingMovies) {
      setNoSearchResult(false);
      if (secondSortByFilter) {
        setSecondSortByFilter(false);
        setStatus("resolved");
        return trendingMovies;
      } else {
        // movies are reset to empty to allow for animation
        setMovies([]);
        setDataTitle("Trending");
        setMovies(trendingMovies);
        setSecondSortByFilter(false);
        setStatus("resolved");
      }
    }
  };

  const handleGetPopularMovies = async () => {
    router.pathname === "/favourites" && router.push("/");
    setSearching(false);
    setStatus("pending");
    const popularMovies = await getPopularOrTopRatedMovies(1, "popular");
    if (popularMovies) {
      setNoSearchResult(false);
      if (secondSortByFilter) {
        setSecondSortByFilter(false);
        setStatus("resolved");
        return popularMovies;
      } else {
        // movies are reset to empty to allow for animation
        setMovies([]);
        setDataTitle("Popular");
        setMovies(popularMovies);
        setSecondSortByFilter(false);
        setStatus("resolved");
      }
    }
  };

  const handleGetTopRatedMovies = async () => {
    router.pathname === "/favourites" && router.push("/");
    setSearching(false);
    setStatus("pending");
    const topRatedMovies = await getPopularOrTopRatedMovies(1, "top_rated");
    if (topRatedMovies) {
      setNoSearchResult(false);
      if (secondSortByFilter) {
        setSecondSortByFilter(false);
        setStatus("resolved");
        return topRatedMovies;
      } else {
        // movies are reset to empty to allow for animation
        setMovies([]);
        setDataTitle("Top Rated");
        setMovies(topRatedMovies);
        setSecondSortByFilter(false);
        setStatus("resolved");
      }
    }
  };

  const handleYearFilter = () => {
    // Sorts the movies from newest - oldest when you sort by Year
    // movies are reset to empty to allow for animation
    setStatus("pending");
    setMovies([]);
    const moviesClone = [...movies];
    const filteredMovies = moviesClone
      .sort((a, b) => {
        return (
          a.release_date.substring(0, [4]) - b.release_date.substring(0, [4])
        );
      })
      .reverse();

    setMovies(filteredMovies);
    setSecondSortByFilter(true);
    setStatus("resolved");
  };

  const handleTitleFilter = () => {
    // Sorts the movies in alphabetical order from a - z
    setStatus("pending");
    setMovies([]);
    const moviesClone = [...movies];
    const filteredMovies = moviesClone.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    // movies are reset to empty to allow for animation

    setMovies(filteredMovies);
    setSecondSortByFilter(true);
    setStatus("resolved");
  };

  const handleRatingFilter = () => {
    // Sorts the movies from highest rating - lowest rating when you sort by Rating
    setStatus("pending");
    setMovies([]);
    const moviesClone = [...movies];

    const filteredMovies = moviesClone
      .sort((a, b) => {
        return a.vote_average - b.vote_average;
      })
      .reverse();
    // movies are reset to empty to allow for animation

    setMovies(filteredMovies);
    setSecondSortByFilter(true);
    setStatus("resolved");
  };

  // ------------------------ Movie Item ------------------------ //

  const handleSelectedMovie = (selectedMovie) => {
    const relatedGenres = handleSelectedMovieReleatedGenres(selectedMovie);
    selectedMovie.relatedGenres = relatedGenres;
    selectedMovie.release_date = selectedMovie.release_date.substring(0, [4]);
    localStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
  };

  const handleFavouriteSelected = (favMovie) => {
    const favMovies = localStorage.getItem("favouriteMovies")
      ? JSON.parse(localStorage.getItem("favouriteMovies"))
      : [];
    let addFavMovie = false;
    if (isArrayEmpty(favMovies)) {
      const deletedMovieFromFavMovies = favMovies.map((movie) => {
        if (movie.id === favMovie.id) {
          addFavMovie = true;
          // delete movie;
        }
      });
      if (addFavMovie) {
        // const  moviesClone.find((m) => m.id === selectedMovie.id)
        const updatedFavMovies = [...favMovies, favMovie];
        localStorage.setItem(
          "favouriteMovies",
          JSON.stringify(updatedFavMovies)
        );
      } else {
        localStorage.setItem(
          "favouriteMovies",
          JSON.stringify(deletedMovieFromFavMovies)
        );
      }
    } else {
      localStorage.setItem("favouriteMovies", JSON.stringify([favMovie]));
    }
  };

  // ------------------------ Movie Page ------------------------ //

  const handleSelectedMovieReleatedGenres = (selectedMovie) => {
    const selectedMovieGenreIds = selectedMovie.genre_ids;

    const relatedGenres = [];
    genres.map((genre) => {
      selectedMovieGenreIds.map((id) =>
        id === genre.id ? relatedGenres.push(genre.name.toLowerCase()) : ""
      );
    });

    return relatedGenres;
  };

  // ------------------------ Search ------------------------ //

  const handleSearch = async (query) => {
    setSearching(true);
    router.pathname !== "/" && router.push("/");
    // used to display a message saying 'no movies found' for a search result instead of a loading spinner
    if (router.pathname === "/favourites") {
      handleFavouritesSearch(query);
    } else {
      setStatus("pending");
      const response = await textSearchMovies(query);
      if (isArrayEmpty(response)) {
        setNoSearchResult(false);
        setMovies([]);
        console.log("search result", response);
        setMovies(response);
        setStatus("resolved");
      } else {
        setNoSearchResult(true);
      }
    }
  };

  const handleFavouritesSearch = (query) => {
    if (localStorage.getItem("favouriteMovies")) {
      const favMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
      if (isArrayEmpty(favMovies)) {
        const cleanQuery = query.toLowerCase().trim();

        const searchedFavMovies = favMovies.filter((movie) => {
          return (
            movie.toLowerCase().startsWith(cleanQuery) ||
            movie.toLowerCase().includes(cleanQuery)
          );
        });
        setFavourites(searchedFavMovies);
      }
    }
  };

  // ------------------------ Infinite Scroll ------------------------ //

  const handleGetMoreMovies = async (page) => {
    if (status !== "pending") {
      console.log("you're at the bottom of the page");
      setStatus("pending");

      const response = await getTrendingMovies(page);

      if (response) {
        setMovies([...movies, ...response]);
        // setPage(page + 1);

        setStatus("resolved");
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        genres,
        movies,
        handleSelectedMovie,
        handleFavouriteSelected,
        status,
        handleGetMoreMovies,
        noSearchResult,
      }}
    >
      <Container ref={ref}>
        <Header
          genres={genres}
          handleSearch={handleSearch}
          handleSelectedSortBy={handleSelectedSortBy}
          handleSelectedGenre={handleSelectedGenre}
          searching={searching}
        />
        <CompenentMargin>
          <GlobalStyle />
          <ThemeProvider theme={theme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </CompenentMargin>
      </Container>
    </AppContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const pageProps = await App.getInitialProps(appContext);

  const genres = await getGenres();
  const allGenres = [{ id: null, name: "All" }, ...genres.data.genres];

  const allTrendingMovies = await getTrendingMovies(1);

  return { ...pageProps, allTrendingMovies, allGenres };
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const CompenentMargin = styled.div`
  margin-top: 90px;
  @media (max-width: 632px) {
    margin-top: 76px;
  }
`;
