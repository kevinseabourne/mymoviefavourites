import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { isArrayEmpty } from "../utils/isEmpty";
import MovieItem from "./movieItem.js";
import { LoadingSpinner } from "./loadingSpinner";

const Movies = ({ movies }) => {
  const ref = useRef(null);
  const loadingSpinnerRef = useRef(null);

  return isArrayEmpty(movies) ? (
    <Container ref={ref}>
      <MoviesContainer>
        {movies.map((movie, index) => (
          <MovieItem movie={movie} key={index} />
        ))}
      </MoviesContainer>
    </Container>
  ) : (
    <LoadingSpinner ref={loadingSpinnerRef} />
  );
};

export default Movies;

const Container = styled.div`
  width: 100%;
  height: 2000px;
`;

const MoviesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 202px);
  justify-content: space-between;
  align-items: flex-start;
  grid-auto-flow: row;
  grid-column-end: auto;
  grid-gap: calc(100vw * 0.02) 2%;
  margin-top: 14px;
  padding: 0px 15px;
`;
