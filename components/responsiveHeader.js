import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import Input from "./common/input";
import styled, { createGlobalStyle } from "styled-components";
import ImageLoader from "../components/common/imageLoader";
import heartIcon from "../public/icons/heart_icon.svg";
import infoIcon from "../public/icons/info-circle-icon.svg";

const ResponsiveHeader = ({ handleRouteChange, onSubmit }) => {
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const timeout = useRef(null);

  const [inputOpen, setInputOpen] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { register, handleSubmit, watch, setFocus, setValue } = useForm();

  const burgerSearchInputValue = watch("burgerSearch");

  const handleClickOutside = (e) => {
    if (e.target !== burgerRef.current && !e.target === menuRef.current) {
      setBurgerOpen(false);
      inputOpen && closeAndClearBurgerInput();
    }
  };

  // ------------------------ Form ------------------------ //

  const closeHeaderAndSubmit = (query) => {
    const { burgerSearch } = query;
    if (burgerSearch) {
      closeAndClearBurgerInput();
      setBurgerOpen(false);

      // allow closing animation to finish to avoid lag
      const search = { search: burgerSearch };
      timeout.current = setTimeout(() => onSubmit(search), 900);
    }
  };

  const handleBurgerClick = () => {
    inputOpen && closeAndClearBurgerInput();

    const time = inputOpen ? 400 : 0;
    timeout.current = setTimeout(() => {
      setBurgerOpen(!burgerOpen);
    }, time);
  };

  const handleInputOpen = () => {
    // tried to use !input with state update bug did not work
    if (!inputOpen) {
      setInputOpen(true);
      setFocus("burgerSearch");
    }
    if (inputOpen) {
      setValue("burgerSearch", "");
      setInputOpen(false);
    }
  };

  const closeAndClearBurgerInput = () => {
    setInputOpen(false);
    setValue("burgerSearch", "");
  };

  const clearInputAndFocus = () => {
    setValue("burgerSearch", "");
    setFocus("burgerSearch");
  };

  const handleRouteChangeWithOpenInput = (route) => {
    closeAndClearBurgerInput();

    // if the input is open delay the page change to allow the animation to finish
    const time = inputOpen ? 400 : 0;
    timeout.current = setTimeout(() => {
      handleBurgerClick();
      handleRouteChange(route);
    }, time);
  };

  const dropDownAnimation = {
    hidden: {
      opacity: 0,
      transition: {
        staggerDirection: -1,

        staggerChildren: 0.3,

        delay: 1.18,
      },
    },
    show: {
      opacity: 1,
      transition: {
        staggerDirection: 1,
        staggerChildren: 0.05,
      },
    },
  };

  const buttonsAnimation = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    show: {
      opacity: 1,
      scale: 1,
    },
  };

  return (
    <Container>
      <GlobalStyle burgerOpen={burgerOpen} />
      <BurgerContainer onClick={handleBurgerClick} aria-label="header">
        <Burger ref={burgerRef} value={burgerOpen} id="burgerOpen">
          <BurgerInner burgerOpen={burgerOpen} />
        </Burger>
      </BurgerContainer>
      <AnimatePresence>
        {burgerOpen && (
          <Dropdown
            burgerOpen={burgerOpen}
            ref={menuRef}
            variants={dropDownAnimation}
            initial="hidden"
            animate={burgerOpen ? "show" : "hidden"}
            exit="hidden"
          >
            <Form
              variants={buttonsAnimation}
              onSubmit={handleSubmit(closeHeaderAndSubmit)}
            >
              <Input
                name="burgerSearch"
                inputOpen={inputOpen}
                onClick={handleInputOpen}
                searchInputValue={burgerSearchInputValue}
                register={register}
                clearInputAndFocus={clearInputAndFocus}
              />
            </Form>

            <HeartIconContainer
              variants={buttonsAnimation}
              onClick={() => handleRouteChangeWithOpenInput("/favourites")}
            >
              <ImageLoader
                src={heartIcon}
                width="24px"
                placeholderSize="100%"
                alt="heart"
                hover={true}
                priority={true}
              />
            </HeartIconContainer>

            <AboutIconContainer
              onClick={() => handleRouteChangeWithOpenInput("/about")}
              variants={buttonsAnimation}
            >
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
          </Dropdown>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ResponsiveHeader;

const GlobalStyle = createGlobalStyle`
 body {
   overflow: ${({ burgerOpen }) =>
     burgerOpen ? "hidden !important" : "scroll"};
   overscroll-behavior: none;
  }
`;

const Container = styled(motion.div)`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const BurgerContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-top: 17px;
  padding-bottom: 37px;
  padding-left: 27px;
  padding-right: 34px;
  position: absolute;
  bottom: 18px;
  right: 30px;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  @media (max-width: 632px) {
    bottom: 9px;
  }
`;

const Burger = styled.div`
  display: inline-block;
  position: absolute;
  width: 20px;
  height: 0px;
  margin-left: auto;
  z-index: 6;
  &:hover {
    cursor: pointer;
  }
`;

const BurgerInner = styled.div`
  position: absolute;
  width: 30px;
  height: 3px;
  transition-timing-function: ease;
  transition-duration: 0.15s;
  transition-property: transform;
    border-radius: 12px;
  background-color: #f5f5eb;
  transform: ${({ burgerOpen }) =>
    burgerOpen
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
    width: 30px;
    height: 3px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform;
      border-radius: 12px;
    background-color: #f5f5eb;
        opacity: ${({ burgerOpen }) => (burgerOpen ? 0 : 1)}
  };
  &::after {
    top: 18px;
    display: block;
    content: "";
    position: absolute;
    width: 30px;
    height: 3px;
    transition-timing-function: ease;
    transition-duration: 0.15s;
    transition-property: transform;
    border-radius: 12px;
    background-color: #f5f5eb;
    bottom: -10px;
    background-color: #f5f5eb;
    transform: ${({ burgerOpen }) =>
      burgerOpen
        ? `translate3d(0,-18px, 0) rotate(-90deg)`
        : `translate3d(0, 0px, 0) rotate(0deg)`}
  };
`;

const Dropdown = styled(motion.div)`
  height: calc(100% - 80px);
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  justify-content: space-around;
  background-color: #17181b;
  width: 100%;
  box-shadow: 0px 6px 8px -4px rgba(0, 0, 0, 0.9);
  z-index: 1;
  padding: 60px 0px;
  box-sizing: border-box;
  margin-left: auto;
  left: 0;
`;

const Form = styled(motion.form)`
  padding: 0px 20px;
  box-sizing: border-box;
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const HeartIconContainer = styled(motion.button)`
  filter: invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%)
    contrast(83%);
  transition: 0.3s ease;
  margin: 0px 12px;
  margin-bottom: 1.2px;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
`;

const AboutIconContainer = styled(motion.button)`
  filter: invert(93%) sepia(6%) saturate(90%) hue-rotate(169deg) brightness(88%)
    contrast(83%);
  transition: 0.3s ease;
  &:focus:not(:focus-visible) {
    outline: none;
  }
  &:hover {
    filter: invert(98%) sepia(2%) saturate(0%) hue-rotate(213deg)
      brightness(102%) contrast(105%);
  }
`;
