import { useContext } from "react";
import AppContext from "../../context/appContext";
import styled from "styled-components";
import Image from "next/image";
import ImageLoader from "./imageLoader";
import Link from "next/link";
import { motion } from "framer-motion";
// import "react-rater/lib/react-rater.css";
// import Rater from "react-rater";

const MovieItem = ({ movie, handleMovieClick, handleFavouriteClick }) => {
  const { handleSelectedMovie } = useContext(AppContext);
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
  return (
    <Container>
      <Link href="/[id]" as="/movie">
        <ImageContainer
          onClick={() => handleSelectedMovie(movie)}
          variants={placeholderAnimation}
          whileHover="hover"
          whileFocus="hover"
        >
          <FavouriteButton onClick={handleFavouriteClick} />

          <ImageLoader
            key={movie.poster_path}
            src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
            width="202px"
            borderRadius="10px"
            placeholderSize="149.1%"
          />
          <MovieRatingContainer variables={placeholderAnimation}>
            {/* <Rater
            total={5}
            rating={movie.vote_average / 2}
            interactive={false}
            size={60}
          /> */}
            <DecimalRating>{movie.vote_average / 2}</DecimalRating>
          </MovieRatingContainer>
        </ImageContainer>
      </Link>
      {/* <ImageLoader
        key={movie.poster_path}
        src={"https://image.tmdb.org/t/p/w500/" + movie.poster_path}
        width="202px"
        borderRadius="10px"
        placeholderSize="150%"
      /> */}
      <InfoContainer>
        <Title>{movie.title}</Title>
        <ReleaseDate>
          {movie.release_date ? movie.release_date.substring(0, [4]) : ""}
        </ReleaseDate>
      </InfoContainer>
    </Container>
  );
};

export default MovieItem;

const Container = styled.div`
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

const FavouriteButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 5px;
  margin-right: 10px;
`;

const MovieRatingContainer = styled(motion.div)`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  bottom: 0px;
  opacity: 0;
`;

const DecimalRating = styled.span``;

const InfoContainer = styled.div`
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
