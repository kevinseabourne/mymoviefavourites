import { useState, useEffect, useContext, useRef } from "react";
import AppContext from "../../context/appContext";
import styled from "styled-components";
import ImageLoader from "./imageLoader";
import Link from "next/link";
import { LoadingSpinner } from "./loadingSpinner";
import Router from "next/router";
import { motion } from "framer-motion";
import ReactStars from "react-rating-stars-component";

const MovieItem = ({ movie, status }) => {
  const { handleSelectedMovie, handleFavouriteSelected } = useContext(
    AppContext
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [movieInFavourites, setMovieInFavourites] = useState(false);
  const loadingSpinnerRef = useRef(null);

  const handleImageLoad = () => setImageLoaded(true);

  useEffect(() => {
    // if (localStorage.getItem("favouriteMovies")) {
    //   const favMovies = JSON.parse(localStorage.getItem("favouriteMovies"));
    //   const movieInFavourites = favMovies.find(
    //     (fMovie) => fMovie.id === movie.id
    //   );
    //   movieInFavourites
    //     ? setMovieInFavourites(true)
    //     : setMovieInFavourites(false);
    // }
  }, []);

  useEffect(() => {
    status === "pending" && setImageLoaded(false);
  }, [status]);

  const handleClick = (movie) => {
    handleSelectedMovie(movie);
    Router.push(
      "/[id]",
      movie.title.toLowerCase().replace(/[{L}!#$'"@`#*+)(:;{}\s]/g, "-")
    );
  };

  const itemAnimation = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    show: {
      opacity: 1,
      y: 0,
    },
  };

  const placeholderAnimation = {
    hover: {
      backgroundColor: "rgba(18, 18, 18, 0.7)",
      border: "3.4px solid #2d72d9",
      transition: {
        type: "spring",
        duration: 0.4,

        bounce: 0,
      },
    },
  };

  const hoverInfoAnimation = {
    hover: {
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.4,
      },
    },
  };

  const infoAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        type: "spring",
        delay: 0.3,
      },
    },
  };

  return (
    <Container variants={itemAnimation}>
      <ImageContainer
        onClick={() => handleClick(movie)}
        variants={placeholderAnimation}
        whileHover="hover"
        whileFocus="hover"
      >
        {!imageLoaded && (
          <LoadingSpinner marginTop="110px" ref={loadingSpinnerRef} />
        )}
        {imageLoaded && <BackgroundFade variants={hoverInfoAnimation} />}
        <FavouriteButton
          tabIndex="0"
          onClick={() => handleClick(movie)}
          variants={hoverInfoAnimation}
        >
          <HeartFilter movieInFavourites={movieInFavourites}>
            <ImageLoader
              src="/icons/heart_icon.svg"
              width="25px"
              placeholderSize="100%"
              hover={true}
            />
          </HeartFilter>
        </FavouriteButton>

        <ImageLoader
          key={movie.poster_path}
          src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
          width="202px"
          borderRadius="10px"
          placeholderSize="150%"
          opacity={0}
          handleOnLoadOutside={handleImageLoad}
        />
        <MovieRatingContainer variants={hoverInfoAnimation}>
          <ReactStars
            value={movie.vote_average / 2}
            count={5}
            isHalf={true}
            size={24}
            activeColor="#ffd700"
            color="#D1D5DB"
            edit={false}
          />
          <DecimalRating>{movie.vote_average}</DecimalRating>
        </MovieRatingContainer>
      </ImageContainer>
      <InfoContainer
        variants={infoAnimation}
        initial="hidden"
        animate={imageLoaded && status !== "pending" ? "show" : "hidden"}
      >
        <Title>{movie.title}</Title>
        <ReleaseDate>
          {movie.release_date ? movie.release_date.substring(0, [4]) : ""}
        </ReleaseDate>
      </InfoContainer>
    </Container>
  );
};

export default MovieItem;

const Container = styled(motion.div)`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled(motion.button)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: transparent;
  border: 3.4px solid transparent;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const BackgroundFade = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 10px;
  opacity: 0;
  background-color: rgba(18, 18, 18, 0.7);
`;

const HeartFilter = styled(motion.div)`
  transition: 0.3s ease;
  filter: ${({ movieInFavourites }) =>
    movieInFavourites
      ? "invert(28%) sepia(18%) saturate(6055%) hue-rotate(339deg) brightness(98%) contrast(94%);"
      : "invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%) contrast(83%);"};
`;

const FavouriteButton = styled(motion.div)`
  position: absolute;
  top: 0;
  opacity: 0;
  z-index: 20;
  right: 0;
  margin-top: 12px;
  margin-right: 16px;
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const MovieRatingContainer = styled(motion.div)`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  bottom: 2px;
  opacity: 0;
  z-index: 2;
`;

const DecimalRating = styled.span`
  font-weight: 600;
  margin-left: 10px;
`;

const InfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-top: 5px;
`;

const Title = styled(motion.span)`
  olor: white;
  font-size: 1.1em;
  font-weight: 600;
  white-space: nowrap;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  line-height: 1.5;
  overflow: hidden;
  width: 12.5rem;
`;

const ReleaseDate = styled(motion.span)`
  color: #5b5b5b;
  font-size: 0.94em;
  font-weight: 500;
`;
