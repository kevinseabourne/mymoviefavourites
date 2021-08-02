import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import styled from "styled-components";
import { motion } from "framer-motion";
// import { LoadingSpinner } from "../loading-spinner";
// import { useInView } from "react-intersection-observer";
// import "intersection-observer";

const ImageLoader = ({
  src,
  srcSet,
  width,
  maxWidth,
  placeholderSize,
  placeholderColor,
  alt,
  itemId,
  keyValue,
  dataTestId,
  onClick,
  borderRadius,
  hover,
  duration,
  boxShadow,
  loadingSpinner, // true or false to show a loading spinner when the image is still loading
  centerImage,
  contentLoaded,
  handleOnLoadOutside,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  y,
  x,
  zIndex,
  blur,
  scale,
  opacity,
  delay,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // const { ref, inView } = useInView({
  //   triggerOnce: true,
  //   rootMargin: "150px 0px",
  // });

  const handleLoadComplete = () => {
    setIsLoaded(true);
    if (handleOnLoadOutside) {
      handleOnLoadOutside();
    }
  };

  const animation = {
    hidden: {
      opacity: opacity == undefined ? 0 : opacity,
      y: y ? y : 0,
      x: x ? x : 0,
      scale: scale == undefined ? 1 : scale,
      filter: blur ? `blur(${blur}px)` : `blur(0px)`,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: `blur(0px)`,
      transition: {
        type: "spring",
        duration: duration ? duration : undefined,
        delay: delay ? delay : 0,
      },
    },
  };

  return (
    <ImageContainer
      borderRadius={borderRadius}
      width={width}
      hover={hover}
      maxWidth={maxWidth}
      centerImage={centerImage}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      variants={animation}
      initial="hidden"
      animate={isLoaded ? "show" : "hidden"}
    >
      <Placeholder
        layout
        borderRadius={borderRadius}
        onClick={onClick}
        contentLoaded={contentLoaded}
        zIndex={zIndex}
        placeholderSize={placeholderSize}
        placeholderColor={placeholderColor}
      />
      {src && (
        <Image
          src={src}
          alt={alt}
          onLoadingComplete={handleLoadComplete}
          objectFit="fill"
          layout="fill"
        />
      )}
      {/* {loadingSpinner && !isLoaded && <LoadingSpinner size="39px" />} */}
    </ImageContainer>
  );
};

export default ImageLoader;

const ImageContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "100%")};
  width: ${({ width }) => (width ? width : "100%")};
  position: relative;
  background: transparent;
  margin: ${({ centerImage }) => (centerImage ? "auto" : "none")};
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : "none")};
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? marginBottom : "none"};
  margin-left: ${({ marginLeft }) => (marginLeft ? marginLeft : "none")};
  margin-right: ${({ marginRight }) => (marginRight ? marginRight : "none")};
  z-index: ${({ hoverColor }) => (hoverColor ? "auto" : "0")};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : "0px")};
  overflow: ${({ src }) => (src ? "default" : "hidden")};
  &:hover {
    cursor: ${({ hover }) => (hover ? "pointer" : "default")};
  }
`;

const Placeholder = styled(motion.div)`
  width: 100%;
  z-index: ${({ zIndex }) => (zIndex ? zIndex : "2")};
  padding-bottom: ${({ placeholderSize }) =>
    placeholderSize ? placeholderSize : "100%"};
  background: ${({ placeholderColor }) =>
    placeholderColor ? placeholderColor : "transparent"};
  border-radius: ${({ borderRadius }) => (borderRadius ? borderRadius : "0px")};
  box-sizing: border-box;
  border: 3.4px solid transparent;
`;
