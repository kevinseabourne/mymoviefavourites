import { useContext } from "react";
import DynamicHead from "../components/common/dynamicHead";
import Movies from "../components/common/movies";
import AppContext from "../context/appContext";
import styled from "styled-components";

export default function Home() {
  const {
    movies,
    status,
    handleGetMoreMovies,
    noSearchResult,
    favouriteMovies,
    incrementPage,
    searching,
    infiniteScroll,
  } = useContext(AppContext);
  return (
    <Container>
      <DynamicHead title="My Movie Favs" urlQuery="/" />
      <Movies
        movies={movies}
        status={status}
        noSearchResult={noSearchResult}
        handleGetMoreMovies={handleGetMoreMovies}
        favouriteMovies={favouriteMovies}
        incrementPage={incrementPage}
        searching={searching}
        infiniteScroll={infiniteScroll}
      />
    </Container>
  );
}

const Container = styled.div``;
