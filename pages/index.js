import { useContext } from "react";
import Movies from "../components/common/movies";
import AppContext from "../context/appContext";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

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
