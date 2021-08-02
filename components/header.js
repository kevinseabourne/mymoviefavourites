import Link from "next/link";
import { useState, useEffect, useRef, useContext } from "react";
import AppContext from "../context/appContext";
import styled from "styled-components";
// import { Tooltip, OverlayTrigger } from "react-bootstrap";
// import Fade from "react-reveal/Fade";
import { useForm } from "react-hook-form";
import ResponsiveHeader from "./responsiveHeader";
import ImageLoader from "../components/common/imageLoader";
import carrotIcon from "../public/icons/carret-down-icon.svg";
import searchIcon from "../public/icons/search-icon.svg";
import heartIcon from "../public/icons/heart_icon.svg";
import infoIcon from "../public/icons/info-circle-icon.svg";

const Header = (props) => {
  const { genres: genresData } = useContext(AppContext);
  const genreDropdownRef = useRef(null);
  const sortByDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const [genreDropdownOpen, setGenreDropdownOpen] = useState(false);
  const [genres, setGenres] = useState([]);
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
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    setGenres(genresData);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setInputOpen(false);
    }
  };

  const onSubmit = (query) => {};

  const handleInputOpen = () => {
    searchRef.current.focus();
    setInputOpen(!inputOpen);
  };

  const handleGenreDropdown = () => {
    setGenreDropdownOpen(!genreDropdownOpen);
  };

  const handleSortByDropdown = () => {
    setSortByDropdownOpen(!sortByDropdownOpen);
  };

  const {
    onGenreSelect,
    onSortBySelection,
    handleFavouritesPageSelection,
    allFavMovies,
    FavouritesSectionOpen,
    onChange,
  } = props;

  return (
    <Container>
      <FilterSection>
        <Link href="/">
          <MoviesLabel>Movies</MoviesLabel>
        </Link>
        {FavouritesSectionOpen ? (
          <FavouritesCounter>{allFavMovies.length}</FavouritesCounter>
        ) : (
          <GenreContainer ref={genreDropdownRef} onClick={handleGenreDropdown}>
            <DropdownTitle>Genre</DropdownTitle>
            <SelectedDropdownValue>{selectedGenre}</SelectedDropdownValue>
            <CarrotIconContainer>
              <CarrotIconPlaceholder />
              <CarrotIcon src={carrotIcon} />
            </CarrotIconContainer>
            {genreDropdownOpen && (
              <Dropdown>
                {genres.map((genre) => (
                  <DropdownItem
                    key={genre.id}
                    onClick={() => {
                      setSelectedGenre(genre.name);
                      onGenreSelect(genre);
                    }}
                  >
                    {genre.name}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </GenreContainer>
        )}

        {!FavouritesSectionOpen && (
          <SortByContainer
            ref={sortByDropdownRef}
            onClick={handleSortByDropdown}
          >
            <DropdownTitle>Sort By</DropdownTitle>
            <SelectedDropdownValue>{selectedSortBy}</SelectedDropdownValue>
            <CarrotIconContainer>
              <CarrotIconPlaceholder />
              <CarrotIcon src={carrotIcon} />
            </CarrotIconContainer>

            {sortByDropdownOpen && (
              <Dropdown>
                {sortByOptions.map((option) => (
                  <DropdownItem
                    key={sortByOptions.indexOf(option)}
                    onClick={() => {
                      setSelectedSortBy(option);
                      onSortBySelection(option);
                    }}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </SortByContainer>
        )}
      </FilterSection>
      <Link href="/">
        <WebsiteTitleContainer>
          <WebsiteTitle>Movies</WebsiteTitle>
          <ImageLoader
            src={"https://chpistel.sirv.com/Images/popcorn-icon.png?w=60"}
            width="36px"
            placeholderSize="100%"
            alt="popcorn-icon"
            hover={true}
          />
        </WebsiteTitleContainer>
      </Link>

      <IconSection>
        <InputContainer onSubmit={handleSubmit(onSubmit)} inputOpen={inputOpen}>
          <SearchIconContainer onClick={handleInputOpen}>
            <ImageLoader
              src={searchIcon}
              width="22px"
              placeholderSize="70%"
              alt="searchIcon-icon"
              hover={true}
            />
          </SearchIconContainer>
          <Input
            name="SearchInput"
            placeholder="Search..."
            ref={(e) => {
              // register(e);
              searchRef.current = e; // you can still assign to ref
            }}
            onChange={(e) => onChange(e.currentTarget.value)}
            inputOpen={inputOpen}
          />
        </InputContainer>
        <Link href="/favourites">
          <HeartIconContainer>
            <ImageLoader
              src={heartIcon}
              width="27px"
              placeholderSize="70%"
              alt="heart-icon"
              svgStartColor="invert(89%) sepia(7%) saturate(74%) hue-rotate(164deg) brightness(90%) contrast(87%);"
              hover={true}
            />
          </HeartIconContainer>
        </Link>
        <Link href="/about">
          <ImageLoader
            src={infoIcon}
            width="26px"
            placeholderSize="70%"
            alt="heart-icon"
            svgStartColor="invert(89%) sepia(7%) saturate(74%) hue-rotate(164deg) brightness(90%) contrast(87%);"
            hover={true}
          />
        </Link>
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
  z-index: 4;
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
`;

const CarrotIconPlaceholder = styled.div`
  width: 100%;
  padding-bottom: 56.25%;
`;

const CarrotIcon = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: all 0.3s;
  filter: invert(93%) sepia(7%) saturate(71%) hue-rotate(169deg) brightness(86%)
    contrast(87%);
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
    ${CarrotIcon} {
      filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
        brightness(102%) contrast(105%);
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
  &:hover {
    cursor: pointer;
    ${DropdownTitle} {
      color: white;
    }
    ${SelectedDropdownValue} {
    }
    ${CarrotIcon} {
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

const WebsiteTitleContainer = styled.div`
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

const SearchIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

const InputContainer = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  transition: all 0.3s;
  border-radius: 10em;
  background-color: ${({ inputOpen }) =>
    inputOpen ? "rgb(12, 12, 12)" : "#17181b"};
`;

const Input = styled.input`
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.4;
  outline: none;
  margin: 1px 0px;
  width: ${({ inputOpen }) => (inputOpen ? "253px" : "0px")};
  height: 27px;
  border: none;
  color: #c3c5c7;
  font-weight: 500;
  padding-left: ${({ inputOpen }) => (inputOpen ? "7px" : "0px")};
  overflow: hidden;
  background-color: ${({ inputOpen }) =>
    inputOpen ? "rgb(12, 12, 12)" : "#17181b"};
  border-radius: 10em;
  transition: all 0.3s;
`;

const HeartIconContainer = styled.div`
  margin: 0px 12px;
  margin-bottom: 2.2px;
`;
