import App from "next/app";
import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import AppContext from "../context/appContext";
import { getGenres } from "./api/genres";
import { getTrendingMovies } from "./api/movies";
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
  const ref = useRef(null);
  const [status, setStatus] = useState("idle");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setGenres(allGenres);
    setMovies(allTrendingMovies);
    window.addEventListener("scroll", getMoreMovies);
    return () => window.removeEventListener("scroll", getMoreMovies);
  }, []);

  const getMoreMovies = async () => {
    if (
      window.scrollY + window.innerHeight >= ref.current.offsetHeight &&
      status !== "pending"
    ) {
      console.log("you're at the bottom of the page");
      // Show loading spinner and make fetch request to api
      setStatus("pending");
      const response = await getTrendingMovies(page + 1);
      setPage(page + 1);
      if (response) {
        setMovies([...movies, ...response]);
        setStatus("resolved");
      }
    }
  };

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

  const handleSelectedMovie = (selectedMovie) => {
    const relatedGenres = handleSelectedMovieReleatedGenres(selectedMovie);
    selectedMovie.relatedGenres = relatedGenres;
    selectedMovie.release_date = selectedMovie.release_date.substring(0, [4]);
    localStorage.setItem("selectedMovie", JSON.stringify(selectedMovie));
  };

  const handleFavouriteSelected = (favMovie) => {
    const favMovies = localStorage.getItem("favouriteMovies")
      ? JSON.parse(localStorage.getItem("selectedMovie"))
      : [];
    let addFavMovie = false;
    if (isArrayEmpty(favMovie)) {
      const deletedMovieFromFavMovies = favMovies.map((movie) => {
        if (movie.id === favMovie.id) {
          addFavMovie = true;
          // delete movie;
        }
      });
      if (addFavMovie) {
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
    }
  };

  return (
    <AppContext.Provider
      value={{ genres, movies, handleSelectedMovie, handleFavouriteSelected }}
    >
      <Container ref={ref}>
        <Header />
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
  const allGenres = [{ id: "", name: "All" }, ...genres.data.genres];

  const allTrendingMovies = await getTrendingMovies(1);

  return { ...pageProps, allGenres, allTrendingMovies };
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
