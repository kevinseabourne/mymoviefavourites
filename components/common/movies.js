import { useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { isArrayEmpty } from "./utils/isEmpty";
import MovieItem from "./movieItem.js";
import { LoadingSpinner } from "./loadingSpinner";

const Movies = ({ movies }) => {
  const ref = useRef(null);
  const loadingSpinnerRef = useRef(null);

  const moviesAnimation = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.17,
      },
    },
  };

  return isArrayEmpty(movies) ? (
    <Container ref={ref}>
      <MoviesContainer
        variants={moviesAnimation}
        initial="hidden"
        animate="show"
      >
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

const MoviesContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, 202px);
  justify-content: space-between;
  align-items: flex-start;
  grid-auto-flow: row;
  grid-column-end: auto;
  grid-gap: calc(100vw * 0.005) 2%;
  margin-top: 14px;
  padding: 0px 15px;
  @media (max-width: 2600px) {
    grid-gap: calc(100vw * 0.01) 2%;
  }
  @media (max-width: 1600px) {
    grid-gap: calc(100vw * 0.02) 2%;
  }
  @media (max-width: 662px) {
    justify-content: space-around;
  }
  @media (max-width: 465px) {
    grid-template-columns: repeat(1, minmax(50px, 1fr));
    grid-gap: calc(100vw * 0.02) 0px;
  }
`;
