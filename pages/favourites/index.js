import { useState, useRef, useContext, useEffect } from "react";
import AppContext from "../../context/appContext";
import { isArrayEmpty } from "../../components/common/utils/isEmpty";
import Movies from "../../components/common/movies";
import DynamicHead from "../../components/common/dynamicHead";
import styled from "styled-components";
import { LoadingSpinner } from "../../components/common/loadingSpinner";

const Favourites = () => {
  const { status, favouriteMovies, selectedGenre } = useContext(AppContext);

  const loadingSpinnerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Container>
      <DynamicHead title="My Movie Favs | Favourites" urlQuery="/" />
      {isArrayEmpty(favouriteMovies) ? (
        <Movies
          movies={favouriteMovies}
          favouriteMovies={favouriteMovies}
          status={status}
        />
      ) : isMounted ? (
        <TitleContainer>
          <Title>
            {selectedGenre.name === "All"
              ? "No favourite movies..."
              : "No movies match this genre..."}
          </Title>
        </TitleContainer>
      ) : (
        <LoadingSpinner ref={loadingSpinnerRef} />
      )}
    </Container>
  );
};

export default Favourites;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin-top: 80px;
  text-align: center;
`;
