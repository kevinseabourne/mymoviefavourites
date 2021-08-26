import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { isArrayEmpty, isObjEmpty } from "./utils/isEmpty";
import { getVideoObject } from "../../pages/api/movies";
import { LoadingSpinner } from "./loadingSpinner";
import styled, { createGlobalStyle } from "styled-components";
import ImageLoader from "./imageLoader";
import VideoOverlay from "./videoOverlay";
import heartIcon from "../../public/icons/heart_icon.svg";
import crossIcon from "../../public/icons/cross.svg";
import ReactStars from "react-rating-stars-component";

const MoviePage = ({ handleFavouriteSelected, favouriteMovies }) => {
  const { push, pathname, query } = useRouter();
  const loadingSpinnerRef = useRef(null);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [status, setStatus] = useState("idle");
  const [trailerKey, setTrailerKey] = useState(null);
  const [noTrailer, setNoTrailer] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [movieInFavourites, setMovieInFavourites] = useState(false);
  const [width, setWidth] = useState(null);

  const ref = React.useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("pending");

      const selected = JSON.parse(localStorage.getItem("selectedMovie"));

      // if the query is not the movie from local storage which is stored on click then redirect to 404 page
      const expectedQuery = selected.title
        .toLowerCase()
        .replace(/[{L}!#$'"@`#*+)(:;{}\s]/g, "-");

      if (query.id !== expectedQuery) {
        push("/404");
      } else {
        setSelectedMovie(selected);

        checkMovieFavourites(selected);
        handleTrailer(selected);
        setStatus("resolved");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    !isObjEmpty(selectedMovie) && checkMovieFavourites(selectedMovie);
  }, [favouriteMovies]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const browserWidth = ref.current.offsetWidth;
    if (browserWidth !== width) {
      setWidth(browserWidth);
    }
  });

  const checkMovieFavourites = (selected) => {
    // check if the movie in the favourites
    const movieFavourited = favouriteMovies.find(
      (favMovie) => favMovie.id === selected.id
    );

    setMovieInFavourites(Boolean(movieFavourited));
  };

  const handleTrailer = async (selected) => {
    // get url for the trailer from movieDB
    const { id } = selected;

    const data = await getVideoObject(id);
    if (data) {
      if (isArrayEmpty(data.results)) {
        const { results } = data;
        const trailer = results.find((t) => t.type === "Trailer");

        setTrailerKey(trailer.key);
      } else {
        setNoTrailer(true);
      }
    }
  };

  const handleTrailerClick = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const handleExit = () => {
    if (pathname === "/favourites/[id]") {
      push("/favourites", { query: "favourites" });
    }
  };

  const containerAnimation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        type: "spring",
      },
    },
  };

  const imageAnimation = {
    hidden: {
      opacity: 0,
      x: -100,
      rotateY: -20,
      skewY: -5,
    },
    show: {
      x: 0,
      rotateY: 0,
      skewY: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        type: "spring",
        bounce: 0,
        duration: 1,
      },
    },
  };

  const infoAnimation = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeAnimation = {
    hidden: {
      opacity: 0,
      x: width <= 1024 ? -100 : 100,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        bounce: 0,
      },
    },
  };

  const buttonAnimation = {
    hidden: {
      opacity: 0,
      x: width <= 1024 ? -100 : 100,
    },
    show: {
      opacity: 0.79,
      x: 0,
      transition: {
        duration: 0.1,
        type: "spring",
        bounce: 0,
      },
    },
    hover: {
      opacity: 1,
    },
  };

  return isObjEmpty(selectedMovie) ? (
    <LoadingSpinner ref={loadingSpinnerRef} />
  ) : (
    <Container ref={ref}>
      <GlobalStyle showOverlay={showOverlay} />
      <Link href={pathname === "/favourites/[id]" ? "/favourites" : "/"}>
        <ExitButton onClick={() => handleExit}>
          <ImageLoader
            src={crossIcon}
            width="30px"
            placeholderSize="100%"
            alt="cross-icon"
            hover={true}
          />
        </ExitButton>
      </Link>
      <MovieContainer
        variant={containerAnimation}
        initial="hidden"
        animate="show"
      >
        <ImageContainer variants={imageAnimation}>
          <ImageLoader
            src={"https://image.tmdb.org/t/p/w780/" + selectedMovie.poster_path}
            maxWidth="100%"
            alt={selectedMovie.title}
            borderRadius={"10px"}
            placeholderSize={"150%"}
            centerImage={true}
            opacity={0}
            boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px;"
            loadingSpinner={true}
          />
        </ImageContainer>
        <InfoContainer variants={infoAnimation}>
          <Information>
            <InnerInformationContainer>
              <Title variants={fadeAnimation}>{selectedMovie.title}</Title>
              <InfoBar variants={fadeAnimation}>
                <ReleaseDate>{selectedMovie.release_date}</ReleaseDate>

                <ReleatedGenresContainer
                  relatedGenresLength={
                    selectedMovie.relatedGenres
                      ? selectedMovie.relatedGenres.length
                      : 4
                  }
                >
                  {selectedMovie.relatedGenres &&
                    selectedMovie.relatedGenres.map((genre) => (
                      <Genres key={genre}>{genre}</Genres>
                    ))}
                </ReleatedGenresContainer>
                <MovieDBLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={
                    "https://www.themoviedb.org/movie/" +
                    selectedMovie.id +
                    "-" +
                    selectedMovie.title
                  }
                >
                  <ImageLoader
                    src="https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png"
                    width="115px"
                    placeholderSize="42%"
                    alt="movie-db-logo"
                    hover={true}
                  />
                </MovieDBLink>

                <StarRating>
                  <ReactStars
                    value={selectedMovie.vote_average / 2}
                    count={5}
                    isHalf={true}
                    size={24}
                    activeColor="#ffd700"
                    color="#D1D5DB"
                    edit={false}
                  />
                </StarRating>
              </InfoBar>

              <Description variants={fadeAnimation}>
                {selectedMovie.overview}
              </Description>
            </InnerInformationContainer>
            <ButtonsContainer variants={fadeAnimation}>
              {!noTrailer && (
                <TrailerButton
                  onClick={handleTrailerClick}
                  variants={buttonAnimation}
                  animate="show"
                  whileHover="hover"
                >
                  Watch Trailer
                </TrailerButton>
              )}

              <ResponsiveExitFavContainer>
                <Link
                  href={pathname === "/favourites/[id]" ? "/favourites" : "/"}
                >
                  <ResponsiveExitButton variants={fadeAnimation}>
                    <ImageLoader
                      src={crossIcon}
                      width="39px"
                      placeholderSize="100%"
                      alt="exit"
                      hover={true}
                    />
                  </ResponsiveExitButton>
                </Link>
                <FavouritesButton
                  variants={fadeAnimation}
                  whileHover="hover"
                  onClick={() =>
                    handleFavouriteSelected(selectedMovie, movieInFavourites)
                  }
                >
                  <FavouriteIcon movieInFavourites={movieInFavourites}>
                    <ImageLoader
                      src={heartIcon}
                      width="46px"
                      placeholderSize="100%"
                      alt="favourite"
                      hover={true}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavouriteSelected(
                          selectedMovie,
                          movieInFavourites
                        );
                      }}
                    />
                  </FavouriteIcon>
                  <FavouritesButtonLabel>
                    Add to Favourites
                  </FavouritesButtonLabel>
                </FavouritesButton>
              </ResponsiveExitFavContainer>
              <ResponsiveMovieDBLink
                target="_blank"
                rel="noopener noreferrer"
                href={
                  "https://www.themoviedb.org/movie/" +
                  selectedMovie.id +
                  "-" +
                  selectedMovie.title
                }
              >
                <ImageLoader
                  src="https://www.themoviedb.org/assets/1/v4/logos/408x161-powered-by-rectangle-green-bb4301c10ddc749b4e79463811a68afebeae66ef43d17bcfd8ff0e60ded7ce99.png"
                  width="114px"
                  placeholderSize="42%"
                  alt="movie-db-logo"
                  hover={true}
                  centerImage={true}
                />
              </ResponsiveMovieDBLink>
            </ButtonsContainer>
          </Information>
        </InfoContainer>
      </MovieContainer>

      {!noTrailer && (
        <VideoOverlay
          showOverlay={showOverlay}
          closeOverlay={closeOverlay}
          src={"https://www.youtube.com/embed/" + trailerKey + "?autoplay=1"}
          maxWidth="1400px"
          alt={selectedMovie.title}
          placeholderSize="56.25%"
          centerVideo={true}
        />
      )}
    </Container>
  );
};

