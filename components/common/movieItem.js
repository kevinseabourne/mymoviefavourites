import { useState, useEffect, useContext, useRef } from "react";
import AppContext from "../../context/appContext";
import styled from "styled-components";
import ImageLoader from "./imageLoader";
import { isArrayEmpty } from "./utils/isEmpty";
import { useRouter } from "next/router";
import { motion, Reorder, useDragControls } from "framer-motion";
import ReactStars from "react-rating-stars-component";

const MovieItem = ({ movie, status, favouriteMovies }) => {
  const { pathname, push } = useRouter();
  const {
    handleSelectedMovie,
    handleFavouriteSelected,
    selectedSortBy,
    selectedGenre,
    searching,
  } = useContext(AppContext);
  const imageContainerRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [focus, setFocus] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const [movieInFavourites, setMovieInFavourites] = useState(false);

  const controls = useDragControls();

  const handleImageLoad = () => setImageLoaded(true);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener("resize", getDimensions);

    return () => window.removeEventListener("resize", getDimensions);
  }, []);

  const getDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    if (isArrayEmpty(favouriteMovies)) {
      const favouriteMovie = favouriteMovies.find(
        (favMovie) => favMovie.id === movie.id
      );
      if (favouriteMovie) {
        setMovieInFavourites(true);
      } else {
        setMovieInFavourites(false);
      }
    } else {
      setMovieInFavourites(false);
    }
  }, [favouriteMovies, movie]);

  useEffect(() => {
    status === "pending" && setImageLoaded(false);
  }, [status]);

  const handleItemClick = (movie) => {
    // ------------------------ Notes ------------------------ //
    // for mobile and tablet when you click on the item it will set focus to true
    // which shows the rating and favourite button, if you press again it will then
    // take you to the movie page.
    if (windowWidth <= 768) {
      setFocus(true);
    } else {
      setFocus(false);
    }

    if ((windowWidth <= 768 && focus) || windowWidth > 768) {
      handleSelectedMovie(movie);

      const cleanUpTitle = movie.title
        .toLowerCase()
        .replace(/[{L}!#$'"@`#*+)(:;{}\s]/g, "-");

      push(
        pathname === "/favourites" ? "/favourites/[id]" : "/[id]",
        `${pathname === "/favourites" ? "/favourites/" : "/"}${cleanUpTitle}`
      );
    }
  };

  const handleFavouriteClick = (movie) => {
    handleFavouriteSelected(movie, movieInFavourites);
  };

  // ------------------------ Animation ------------------------ //

  const itemAnimation = {
    hidden: {
      y: 12,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
    },
  };

  const placeholderAnimation = {
    hidden: {
      backgroundColor: "rgba(18, 18, 18, 0)",
      border: "3.4px solid transparent",
      transition: {
        type: "spring",
      },
    },
    hover: {
      cursor: "pointer",
      backgroundColor: "rgba(18, 18, 18, 0.7)",
      border: "3.4px solid transparent",
      // border: "3.4px solid #2d72d9",
      transition: {
        type: "spring",
      },
    },
  };

  const hoverInfoAnimation = {
    hidden: {
      opacity: 0,
    },
    hover: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0,
      },
    },
  };

  const favButtonAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    hover: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0,
      },
    },
  };

  const ratingAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.9,
    },
    hover: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
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
        bounce: 0,
      },
    },
  };

  // selectedSortBy is Order
  const dragCondition =
    pathname === "/favourites" &&
    selectedGenre.name === "All" &&
    selectedSortBy.title === "Order" &&
    !searching;

  return (
    <Reorder.Item
      as={Container}
      key={movie.id}
      value={movie}
      style={{ listStyle: "none" }}
      variants={itemAnimation}
      drag={dragCondition ? true : false}
      dragControls={controls}
      dragListener={false}
      // dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      // dragElastic={0}
      whileHover={{
        scale: 1.03,
        transition: {
          type: "spring",
        },
      }}
      whileFocus={{
        scale: 1.03,
        transition: {
          type: "spring",
        },
      }}
    >
      <ImageContainer
        tabIndex="0"
        onKeyPress={() => {
          handleItemClick(movie);
        }}
        ref={imageContainerRef}
        onClick={() => handleItemClick(movie)}
        variants={placeholderAnimation}
        whileHover={imageLoaded ? "hover" : "hidden"}
        initial="hidden"
        viewport={{ once: true }}
        animate={imageLoaded && focus ? "hover" : "hidden"}
        onFocus={(e) => e.keycode === 13 && setFocus(true)}
        onBlur={(e) =>
          e.currentTarget.contains(e.relatedTarget)
            ? setFocus(true)
            : setFocus(false)
        }
      >
        {imageLoaded && <BackgroundFade variants={hoverInfoAnimation} />}
        {dragCondition && imageLoaded && (
          <Drag
            onClick={(e) => {
              e.stopPropagation();
            }}
            variants={favButtonAnimation}
            onPointerDown={(e) => controls.start(e)}
          >
            <ImageLoader
              src="/icons/dragIcon.svg"
              width="25px"
              placeholderSize="100%"
              grab={true}
            />
          </Drag>
        )}
        {imageLoaded && (
          <FavouriteButton
            onClick={(e) => {
              e.stopPropagation();
              handleFavouriteClick(movie);
            }}
            onKeyPress={(e) => e.stopPropagation()}
            aria-label="favourite"
            variants={favButtonAnimation}
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
        )}

        <ImageLoader
          key={movie.poster_path}
          src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
          alt={movie.title}
          width="100%"
          borderRadius="10px"
          placeholderSize="150%"
          opacity={0}
          boxShadow="rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;"
          // boxShadow="0 10px 15px -3px rgba(0, 0, 0, 0.1),
          //   0 4px 6px -2px rgba(0, 0, 0, 0.05);"
          loadingSpinner={true}
          handleOnLoadOutside={handleImageLoad}
        />
        {imageLoaded && (
          <MovieRatingContainer variants={ratingAnimation}>
            <ReactStars
              value={movie.vote_average / 2}
              count={5}
              isHalf={true}
              size={24}
              activeColor="#ffd700"
              color="#D1D5DB"
              edit={false}
            />
            <DecimalRating>{movie.vote_average.toFixed(1)}</DecimalRating>
          </MovieRatingContainer>
        )}
      </ImageContainer>
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
    </Reorder.Item>
  );
};

