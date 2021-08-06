import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef, useContext } from "react";
import AppContext from "../context/appContext";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
// import { Tooltip, OverlayTrigger } from "react-bootstrap";
// import Fade from "react-reveal/Fade";
import { useForm } from "react-hook-form";
import { Input } from "./common/input";
import ResponsiveHeader from "./responsiveHeader";
import ImageLoader from "../components/common/imageLoader";
import carrotIcon from "../public/icons/carret-down-icon.svg";
import heartIcon from "../public/icons/heart_icon.svg";
import infoIcon from "../public/icons/info-circle-icon.svg";

const Header = ({
  handleSelectedGenre,
  handleSelectedSortBy,
  handleSearch,
  genres,
  searching,
}) => {
  const router = useRouter();
  const genreDropdownRef = useRef(null);
  const sortByDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState(false);
  const [selectedSortBy, setSelectedSortBy] = useState("Trending");
  const [sortByOptions, setSortByOptions] = useState([
    "Trending",
    "Popular",
    "Top Rated",
    "Year",
    "Title",
    "Rating",
  ]);
  const [inputOpen, setInputOpen] = useState(false);
  const [dropdownHovering, setDropdownHovering] = useState(false);
  const [renderChangeOnce, setRenderChangeOnce] = useState(false);

  const { register, handleSubmit, watch, formState } = useForm();
  const { ref, ...rest } = register("search");

  const searchInputValue = watch("search");

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (router.pathname === "/favourites") {
      !renderChangeOnce && setSelectedSortBy("Year");
      setRenderChangeOnce(true);
    } else if (!renderChangeOnce) {
      !renderChangeOnce && setSelectedSortBy("Trending");
      setRenderChangeOnce(true);
    }
  });

  useEffect(() => {}, [selectedSortBy]);

  useEffect(() => {
    if (!inputOpen) {
      searchRef.current.value = "";
    }
  }, [inputOpen]);

  const handleClickOutside = (e) => {
    if (
      genreDropdownRef.current &&
      !genreDropdownRef.current.contains(e.target)
    ) {
      setGenreDropdownOpen(false);
    }
    if (
      sortByDropdownRef.current &&
      !sortByDropdownRef.current.contains(e.target)
    ) {
      setSortByDropdownOpen(false);
    }
  };

  const onSubmit = (query) => {
    const { search } = query;
    query && handleSearch(search);
  };

  const handleInputOpen = () => {
    if (!inputOpen) {
      searchRef.current.focus();
    }
    setInputOpen(!inputOpen);
  };

  const handleGenreDropdown = () => {
    setGenreDropdownOpen(!genreDropdownOpen);
  };

  const handleSortByDropdown = () => {
    setSortByDropdownOpen(!sortByDropdownOpen);
  };

  const handleReturnHomeAndRest = () => {
    // also if searching is true then do
    // the function reset the dropdown setting back to default and changes route to the home page
    if (selectedGenre !== "All" || selectedSortBy !== "Trending" || searching) {
      // No need to call handleGenreBy because doing will make the same http request handleSelectedSortBy("All") is doing
      setSelectedGenre("All");
      setSelectedSortBy("Trending");
      handleSelectedGenre({ id: null, name: "All" });
      handleSelectedGenre("All");
      handleSelectedSortBy("Trending");
    }
    closeAndClearInput();
    router.pathname !== "/" && router.push("/");
  };

  const closeAndClearInput = () => {
    setInputOpen(false);
    searchRef.current.value = "";
  };

  const handleSortByClick = (option) => {
    if (
      option === "Trending" ||
      option === "Popular" ||
      option === "Top Rated"
    ) {
      closeAndClearInput();
    }
    setSelectedSortBy(option);
    handleSelectedSortBy(option);
  };

  const handleRouteChange = (route) => {
    router.push(route);
    closeAndClearInput();
  };

  const handleIconBoxKeyDown = (e) => {
    const key = e.key === 13 || e.keyCode === 13;
    if (key) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };
  // const {
  // onGenreSelect,
  // onSortBySelection,
  // handleFavouritesPageSelection,
  // allFavMovies,
  // FavouritesSectionOpen,
  // onChange,
  // } = props;

  const favouritesSectionOpen = false;

  return (
    <Container>
      <FilterSection>
        <MoviesLabel onClick={handleReturnHomeAndRest} tabIndex="0">
          Movies
        </MoviesLabel>

        {favouritesSectionOpen ? (
          <FavouritesCounter>{allFavMovies.length}</FavouritesCounter>
        ) : (
          <GenreContainer
            ref={genreDropdownRef}
            onClick={handleGenreDropdown}
            onFocus={handleGenreDropdown}
            onBlur={handleGenreDropdown}
          >
            <DropdownTitle>Genre</DropdownTitle>
            <SelectedDropdownValue>{selectedGenre}</SelectedDropdownValue>
            <CarrotIconContainer>
              <ImageLoader
                src={carrotIcon}
                width="10px"
                placeholderSize="56.85%"
                alt="carrot"
                hover={true}
                priority={true}
              />
            </CarrotIconContainer>
            {genreDropdownOpen && (
              <Dropdown>
                {genres.map((genre) => (
                  <DropdownItem
                    key={genre.id}
                    onClick={() => {
                      genre.name === "All" && closeAndClearInput();
                      setSelectedGenre(genre.name);
                      handleSelectedGenre(genre);
                    }}
                    disabled={genre.name === selectedGenre}
                  >
                    {genre.name}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </GenreContainer>
        )}

        {!favouritesSectionOpen && (
          <SortByContainer
            ref={sortByDropdownRef}
            onClick={handleSortByDropdown}
            onFocus={handleSortByDropdown}
            onBlur={handleSortByDropdown}
          >
            <DropdownTitle>Sort By</DropdownTitle>
            <SelectedDropdownValue>{selectedSortBy}</SelectedDropdownValue>
            <CarrotIconContainer>
              <ImageLoader
                src={carrotIcon}
                width="10px"
                placeholderSize="56.85%"
                alt="carrot"
                hover={true}
                priority={true}
              />
            </CarrotIconContainer>

            {sortByDropdownOpen && (
              <Dropdown>
                {sortByOptions.map((option) => (
                  <DropdownItem
                    key={sortByOptions.indexOf(option)}
                    onClick={() => handleSortByClick(option)}
                    disabled={option.name === selectedSortBy}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </SortByContainer>
        )}
      </FilterSection>

      <WebsiteTitleContainer onClick={handleReturnHomeAndRest}>
        <WebsiteTitle>Movies</WebsiteTitle>
        <PopcornContainer>
          <ImageLoader
            src={"https://chpistel.sirv.com/Images/popcorn-icon.png?w=60"}
            width="36px"
            placeholderSize="100%"
            alt="popcorn"
            hover={true}
            priority={true}
          />
        </PopcornContainer>
      </WebsiteTitleContainer>

      <IconSection>
        <InputContainer
          onSubmit={handleSubmit(onSubmit)}
          inputOpen={inputOpen}
          onFocus={() => setInputOpen(true)}
        >
          <Input
            ref={searchRef}
            inputOpen={inputOpen}
            onClick={handleInputOpen}
            searchInputValue={searchInputValue}
            {...rest}
            handleInputOpen={handleInputOpen}
          />
        </InputContainer>

        <HeartIconContainer onClick={() => handleRouteChange("/favourites")}>
          <ImageLoader
            src={heartIcon}
            width="25px"
            placeholderSize="100%"
            alt="heart"
            hover={true}
            priority={true}
          />
        </HeartIconContainer>

        <AboutIconContainer onClick={() => handleRouteChange("/about")}>
          <ImageLoader
            src={infoIcon}
            width="22px"
            placeholderSize="100%"
            alt="about"
            svgStartColor="invert(89%) sepia(7%) saturate(74%) hue-rotate(164deg) brightness(90%) contrast(87%);"
            hover={true}
            priority={true}
          />
        </AboutIconContainer>
      </IconSection>
      <ResponsiveHeader />
    </Container>
  );
};

export default Header;

const Container = styled.div`
  width: 100%;
  position: relative;
  height: 93px;
  background-color: #17181b;
  opacity: 0.97;
  box-shadow: 0px 6px 8px -4px rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  z-index: 100;
  position: fixed;
  @media (max-width: 632px) {
    height: 80px;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
  margin-right: auto;
  margin-left: 30px;
  @media (max-width: 1024px) {
    margin-right: auto;
    margin-left: auto;
  }
  @media (max-width: 632px) {
    display: none;
  }
`;

const MoviesLabel = styled.span`
  border-bottom: 4px solid #2d72d9;
  border-radius: 1px;
  transition: all 0.3s;
  padding: 0px 15px 6px 18px;
  color: #c3c5c7;
  letter-spacing: 0.1px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
    color: white;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`;

const DropdownTitle = styled.div`
  transition: all 0.3s;
  color: #c3c5c7;
  margin-right: 6px;
  letter-spacing: 0.1px;
  font-weight: 600;
  user-select: none;
`;

const FavouritesCounter = styled.span`
  color: #2d72d9;
  padding-left: 16px;
  padding-right: 5px;
  font-weight: 500;
  user-select: none;
`;

const SelectedDropdownValue = styled.span`
  color: #2d72d9;
  padding-left: 9px;
  padding-right: 10px;
  font-weight: 500;
`;

const CarrotIconContainer = styled.div`
  width: 10px;
  position: relative;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: invert(93%) sepia(7%) saturate(71%) hue-rotate(169deg) brightness(86%)
    contrast(87%);
  transition: all 0.3s;
`;

const GenreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 0px 15px 10px 28px;
  position: relative;
  transition: all 0.3s;
  &:hover {
    cursor: pointer;
    ${DropdownTitle} {
      color: white;
    }
    ${SelectedDropdownValue} {
    }
    ${FavouritesCounter} {
      cursor: default;
    }
    ${CarrotIconContainer} {
      filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
        brightness(102%) contrast(105%) !important;
    }
  }
`;

const SortByContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin: 0px 15px 10px 18px;
  position: relative;
  transition: all 0.3s;
  &:hover {
    cursor: pointer;
    ${DropdownTitle} {
      color: white;
    }
    ${SelectedDropdownValue} {
    }
    ${CarrotIconContainer} {
      filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
        brightness(102%) contrast(105%);
    }
  }
`;

const Dropdown = styled.div`
  position: absolute;
  background-color: #17181b;
  margin-top: 14px;
  min-width: 190px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  top: 18px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
  z-index: 1;
`;

const DropdownItem = styled.div`
  color: #c3c5c7;
  padding: 8px 20px;
  font-size: 0.95em;
  letter-spacing: 0.2px;
  line-height: 1.4;
  text-decoration: none;
  white-space: nowrap;
  display: block;
  font-weight: 600;
  border-left: 4px solid transparent;
  transition: 0.2s;
  &:hover {
    background-color: #2d72d9;
    color: white;
    cursor: pointer;
    border-left: 4px solid white;
    padding-left: 14px;
  }
`;

const shake = keyframes`
  0% {
    transform: rotate(0deg);
  }
  30% {
    transform: rotate(10deg) translateY(-2px);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  }
  60% {
    transform: rotate(-10deg) translateY(-2px);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
  }
  100% {
    transform: rotate(0deg) translateY(0px);
  }
`;

const PopcornContainer = styled.div``;

const WebsiteTitleContainer = styled.div`
  width: 153px;
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  margin-top: auto;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  &:hover {
    ${PopcornContainer} {
      animation: ${shake} 0.57s infinite alternate;
      animation-delay: 0.9s;
    }
  }

  &:hover {
    cursor: default;
  }
  @media (max-width: 632px) {
    top: 18px;
  }
`;

const WebsiteTitle = styled.h1`
  margin: 0;
  margin-right: 12px;
  color: white;
  letter-spacing: 0px;
  font-weight: 500;
  user-select: none;
  &:hover {
    cursor: pointer;
  }
`;

const IconSection = styled.div`
  margin-left: auto;
  margin-right: 30px;
  display: flex;
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  cursor: default;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const InputContainer = styled.form`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  transition: all 0.3s;
  border-radius: 10em;
  background-color: ${({ inputOpen }) =>
    inputOpen ? "rgb(12, 12, 12)" : "#17181b"};
`;

const HeartIconContainer = styled.button`
  filter: invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%)
    contrast(83%);
  transition: 0.3s ease;
  margin: 0px 12px;
  margin-bottom: 1.2px;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover,
  &:focus {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
`;

const AboutIconContainer = styled.button`
  filter: invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%)
    contrast(83%);
  transition: 0.3s ease;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover,
  &:focus {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
`;
