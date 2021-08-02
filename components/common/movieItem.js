import { useState, useContext } from "react";
import AppContext from "../../context/appContext";
import styled from "styled-components";
import Image from "next/image";
import ImageLoader from "./imageLoader";
import Link from "next/link";
import Router from "next/router";
import { motion } from "framer-motion";
import ReactStars from "react-rating-stars-component";

const MovieItem = ({ movie }) => {
  const { handleSelectedMovie, handleFavouriteSelected } = useContext(
    AppContext
  );
  const [imageLoaded, setimageLoaded] = useState(false);

  const handleImageLoad = () => setimageLoaded(true);

  const handleClick = (e, operation, movie) => {
    console.log(e.target);
    if (operation === "selected" && movie) {
      handleSelectedMovie(movie);
      Router.push("/[id]", movie.title);
    } else if (operation === "favourite") {
      handleFavouriteSelected();
    }
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
      staggerChildren: 0.9,
      transition: {
        type: "spring",
        staggerChildren: 0.9,
      },
    },
    show: {
      opacity: 1,
      staggerChildren: 0.9,
      transition: {
        type: "spring",
        staggerChildren: 2.9,
      },
    },
  };
  return (
    <Container variants={itemAnimation}>
      <ImageContainer
        onClick={(e) => handleClick(e, "selected", movie)}
        variants={placeholderAnimation}
        whileHover="hover"
        whileFocus="hover"
      >
        <BackgroundFade variants={hoverInfoAnimation} />
        <FavouriteButton
          onClick={(e) => handleClick(e, "favourite")}
          variants={hoverInfoAnimation}
          tabindex="0"
        >
          <ImageLoader
            src="/icons/heart_icon.svg"
            width="30px"
            placeholderSize="70%"
            hover={true}
          />
        </FavouriteButton>

        <ImageLoader
          key={movie.poster_path}
          src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
          width="202px"
          borderRadius="10px"
          placeholderSize="150%"
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
      {/* </Link> */}
      <InfoContainer
        variants={infoAnimation}
        initial="hidden"
        animate={imageLoaded ? "show" : "hidden"}
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
`;

const BackgroundFade = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0;
  background-color: rgba(18, 18, 18, 0.7);
`;

const FavouriteButton = styled(motion.div)`
  position: absolute;
  top: 0;
  opacity: 0;
  z-index: 20;
  right: 0;
  margin-top: 12px;
  margin-right: 16px;
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

const Title = styled.span`
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

const ReleaseDate = styled.span`
  color: #5b5b5b;
  font-size: 0.94em;
  font-weight: 500;
`;
