import App from "next/app";
import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import { useRouter } from "next/router";
import AppContext from "../context/appContext";
import { getGenres } from "./api/genres";
import { getMovies, getTrendingMovies, textSearchMovies } from "./api/movies";
import logger from "../pages/api/logger";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalStyle } from "../globalStyle";
import styled, { ThemeProvider } from "styled-components";
import { isArrayEmpty } from "../components/common/utils/isEmpty";
import { removeDuplicateObjectFromArray } from "../components/common/utils/removeDupObjs";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

logger.init();

export default function MyApp({
  Component,
  pageProps,
  allGenres,
  allTrendingMovies,
}) {
  const { push, pathname } = useRouter();
  const ref = useRef(null);
  const [status, setStatus] = useState("idle");
  const [movies, setMovies] = useState([]);
  const [initialSearchResultMovies, setInitialSearchResultMovies] = useState(
    []
  );

  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const [initialFavouriteMovies, setinitialFavouriteMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState({ id: null, name: "All" });
  const [selectedSortBy, setSelectedSortBy] = useState({
    query: "",
    title: "Trending",
  });
  const [searching, setSearching] = useState(false);
  const [noSearchResult, setNoSearchResult] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [favouriteGenreChange, setFavouriteGenreChange] = useState(false);
  const timeout = useRef(null);

  useEffect(() => {
    const lsFavouriteMovies = window.localStorage.getItem("favouriteMovies");

    if (lsFavouriteMovies) {
      const favMovies = JSON.parse(lsFavouriteMovies);

      setFavouriteMovies(favMovies);
      setinitialFavouriteMovies(favMovies);
    }

    if (allGenres && allTrendingMovies) {
      const removeDocumentaries = allGenres.filter(
        (genre) => genre.name !== "Documentary"
      );
      const updatedGenres = [{ id: null, name: "All" }, ...removeDocumentaries];

      setGenres(updatedGenres);

      setMovies(allTrendingMovies);
    } else {
      toast.error("An unexpected error has occurred", {
        position: "bottom-right",
      });
    }

    () => clearTimeout(timeout);
  }, []);

  // handle infiniteScroll request, fetch more data when the page changes
  useEffect(() => {
    if (page > 1 && infiniteScroll) {
      handleGetMovies(selectedGenre, selectedSortBy);
    }
  }, [page]);

  useEffect(() => {
    // reset infinite scroll when you are not on either the home page or movie page.
    if (pathname !== "/" && pathname !== "/[id]" && infiniteScroll) {
      resetInfiniteScroll();
    }
  }, [pathname]);

  // When favourite movies is updated after changing the order of movies with the drag feature
  // the movies order is then saved in localStorage to preserve the order

  useEffect(() => {
    if (
      pathname === "/favourites" &&
      selectedGenre.name === "All" &&
      selectedSortBy.title === "Order" &&
      !searching
    ) {
      localStorage.setItem("favouriteMovies", JSON.stringify(favouriteMovies));
    }
  }, [favouriteMovies]);

  // ⚡️  Handle sortBy selected after genre change ⚡️  //
  // On the favourites page when a genre is selected filter the favourite movies to only show those movies
  // if a sort by is selected which is either 'Top Rated', 'Title' or 'Year' then wait for the genre filtered movies to be
  // updated then filter those movies based on the selected sortBy.

  useEffect(() => {
    if (pathname === "/favourites" && favouriteGenreChange) {
      if (
        selectedSortBy.title === "Top Rated" ||
        selectedSortBy.title === "Year" ||
        selectedSortBy.title === "Title"
      ) {
        setFavouriteGenreChange(false);
        handleSelectedSortBy(selectedSortBy);
      }
    } else if (pathname === "/favourites") {
      setFavouriteGenreChange(false);
    }
  }, [favouriteMovies]);

  // ⚡️ Favourites Feature ⚡️ //
  // This condition is used for the genre and sortBy filters when they are used on the favourites page
  // When a genre or sortBy is selected then you visit the movie content page this property is truthy
  // and then when you go back to the favourites page, prevents the genre and sortBy from resetting.

  useEffect(() => {
    pathname === "/favourites/[id]"
      ? localStorage.setItem("movieContentPage", JSON.stringify(pathname))
      : localStorage.setItem("movieContentPage", JSON.stringify(false));
  }, [pathname]);

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

      pathname !== "/" && push("/");
    }
    if (
      selectedGenre.name === "All" &&
      newSelectedSortBy.title === "Trending"
    ) {
      response = await getTrendingMovies(page);
    } else {
      // if infinite scroll is true and you are trying to select a different genre or sortBy then reset the page count and infinite scroll
      if (
        (infiniteScroll && newSelectedGenre.name !== selectedGenre.name) ||
        (infiniteScroll && newSelectedSortBy.title !== selectedSortBy.title)
      ) {
        const genreId = handleGenreId(newSelectedGenre);
        const sortByQuery = handleSortBy(newSelectedSortBy);
        resetInfiniteScroll();
        response = await getMovies(1, genreId, sortByQuery);
      } else {
        const genreId = handleGenreId(newSelectedGenre);
        const sortByQuery = handleSortBy(newSelectedSortBy);
        response = await getMovies(page, genreId, sortByQuery);
      }
    }
    if (response) {
      if (
        infiniteScroll &&
        newSelectedGenre.name === selectedGenre.name &&
        newSelectedSortBy.title === selectedSortBy.title
      ) {
        const addedMovies = [...movies, ...response];
        const removedDupMovies = removeDuplicateObjectFromArray(
          addedMovies,
          "id"
        );

        setMovies(removedDupMovies);
      } else {
        setMovies([]);
        setMovies(response);
      }
      setStatus("resolved");
    } else {
      toast.error("An unexpected error has occurred", {
        position: "bottom-right",
      });
    }
  };

  // ------------------------ Search Results Filtering & Favourites Filtering ------------------------ //

  const handleGenreFilter = (newSelectedGenre) => {
    infiniteScroll && resetInfiniteScroll();
    setSelectedGenre(newSelectedGenre);

    if (newSelectedGenre.name !== "All") {
      const array =
        pathname === "/favourites" || pathname === "/favourites/[id]"
          ? initialFavouriteMovies
          : initialSearchResultMovies;

      // To prevent the movies data from being filtered over and over I stored the inital search results in a seperate state to use for every genre filter.
      const filteredMovies = array.filter((m) => {
        const genreIdsClone = [...m.genre_ids];
        const answer = genreIdsClone.find((id) => id === newSelectedGenre.id);
        return answer;
      });

      // if you filter the movies and there are no movies that match, then instead of showing a loading spinner it show's a message saying no movies
      isArrayEmpty(filteredMovies)
        ? setNoSearchResult(false)
        : setNoSearchResult(true);

      if (pathname === "/favourites" || pathname === "/favourites/[id]") {
        // movies are reset to empty to allow for animation
        setFavouriteMovies([]);
        const finalFavMovies = searching
          ? handleSearchFilter(filteredMovies, searchQuery)
          : filteredMovies;

        // this is to indicate that a new genre is being selected on the favourites page and once the favourite movies have
        // been updated useEffect will catch that update and if the sortBy is either 'Year', 'Top Rated' or 'Title' then filter the movies
        // based on that parameter.
        setFavouriteGenreChange(true);

        setFavouriteMovies(finalFavMovies);
      } else {
        setMovies([]);
        const finalMovies = searching
          ? handleSearchFilter(filteredMovies, searchQuery)
          : filteredMovies;
        setMovies(finalMovies);
      }
    } else if (pathname === "/favourites" || pathname === "/favourites/[id]") {
      setFavouriteMovies([]);
      const finalFavMovies = searching
        ? handleSearchFilter(initialFavouriteMovies, searchQuery)
        : initialFavouriteMovies;

      // this is to indicate that a new genre is being selected on the favourites page and once the favourite movies have
      // been updated useEffect will catch that update and if the sortBy is either 'Year', 'Top Rated' or 'Title' then filter the movies
      // based on that parameter.
      setFavouriteGenreChange(true);

      setFavouriteMovies(finalFavMovies);
    } else {
      // reset search results to initial search results
      if (isArrayEmpty(initialSearchResultMovies)) {
        setMovies([]);
        const finalMovies = searching
          ? handleSearchFilter(initialSearchResultMovies, searchQuery)
          : initialSearchResultMovies;

        setMovies(finalMovies);
      }
      // reset any filtered favourites to show all favourites
      setFavouriteMovies(initialFavouriteMovies);
    }
  };

  const handleSelectedSortBy = (newSelectedSortBy) => {
    infiniteScroll && resetInfiniteScroll();
    setSelectedSortBy(newSelectedSortBy);
    switch (newSelectedSortBy.title) {
      case "Trending":
        handleGetMovies(selectedGenre, newSelectedSortBy);
        break;
      case "Popular":
        handleGetMovies(selectedGenre, newSelectedSortBy);
        break;
      case "Top Rated":
        handleTopRatedFilter();
        break;
      case "Year":
        handleYearFilter();
        break;
      case "Title":
        handleTitleFilter();
        break;
      case "Order":
        handleOrderFilter();
        break;

      default:
    }
  };

  const handleTopRatedFilter = () => {
    // Sorts the movies based on the movie rating in descending order.
    const favouritesRoute =
      pathname === "/favourites" || pathname === "/favourites/[id]";

    const moviesClone = favouritesRoute ? [...favouriteMovies] : [...movies];

    const filteredMovies = moviesClone
      .sort((a, b) => {
        return a.vote_average - b.vote_average;
      })
      .reverse();

    // movies are reset to empty to allow for animation
    if (favouritesRoute) {
      setFavouriteMovies([]);
      setFavouriteMovies(filteredMovies);
    } else {
      setMovies([]);
      setMovies(filteredMovies);
    }
  };

  const handleYearFilter = () => {
    // Sorts the movies from newest - oldest when you sort by Year
    const favouritesRoute =
      pathname === "/favourites" || pathname === "/favourites/[id]";
    const moviesClone = favouritesRoute ? [...favouriteMovies] : [...movies];
    const filteredMovies = moviesClone
      .sort((a, b) => {
        return (
          a.release_date.substring(0, [4]) - b.release_date.substring(0, [4])
        );
      })
      .reverse();
    // movies are reset to empty to allow for animation
    if (favouritesRoute) {
      setFavouriteMovies([]);
      setFavouriteMovies(filteredMovies);
    } else {
      setMovies([]);
      setMovies(filteredMovies);
    }
  };

  const handleTitleFilter = () => {
    // Sorts the movies in alphabetical order from a - z
    const favouritesRoute =
      pathname === "/favourites" || pathname === "/favourites/[id]";

    const moviesClone = favouritesRoute ? [...favouriteMovies] : [...movies];

    const filteredMovies = titleFilter(moviesClone);

    // movies are reset to empty to allow for animation
    if (favouritesRoute) {
      setFavouriteMovies([]);
      setFavouriteMovies(filteredMovies);
    } else {
      setMovies([]);
      setMovies(filteredMovies);
    }
  };

  const titleFilter = (array) => {
    const filteredArray = array.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
    return filteredArray;
  };

  const handleOrderFilter = () => {
    const lsFavouriteMovies = window.localStorage.getItem("favouriteMovies");

    if (lsFavouriteMovies) {
      const favMovies = JSON.parse(lsFavouriteMovies);

      setFavouriteMovies(favMovies);
      if (selectedGenre.name === "All" && selectedSortBy.title === "Order") {
        setinitialFavouriteMovies(favMovies);
      }
    }
  };

  // ------------------------ Movie Item ------------------------ //

  const handleSelectedMovie = (selectedMovie) => {
    const relatedGenres = handleSelectedMovieReleatedGenres(selectedMovie);
    selectedMovie.relatedGenres = relatedGenres;
    selectedMovie.release_date = selectedMovie.release_date.substring(0, [4]);
    localStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
  };

  // ------------------------ Favouriting Movies ------------------------ //

  const handleFavouriteSelected = (favMovie, favourited) => {
    if (isArrayEmpty(favouriteMovies)) {
      if (!favourited && favouriteMovies.length <= 300) {
        // add - limit of 300 favourited movies
        const updatedFavMovies = [...favouriteMovies, favMovie];
        setFavouriteMovies(updatedFavMovies);
        setinitialFavouriteMovies(updatedFavMovies);
        localStorage.setItem(
          "favouriteMovies",
          JSON.stringify(updatedFavMovies)
        );
      } else {
        // delete
        const deletedMovieFromFavMovies = favouriteMovies.filter((movie) => {
          return movie.id !== favMovie.id;
        });

        setFavouriteMovies(deletedMovieFromFavMovies);
        setinitialFavouriteMovies(deletedMovieFromFavMovies);
        localStorage.setItem(
          "favouriteMovies",
          JSON.stringify(deletedMovieFromFavMovies)
        );
      }
    } else {
      // first movie added to favourites
      setFavouriteMovies([favMovie]);
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
    infiniteScroll && resetInfiniteScroll();
    setSearching(true);
    setSearchQuery(query);
    pathname !== "/" && pathname !== "/favourites" && push("/");
    if (pathname === "/favourites") {
      handleFavouritesSearch(query);
    } else {
      setStatus("pending");
      const { searchResults, status } = await textSearchMovies(query);

      if (isArrayEmpty(searchResults)) {
        setNoSearchResult(false);
        // search results are by default sorted by title
        const filteredMovies = titleFilter(searchResults);
        setMovies([]);
        setMovies(filteredMovies);
        setInitialSearchResultMovies(filteredMovies);
        setStatus("resolved");
      } else {
        // used to display a message saying 'no movies found' for a search result instead of a loading spinner
        setNoSearchResult(true);
      }
      status !== 200 &&
        toast.error("An unexpected error has occurred", {
          position: "bottom-right",
        });
    }
  };

  const handleFavouritesSearch = (query) => {
    if (isArrayEmpty(initialFavouriteMovies)) {
      const searchedFavMovies = handleSearchFilter(
        initialFavouriteMovies,
        query
      );

      setFavouriteMovies(searchedFavMovies);
    }
  };

  const handleSearchFilter = (array, query) => {
    // search results seperated
    const cleanQuery = query.toLowerCase().trim();
    const searchResults = array.filter((movie) => {
      return (
        movie.title.toLowerCase().startsWith(cleanQuery) ||
        movie.title.toLowerCase().includes(cleanQuery)
      );
    });
    return searchResults;
  };

  const clearSearchResults = (newSelectedGenre, newSelectedSortyBy) => {
    if (searching) {
      if (pathname === "/favourites") {
        setFavouriteMovies(initialFavouriteMovies);
      } else if (pathname === "/") {
        handleGetMovies(newSelectedGenre, newSelectedSortyBy);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearching(false);
    setFavouriteMovies(initialFavouriteMovies);
  };

  const handleSearching = () => {
    setSearching(false);
  };

  // ------------------------ Infinite Scroll ------------------------ //

  const incrementPage = () => {
    // boolean value for infinite scroll to prevent movies from animating out when data is loading
    !infiniteScroll && setInfiniteScroll(true);
    setPage(page + 3);
  };

  const resetInfiniteScroll = () => {
    setInfiniteScroll(false);
    setPage(1);
  };

  return (
    <AppContext.Provider
      value={{
        genres,
        movies,
        handleSelectedMovie,
        handleFavouriteSelected,
        status,
        infiniteScroll,
        noSearchResult,
        searching,
        favouriteMovies,
        setFavouriteMovies,
        incrementPage,
        selectedGenre,
        selectedSortBy,
      }}
    >
      <Container ref={ref}>
        <ToastContainer />
        <Header
          genres={genres}
          handleSearch={handleSearch}
          handleGetMovies={handleGetMovies}
          handleGenreFilter={handleGenreFilter}
          handleSelectedSortBy={handleSelectedSortBy}
          searching={searching}
          handleSearching={handleSearching}
          clearSearchResults={clearSearchResults}
          clearSearch={clearSearch}
        />
        <CompenentMargin id="main">
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
  const allGenres = genres.data.genres;

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
