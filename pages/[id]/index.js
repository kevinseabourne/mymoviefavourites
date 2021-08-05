import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { isArrayEmpty } from "../../components/common/utils/isEmpty";
import { getVideoObject } from "../api/movies";
import { LoadingSpinner } from "../../components/common/loadingSpinner";
import styled, { createGlobalStyle } from "styled-components";
import ImageLoader from "../../components/common/imageLoader";
import VideoOverlay from "../../components/common/videoOverlay";
import heartIcon from "../../public/icons/heart_icon.svg";
import crossIcon from "../../public/icons/cross.svg";
import ReactStars from "react-rating-stars-component";

const MoviePage = (props) => {
  const loadingSpinnerRef = useRef(null);
  // const initialSelectedMovie =
  // JSON.parse(localStorage.getItem("selectedMovie")) || 0;
  // const [selectedMovie] = useState(initialSelectedMovie);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [status, setStatus] = useState("idle");
  const [trailerKey, setTrailerKey] = useState(null);
  const [noTrailer, setNoTrailer] = useState(false);
  // const [videoLoaded, setVideoLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("pending");
      const selected = JSON.parse(localStorage.getItem("selectedMovie"));
      setSelectedMovie(selected);
      const { id } = selected;

      const data = await getVideoObject(id);
      if (data) {
        if (isArrayEmpty(data.results)) {
          const { results } = data;
          console.log(results);
          const trailer = results.find((t) => t.type === "Trailer");

          setTrailerKey(trailer.key);
        } else {
          setNoTrailer(true);
        }
        setStatus("resolved");
      }
    };

    fetchData();
  }, []);

  const handleTrailerClick = () => {
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };

  const { handleFavouriteToggle } = props;

  return status === "pending" ? (
    <LoadingSpinner ref={loadingSpinnerRef} />
  ) : (
    <Container>
      <GlobalStyle showOverlay={showOverlay} />
      <Link href="/">
        <ExitButton>
          <ImageLoader
            src={crossIcon}
            width="30px"
            placeholderSize="100%"
            alt="cross-icon"
            hover={true}
          />
        </ExitButton>
      </Link>
      <MovieContainer>
        <ImageLoader
          src={"https://image.tmdb.org/t/p/w780/" + selectedMovie.poster_path}
          maxWidth="750px"
          alt={selectedMovie.title}
          borderRadius={"10px"}
          placeholderSize={"150%"}
          centerImage={true}
        />
        <InfoContainer>
          <Information>
            <InnerInformationContainer>
              <Title>{selectedMovie.title}</Title>
              <InfoBar>
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
                    placeholderSize="37%"
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
              <Description>{selectedMovie.overview}</Description>
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
                  width="130px"
                  placeholderSize="100%"
                  alt="movie-db-logo"
                  hover={true}
                  centerImage={true}
                />
              </ResponsiveMovieDBLink>
            </InnerInformationContainer>
            <ButtonsContainer>
              {!noTrailer && (
                <TrailerButton onClick={handleTrailerClick}>
                  Watch Trailer
                </TrailerButton>
              )}
              <ResponsiveExitFavContainer>
                <Link href="/">
                  <ResponsiveExitButton>
                    <ImageLoader
                      src={crossIcon}
                      width="32.6px"
                      placeholderSize="100%"
                      alt="cross-icon"
                      hover={true}
                      hoverColor={
                        "invert(46%) sepia(25%) saturate(1858%) hue-rotate(180deg) brightness(86%) contrast(102%)"
                      }
                    />
                  </ResponsiveExitButton>
                </Link>
                <FavouritesButton
                  onClick={() => handleFavouriteToggle(selectedMovie)}
                >
                  <FavouriteIcon>
                    <ImageLoader
                      src={heartIcon}
                      width="27px"
                      placeholderSize="100%"
                      alt="heart"
                      hover={true}
                      isFavourite={selectedMovie.favourite}
                      onClick={() => handleFavouriteToggle(selectedMovie)}
                      svgStartColor="invert(89%) sepia(7%) saturate(74%) hue-rotate(164deg) brightness(90%) contrast(87%);"
                    />
                  </FavouriteIcon>
                  <FavouritesButtonLabel>
                    Add to Favourites
                  </FavouritesButtonLabel>
                </FavouritesButton>
              </ResponsiveExitFavContainer>
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

const Container = styled.div`
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
  filter: invert(93%) sepia(7%) saturate(71%) hue-rotate(169deg) brightness(86%)
    contrast(87%);
  transition: 0.3s ease;
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

const MovieContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(1px, 600px) minmax(300px, 800px);
  align-items: center;
  padding: 0 10.3%;
  @media (max-width: 1200px) {
  }
  @media (max-width: 1024px) {
    margin-top: 0px;
    padding: 20px;
    grid-auto-flow: column;
    grid-template-columns: minmax(1px, 526px);
    grid-template-rows: 1fr auto;
  }
`;

const InfoContainer = styled.div`
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

const Information = styled.div`
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

const InnerInformationContainer = styled.div``;

const Title = styled.span`
  align-self: flex-start;
  font-size: 3.6rem;
  font-weight: 500;
  flex-wrap: nowrap;
  color: white;
  @media (max-width: 1024px) {
    align-self: center;
  }
  @media (max-width: 425px) {
    font-size: 2.1rem;
    align-self: center;
  }
`;

const InfoBar = styled.div`
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
  @media (max-width: 1024px) {
    ${"" /* padding: 0px 50px; */}
    box-sizing: border-box;
    margin-top: 10px;
    margin-bottom: 15px;
    justify-content: space-around;
  }
`;

const ReleaseDate = styled.span`
  margin-right: 40px;
  @media (max-width: 1024px) {
    margin-right: 0px;
  }
  @media (max-width: 425px) {
    margin-right: 12px;
    font-size: 1em;
  }
`;

const ReleatedGenresContainer = styled.div`
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

const Genres = styled.span`
  white-space: nowrap;
  text-align: center;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const MovieDBLink = styled.a`
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

const StarRating = styled.div`
  font-size: 22px;
  margin-left: 38px;
  white-space: nowrap;
  @media (max-width: 1024px) {
    margin-left: 0px;
  }
`;

const ResponsiveMovieDBLink = styled.a`
  transition: all 0.3s;
  opacity: 0.6;
  display: none;
  margin-top: 20px;
  margin-bottom: 0px;
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

const Description = styled.p`
  text-overflow: ellipsis;
  color: white;
  font-size: 1.2em;
  font-weight: 500;
  margin-top: 0;
  line-height: 1.7;
  margin-top: 15px;
  @media (max-width: 1024px) {
    margin: auto;
  }
  @media (max-width: 425px) {
    width: 100%;
    font-size: 1em;
  }
`;

const ButtonsContainer = styled.div`
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

const TrailerButton = styled.button`
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
  &:hover {
    transition-timing-function: ease-in-out;
    transition-duration: 0.5s;
    opacity: 1;
  }
  @media (max-width: 1024px) {
    margin-right: 0px;
    order: 2;
  }
  @media (max-width: 676px) {
    width: 100%;
  }
`;

const ResponsiveExitButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
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

const ResponsiveExitFavContainer = styled.div`
  order: 2;
  @media (max-width: 1024px) {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    order: 1;
  }
  @media (max-width: 250px) {
    justify-content: space-around;
  }
`;

const FavouritesButton = styled.button`
  padding: 0;
  opacity: 0.9;
  background-color: transparent;
  border: none;
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  align-items: center;
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

const FavouriteIcon = styled.div`
  filter: invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%)
    contrast(83%);
  transition: 0.3s ease;
  &:hover {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
  width: 26px;
  @media (max-width: 1024px) {
    width: 38px;
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

const FavouritesButtonLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const TrailerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: rgba(15, 15, 15, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 93px;
  box-sizing: border-box;
  transition: all 0.25s ease;

  &.animateVideoOverlay-enter {
    opacity: 0;
  }
  &.animateVideoOverlay-enter-active {
    transition: all 0.25s ease;
    opacity: 1;
  }
  &.animateVideoOverlay-exit {
    opacity: 1;
  }
  &.animateVideoOverlay-exit-active {
    opacity: 0;
    transition: all 0.25s ease;
  }
`;

const Trailer = styled.iframe`
  height: 59%;
  width: 65%;
  padding-top: 77px;
  box-shadow: 0px 17px 10px -10px rgba(0, 0, 0, 0.4);
`;

const VideoContainer = styled.div`
  width: 1500px;
  @media (max-height: 1000px) {
    width: 1200px;
  }
  @media (max-height: 920px) {
    width: 1100px;
  }
  @media (max-height: 800px) {
    width: 700px;
  }
  @media (max-height: 520px) {
    width: 550px;
  }
  @media (max-height: 432px) {
    width: 400px;
  }
`;