export default MoviePage;

const GlobalStyle = createGlobalStyle`
 body {
   overflow: ${({ showOverlay }) => (showOverlay ? "hidden" : "scroll")};
  }
`;

const Container = styled(motion.div)`
  min-height: calc(100vh - 93px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  @media (max-width: 1024px) {
    height: 100%;
  }
`;

const ExitButton = styled.button`
  position: absolute;
  top: 49px;
  right: 75px;
  background: transparent;
  border: none;
  padding: 0;
  transition: 0.3s ease;
  filter: invert(93%) sepia(7%) saturate(71%) hue-rotate(169deg) brightness(86%)
    contrast(87%);
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
  @media (max-width: 1024px) {
    display: none;
  }
`;

const MovieContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: minmax(1px, 600px) minmax(300px, 800px);
  align-items: center;
  padding: 0 5.3%;
  @media (max-width: 1024px) {
    margin-top: 0px;
    padding: 20px;
    grid-auto-flow: column;
    grid-template-columns: minmax(1px, 526px);
    grid-template-rows: 1fr auto;
    animation: none;

}
  }
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  max-width: calc(100% - 93px);
  margin: auto;
  @media (max-width: 632px) {
    max-width: 100%;
  }
`;

const InfoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: ${({ width }) => width};
  width: 100%;
  height: 100%;
  letter-spacing: 0px;
  position: relative;
  border-radius: 10px;
  border-radius: 0px;
  @media (max-width: 1024px) {
    height: auto;
  }
`;

