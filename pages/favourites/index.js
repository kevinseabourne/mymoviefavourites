import { useState, useRef, useContext, useEffect } from "react";
import AppContext from "../../context/appContext";
import { isArrayEmpty } from "../../components/common/utils/isEmpty";
import Movies from "../../components/common/movies";
import DynamicHead from "../../components/common/dynamicHead";
import styled from "styled-components";
import { LoadingSpinner } from "../../components/common/loadingSpinner";

const Favourites = () => {
  const {
    status,
    favouriteMovies,
    setFavouriteMovies,
    selectedGenre,
    updatedFavouritesWithLocalStorage,
  } = useContext(AppContext);

  const loadingSpinnerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    updatedFavouritesWithLocalStorage();
  }, []);

  return (
    <Container>
      <DynamicHead title="My Movie Favs | Favourites" urlQuery="/favourites" />
      {isArrayEmpty(favouriteMovies) && favouriteMovies.length === 300 && (
        <Title>You have reaching your limit of 300 favourited movies</Title>
      )}
      {isArrayEmpty(favouriteMovies) ? (
        <Movies
          movies={favouriteMovies}
          favouriteMovies={favouriteMovies}
          setFavouriteMovies={setFavouriteMovies}
          status={status}
        />
      ) : isMounted &&
        !isArrayEmpty(favouriteMovies) &&
        status !== "pending" ? (
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
