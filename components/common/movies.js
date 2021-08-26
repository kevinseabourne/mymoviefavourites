import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { isArrayEmpty } from "./utils/isEmpty";
import MovieItem from "./movieItem.js";
import { LoadingSpinner } from "./loadingSpinner";
import { useInView } from "react-intersection-observer";
import "intersection-observer";

const Movies = ({
  movies,
  status,
  noSearchResult,
  searching,
  infiniteScroll,
  favouriteMovies,
  incrementPage,
}) => {
  const { pathname } = useRouter();
  const loadingSpinnerRef = useRef(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { ref, inView } = useInView({
    rootMargin: "0px 0px",
  });

  useEffect(() => {
    // infinite Scroll
    if (inView && status !== "pending") {
      incrementPage();
    }
  }, [inView]);

  const moviesAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        type: "spring",
        staggerChildren: 0.1,
      },
    },
  };

  const loadingItemAnimation = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
      },
    },
  };

  const infiniteScrollCondition =
    animationComplete && !searching && pathname !== "/favourites";

  const renderCondition = infiniteScroll
    ? isArrayEmpty(movies)
    : status !== "pending" && isArrayEmpty(movies);

  return renderCondition ? (
    <Container>
      <MoviesContainer
        variants={moviesAnimation}
        initial="hidden"
        animate="show"
        onAnimationComplete={() => setAnimationComplete(true)}
      >
        {movies.map((movie, index) => (
          <MovieItem
            movie={movie}
            key={index}
            status={status}
            favouriteMovies={favouriteMovies}
          />
        ))}
        <AnimatePresence>
          {infiniteScrollCondition && (
            <LoadingItem
              ref={ref}
              variants={loadingItemAnimation}
              animate={inView ? "show" : "hidden"}
            >
              {inView && <LoadingSpinner ref={loadingSpinnerRef} />}
            </LoadingItem>
          )}
        </AnimatePresence>
      </MoviesContainer>
    </Container>
  ) : noSearchResult ? (
    <Title>Sorry no movies found</Title>
  ) : (
    <LoadingSpinner marginTop="220px" ref={loadingSpinnerRef} />
  );
};

export default Movies;

const Container = styled(motion.div)`
  width: 100%;
  height: 100%;
`;

const MoviesContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, 202px);
  justify-content: space-evenly;
  align-items: flex-start;
  grid-auto-flow: row;
  grid-column-end: auto;
  grid-gap: calc(100vw * 0.005) 1.5%;
  margin: 14px 0px;
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
    grid-template-columns: repeat(1, 100%);
    grid-gap: calc(100vw * 0.02) 0px;
  }
`;

const LoadingItem = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 202px;
  height: 309.75px;
  margin-bottom: 52px;
  border-radius: 10px;
  background-color: rgba(18, 18, 18, 0.7);
  box-shadow:   box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Title = styled(motion.h1)`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 80px;
  text-align: center;
`;