export default MovieItem;

const Container = styled(motion.li)`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  max-width: 202px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: transparent;
  border: 3.4px solid transparent;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  @media (max-width: 465px) {
    max-width: 100%;
  }
`;

const BackgroundFade = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  border-radius: 10px;
  opacity: 0;
  background-color: rgba(18, 18, 18, 0.6);
`;

const Drag = styled(motion.button)`
  position: absolute;
  top: 0;
  z-index: 20;
  left: 0;
  cursor: grab !important;
  padding-top: 12px;
  padding-bottom: 50px;
  padding-right: 60px;
  padding-left: 16px;
  &:hover {
    cursor: grab;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
const HeartFilter = styled(motion.div)`
  transition: 0.15s;
  filter: ${({ movieInFavourites }) =>
    movieInFavourites
      ? "invert(28%) sepia(18%) saturate(6055%) hue-rotate(339deg) brightness(98%) contrast(94%);"
      : "invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%) contrast(83%);"};
`;

const FavouriteButton = styled(motion.button)`
  position: absolute;
  top: 0;
  z-index: 20;
  right: 0;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-right: 16px;
  padding-left: 16px;
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
  width: 100%;
  @media (max-width: 465px) {
    text-align: center;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }
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
`;

const ReleaseDate = styled(motion.span)`
  color: #5b5b5b;
  font-size: 0.94em;
  font-weight: 500;
`;
