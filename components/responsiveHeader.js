import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import styled, { createGlobalStyle } from "styled-components";
import ImageLoader from "../components/common/imageLoader";
import { useForm } from "react-hook-form";
import searchIcon from "../public/icons/search-icon.svg";
import heartIcon from "../public/icons/heart_icon.svg";
import infoIcon from "../public/icons/info-circle-icon.svg";

const ResponsiveHeader = (props) => {
  const ref = useRef(null);
  const [burgerMenu, setBurgerMenu] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setBurgerMenu(false);
    }
  };

  const onSubmit = () => {};

  const handleBurgerClick = () => {
    setBurgerMenu(!burgerMenu);
  };

  const handleInputOpen = () => {
    setInputOpen(!inputOpen);
  };

  const { handleFavouritesPageSelection } = props;

  return (
    <Container>
      <GlobalStyle burgerMenu={burgerMenu} />
      <BurgerMenu
        value={burgerMenu}
        onClick={handleBurgerClick}
        id="burgerMenu"
        data-testid="burgerMenu"
      >
        <BurgerInner burgerMenu={burgerMenu} />
      </BurgerMenu>
      {burgerMenu && (
        <Dropdown burgerMenu={burgerMenu} ref={ref}>
          <InputContainer
            onClick={handleInputOpen}
            onSubmit={handleSubmit(onSubmit)}
            inputOpen={inputOpen}
          >
            <ImageLoader
              src={searchIcon}
              width="22px"
              placeholderSize="70%"
              alt="searchIcon-icon"
            />
            <Input
              name="SearchInput"
              label="Search..."
              // ref={register}
              inputOpen={inputOpen}
            />
          </InputContainer>
          <Link href="/favourites">
            <ImageLoader
              src={heartIcon}
              width="27px"
              placeholderSize="70%"
              alt="heart-icon"
              onClick={() => handleFavouritesPageSelection()}
            />
          </Link>
          <Link href="/about">
            <ImageLoader
              src={infoIcon}
              width="27px"
              placeholderSize="70%"
              alt="heart-icon"
            />
          </Link>
        </Dropdown>
      )}
    </Container>
  );
};

export default ResponsiveHeader;

const Container = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const BurgerMenu = styled.div`
  display: inline-block;
  position: absolute;
  bottom: 15px;
  right: 20px;
  width: 20px;
  height: 0px;
  padding: 40px;
  margin-left: auto;
  z-index: 6;
  &:hover {
    cursor: pointer;
  }
  @media (max-width: 632px) {
    bottom: 8px;
  }
`;

const BurgerInner = styled.div`
  position: absolute;
  width: 33px;
  height: 3px;
  transition-timing-function: ease;
  transition-duration: 0.15s;
  transition-property: transform;
  border-radius: 4px;
  background-color: #f5f5eb;
  transform: ${({ burgerMenu }) =>
    burgerMenu
      ? `translate3d(0, 10px, 0) rotate(45deg)`
      : `translate3d(0, 0px, 0) rotate(0deg)`}
  };
  &::before {
    display: block;
    content: "";
    top: 9px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform, opacity;
    position: absolute;
    width: 33px;
    height: 3px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform;
    border-radius: 4px;
    background-color: #f5f5eb;
        opacity: ${({ burgerMenu }) => (burgerMenu ? 0 : 1)}
  };
  &::after {
    top: 18px;
    display: block;
    content: "";
    position: absolute;
    width: 33px;
    height: 3px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform;
    border-radius: 4px;
    background-color: #f5f5eb;
    bottom: -10px;
    background-color: #f5f5eb;
    transform: ${({ burgerMenu }) =>
      burgerMenu
        ? `translate3d(0,-20px, 0) rotate(-90deg)`
        : `translate3d(0, 0px, 0) rotate(0deg)`}
  };
`;

const Dropdown = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #17181b;
  margin-top: 0px;
  min-width: 100%;
  box-shadow: 0px 6px 8px -4px rgba(0, 0, 0, 0.9);
  z-index: 10;
  margin-top: 1px;
  margin-left: auto;
  left: 0;
  transition: width 0.3s ease;
  height: ${({ burgerMenu }) => (burgerMenu ? "162px" : "0px")};
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

const GlobalStyle = createGlobalStyle`
 body {
   overflow: ${({ burgerMenu }) => (burgerMenu ? "hidden" : "scroll")};
  }
`;
