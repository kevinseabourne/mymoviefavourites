import { useState, useEffect, useContext } from "react";
import AppContext from "../context/appContext";
import { isArrayEmpty } from "../components/common/utils/isEmpty";
import Movies from "../components/common/movies";
import styled from "styled-components";

const Favourites = () => {
  const { movies, status } = useContext(AppContext);

  return (
    <Container>
      {isArrayEmpty(movies) ? (
        <Movies movies={movies} />
      ) : (
        <TitleContainer>
          <Title>No Favourite Movies...</Title>
          <SubTitle>Go find them !</SubTitle>
        </TitleContainer>
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
  margin-top: 60px;
`;

const SubTitle = styled.h2`
  margin-top: 5px;
`;