const Information = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 50px;
  @media (max-width: 1024px) {
    margin-left: 0px;
    margin-top: 14px;
    max-width: auto;
    justify-content: center;
    height: auto;
    text-align: center;
  }
`;

const InnerInformationContainer = styled(motion.div)``;

const Title = styled(motion.div)`
  align-self: flex-start;
  font-size: 3.6rem;
  font-weight: 500;
  flex-wrap: nowrap;
  color: white;

  @media (max-width: 1380px) {
    font-size: 2.25rem;
  }
  @media (max-width: 1024px) {
    align-self: center;
    font-size: 2.25rem;
  }
  @media (max-width: 425px) {
    font-size: 2.1rem;
    align-self: center;
  }
`;

const InfoBar = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  font-size: 1.12em;
  font-weight: 600;
  color: white;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  @media (max-width: 1380px) {
    font-size: 1em;
  }
  @media (max-width: 1024px) {
    box-sizing: border-box;
    margin-top: 25px;
    margin-bottom: 25px;
    justify-content: space-around;
    padding: 0 20px;
  }
`;

const ReleaseDate = styled(motion.span)`
  margin-right: 40px;
  @media (max-width: 1024px) {
    margin-right: 0px;
  }
  @media (max-width: 425px) {
    margin-right: 12px;
    font-size: 1em;
  }
`;

const ReleatedGenresContainer = styled(motion.div)`
  display: grid;
  justify-content: center;
  grid-template-columns: ${({ relatedGenresLength }) =>
    relatedGenresLength >= 4
      ? `repeat(${relatedGenresLength / 2}, 1fr)`
      : `repeat(${relatedGenresLength}, 1fr)`};
  grid-gap: 2px 10px;
  @media (max-width: 2360px) {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5% 15%;
  }
  @media (max-width: 1560px) {
    grid-template-columns: repeat(auto-fit, 1fr);
  }
`;

