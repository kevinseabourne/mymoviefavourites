import App from "next/app";
import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { useRouter } from "next/router";
import AppContext from "../context/appContext";
import { getGenres } from "./api/genres";
import { getMovies, getTrendingMovies, textSearchMovies } from "./api/movies";
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
  const [movies, setMovies] = useState([]);
  const [initialSearchResultMovies, setInitialSearchResultMovies] = useState(
    []
  );

  const [favouriteMovies] = useState(() => {
    const lsFavouriteMovies =
      typeof window !== "undefined"
        ? window.localStorage.getItem("favouriteMovies")
        : null;
    return lsFavouriteMovies !== null ? JSON.parse(lsFavouriteMovies) : [];
  });
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState({ id: null, name: "All" });
  const [selectedSortBy, setSelectedSortBy] = useState({
    query: "",
    title: "Trending",
  });
  const [searching, setSearching] = useState(false);
  const [noSearchResult, setNoSearchResult] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setGenres(allGenres);
    setMovies(allTrendingMovies);

    // window.addEventListener("scroll", getMoreMovies);
    // return () => window.removeEventListener("scroll", getMoreMovies);
  }, []);

  // ------------------------ Genre Filter & Sort By ------------------------ //

  const handleGenreId = (newSelectedGenre) => {
    let genreId = "";
    if (newSelectedGenre) {
      setSelectedGenre(newSelectedGenre);
      if (newSelectedGenre.name === "All") {
        genreId = null;
      } else {
        genreId = newSelectedGenre.id;
      }
    } else {
      if (newSelectedGenre.name === "All") {
        genreId = null;
      } else {
        genreId = selectedGenre.id;
      }
    }
    return genreId;
  };

  const handleSortBy = (newSelectedSortBy) => {
    let sortBy = "";
    if (newSelectedSortBy) {
      setSelectedSortBy(newSelectedSortBy);
      sortBy = newSelectedSortBy.query;
    } else {
      sortBy = selectedSortBy.query;
    }
    return sortBy;
  };

  const handleGetMovies = async (newSelectedGenre, newSelectedSortBy) => {
    setStatus("pending");
    let response = [];
    if (
      newSelectedSortBy.title === "Trending" ||
      newSelectedSortBy.title === "Popular"
    ) {
      setSearching(false);
      setNoSearchResult(false);

      router.pathname !== "/" && router.push("/");
    }
    // when a genre is selected in search results of favourites then you return to home it is not
    // resetting the genre to all
    if (
      selectedGenre.name === "All" &&
      newSelectedSortBy.title === "Trending"
    ) {
      response = await getTrendingMovies(page);
    } else {
      const genreId = handleGenreId(newSelectedGenre);
      const sortByQuery = handleSortBy(newSelectedSortBy);
      response = await getMovies(page, genreId, sortByQuery);
    }
    if (response) {
      setMovies([]);
      setMovies(response);
      setStatus("resolved");
    }
  };

  // ------------------------ Search Results Filtering & Favourites Filtering ------------------------ //

  const handleGenreFilter = (newSelectedGenre) => {
    setSelectedGenre(newSelectedGenre);

    if (newSelectedGenre.name !== "All") {
      const array =
        router.pathname === "/favourites"
          ? favouriteMovies
          : initialSearchResultMovies;

      // Prevent the movies data from being filtered over and over I stored the inital search results in a seperate state to use for every genre filter.
      const filteredMovies = array.filter((m) => {
        const genreIdsClone = [...m.genre_ids];
        const answer = genreIdsClone.find((id) => id === newSelectedGenre.id);
        return answer;
      });
      // if you filter the movies and there are no movies that match then instead of showing a loading spinner is show a message saying no movies
      isArrayEmpty(filteredMovies)
        ? setNoSearchResult(false)
        : setNoSearchResult(true);
      // movies are reset to empty to allow for animation
      setMovies([]);
      setMovies(filteredMovies);
    } else {
      setMovies([]);
      setMovies(initialSearchResultMovies);
    }
  };

  const handleSelectedSortBy = (newSelectedSortBy) => {
    setSelectedSortBy(newSelectedSortBy);
    switch (newSelectedSortBy.title) {
      case "Top Rated":
        handleTopRatedFilter();
        break;
      case "Year":
        handleYearFilter();
        break;
      case "Title":
        handleTitleFilter();
        break;

      default:
    }
  };

  const handleTopRatedFilter = () => {
    // Sorts the favourite movies and movies from search results based on the movie rating in descending order.
    const moviesClone = [...movies];

    const filteredMovies = moviesClone
      .sort((a, b) => {
        return a.vote_average - b.vote_average;
      })
      .reverse();

    // movies are reset to empty to allow for animation
    setMovies([]);
    setMovies(filteredMovies);
  };

  const handleYearFilter = () => {
    // Sorts the favourite movies from newest - oldest when you sort by Year
    const moviesClone = [...movies];
    const filteredMovies = moviesClone
      .sort((a, b) => {
        return (
          a.release_date.substring(0, [4]) - b.release_date.substring(0, [4])
        );
      })
      .reverse();
    // movies are reset to empty to allow for animation
    setMovies([]);
    setMovies(filteredMovies);
  };

  const handleTitleFilter = () => {
    // Sorts the favourite movies and movies from search results in alphabetical order from a - z
    const moviesClone = [...movies];
    const filteredMovies = moviesClone.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });

    // movies are reset to empty to allow for animation
    setMovies([]);
    setMovies(filteredMovies);
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
    if (isArrayEmpty(favMovies)) {
      const deletedMovieFromFavMovies = favMovies.filter((movie) => {
        return movie.id !== favMovie.id;
      });
      if (favMovies.length === deletedMovieFromFavMovies.length) {
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
        setMovies(response);
        setInitialSearchResultMovies(response);
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
        setMovies(searchedFavMovies);
      }
    }
  };

  const handleSearching = () => {
    setSearching(false);
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
          handleGetMovies={handleGetMovies}
          handleGenreFilter={handleGenreFilter}
          handleSelectedSortBy={handleSelectedSortBy}
          searching={searching}
          handleSearching={handleSearching}
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
