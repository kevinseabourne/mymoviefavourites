import React, { useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import ImageLoader from "./imageLoader";
import searchIcon from "../../public/icons/search-icon.svg";
import crossIcon from "../../public/icons/cross.svg";

const Input = ({
  name,
  inputOpen,
  searchInputValue,
  onClick,
  onFocus,
  clearInputAndFocus,
  register,
}) => {
  const iconBoxAnimation = {
    hidden: {
      opacity: 0,
      rotate: 45,
      scale: 0.5,
    },
    show: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <InputContainer>
      <SearchIconContainer
        inputOpen={inputOpen}
        onClick={onClick}
        onFocus={onFocus}
        tabIndex="0"
      >
        <ImageLoader
          src={searchIcon}
          width="22px"
          placeholderSize="100%"
          alt="search"
          hover={true}
          priority={true}
        />
      </SearchIconContainer>
      <RealInput
        placeholder="Search..."
        {...register(name)}
        inputOpen={inputOpen}
        tabIndex={inputOpen ? "0" : "-1"}
      />
      <AnimatePresence>
        {inputOpen && searchInputValue && searchInputValue.length >= 1 && (
          <IconBox
            onClick={clearInputAndFocus}
            onKeyDown={({ keyCode }) => keyCode === 13 && clearInputAndFocus()}
            tabIndex="0"
            variants={iconBoxAnimation}
            initial="hidden"
            animate={
              searchInputValue && searchInputValue.length >= 1
                ? "show"
                : "hidden"
            }
            exit="hidden"
          >
            <ImageLoader
              src={crossIcon}
              width="15px"
              placeholderSize="100%"
              alt="cross"
              hover={true}
              priority={true}
              centerImage={true}
            />
          </IconBox>
        )}
      </AnimatePresence>
    </InputContainer>
  );
};

export default Input;

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  position: relative;
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const SearchIconContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 22px;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  filter: ${({ inputOpen }) =>
    inputOpen
      ? "invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg) brightness(102%) contrast(105%);"
      : "invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%) contrast(83%);"}
  transition: 0.3s ease;
  &:hover,
  &:focus {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
  @media (max-width: 1024px) {
      margin-left: 0px;
      width: 22px;
  }
`;

const RealInput = styled.input`
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.4;
  outline: none;
  margin: 1px 0px;
  width: ${({ inputOpen }) => (inputOpen ? "253px" : "0px")};
  padding-right: ${({ inputOpen }) => (inputOpen ? "38px" : "0px")};
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
  @media (max-width: 1024px) {
    height: 32px;
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const IconBox = styled(motion.div)`
  width: 40px;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0px;
  margin: auto;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 10em;
  border-bottom-right-radius: 10em;
  filter: invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%)
    contrast(83%);
  &:focus:not(:focus-visible) {
    outline: none;
  }
  @media (max-width: 1024px) {
    width: 40px;
  }
`;