const Genres = styled(motion.span)`
  text-transform: capitalize;
  white-space: nowrap;
  text-align: center;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const MovieDBLink = styled(motion.a)`
  transition: all 0.3s;
  margin-left: 40px;
  opacity: 0.6;
  &:hover {
    opacity: 0.9;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    cursor: pointer;
  }
  @media (max-width: 950px) {
    display: none;
  }
`;

const StarRating = styled(motion.div)`
  font-size: 22px;
  margin-left: 38px;
  white-space: nowrap;
  @media (max-width: 1024px) {
    margin-left: 40px;
  }
`;

const ResponsiveMovieDBLink = styled(motion.a)`
  transition: all 0.3s;
  opacity: 0.6;
  display: none;
  margin-top: 80px;
  margin-bottom: 30px;
  order: 3;
  &:hover {
    opacity: 0.9;
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
    cursor: pointer;
  }
  @media (max-width: 950px) {
    display: block;
  }
`;

const Description = styled(motion.p)`
  text-overflow: ellipsis;
  color: white;
  font-size: 1.2em;
  font-weight: 500;
  margin-top: 0;
  width: 100%;
  line-height: 1.7;
  margin-top: 15px;
  @media (max-width: 1380px) {
    font-size: 1em;
  }
  @media (max-width: 1024px) {
    margin: auto;
  }
  @media (max-width: 425px) {
    width: 100%;
    font-size: 1em;
  }
`;

const ButtonsContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 1024px) {
    justify-content: center;
    margin-bottom: 20px;
  }
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const TrailerButton = styled(motion.button)`
  font-size: 1em;
  text-decoration: none;
  cursor: pointer;
  background-color: #2d72d9;
  border: 0;
  order: 1;
  transition: all 0.3s ease;
  opacity: 0.79;
  border-radius: 4px;
  padding: 15px 23px;
  box-shadow: 0px 17px 10px -10px rgba(0, 0, 0, 0.4);
  color: white;
  font-weight: 600;
  word-spacing: 0.2px;
  text-decoration: none;
  margin-right: 30px;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  @media (max-width: 1024px) {
    margin-top: 60px;
    margin-right: 0px;
    order: 1;
  }
  @media (max-width: 676px) {
    width: 100%;
  }
`;

const ResponsiveExitButton = styled(motion.button)`
  display: none;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  transition: 0.3s ease;
  order: 2;
  filter: invert(93%) sepia(7%) saturate(71%) hue-rotate(169deg) brightness(86%)
    contrast(87%);
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
  @media (max-width: 1024px) {
    display: flex;
    padding: 50px 60px;
  }
  @media (max-width: 390px) {
    padding: 40px 30px;
  }
  @media (max-width: 250px) {
    display: flex;
    padding: 30px 0px;
  }
`;

const ResponsiveExitFavContainer = styled(motion.div)`
  order: 2;
  @media (max-width: 1024px) {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    order: 1;
    margin-top: 40px;
  }
  @media (max-width: 250px) {
    justify-content: space-around;
  }
`;

const FavouritesButton = styled(motion.button)`
  padding: 0;
  opacity: 0.9;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  align-items: center;
  transition: 0.3s ease;
  width: 173px;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
  @media (max-width: 1024px) {
    margin-left: 0px;
    justify-content: center;
    width: auto;
  }
`;

const FavouriteIcon = styled(motion.div)`
  transition: 0.3s ease;
  filter: ${({ movieInFavourites }) =>
    movieInFavourites
      ? "invert(28%) sepia(18%) saturate(6055%) hue-rotate(339deg) brightness(98%) contrast(94%);"
      : "invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%) contrast(83%);"};

  width: 26px;
  @media (max-width: 1024px) {
    width: 46px;
    margin-bottom: 3.6px;
    padding: 50px 60px;
  }
  @media (max-width: 390px) {
    display: flex;
    padding: 40px 30px;
  }
  @media (max-width: 250px) {
    display: flex;
    padding: 30px 0px;
  }
`;

const FavouritesButtonLabel = styled(motion.span)`
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  @media (max-width: 1024px) {
    display: none;
  }
`;
