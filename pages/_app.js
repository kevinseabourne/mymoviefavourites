import { useState, useEffect, useRef } from "react";
import Header from "../components/header";
import AppContext from "../context/appContext";
import { getGenres } from "./api/genres";
import { getTrendingMovies } from "./api/movies";
import { GlobalStyle } from "../globalStyle";
import { ThemeProvider } from "styled-components";

const theme = {
  colors: {
    primary: "#0070f3",
  },
};

export default function App({ Component, pageProps }) {
  const ref = useRef(null);
  const [status, setStatus] = useState("idle");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const { data: genreData } = await getGenres();
      const allGenres = [{ id: "", name: "All" }, ...genreData.genres];
      setGenres(allGenres);
      const response = await getTrendingMovies(page);
      setMovies(response);
    };
    fetchData();
  }, []);

  useEffect(() => {
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

  return (
    <AppContext.Provider value={{ movies, handleSelectedMovie }}>
      <div ref={ref}>
        <Header />
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Component {...pageProps} />
        </ThemeProvider>
      </div>
    </AppContext.Provider>
  );
}
