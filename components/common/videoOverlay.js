import { useRef, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import VideoLoader from "./videoLoader";
import { motion, AnimatePresence } from "framer-motion";

const VideoOverlay = ({
  showOverlay,
  closeOverlay,
  src,
  maxWidth,
  width,
  alt,
  borderRadius,
  placeholderSize,
  centerVideo,
}) => {
  const spinnerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current && videoRef.current.focus();
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (e) => {
    if (videoRef.current !== e.target) {
      closeOverlay();
    }
    if (spinnerRef.current && !spinnerRef.current.contains(e.target)) {
      closeOverlay();
    }
  };

  const closeOverlayWhileLoading = () => {
    closeOverlay();
  };

  const animation = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        duration: 0.7,
      },
    },
  };

  return (
    <AnimatePresence>
      {showOverlay && (
        <Container>
          <GlobalStyle showOverlay={showOverlay} />
          <Overlay
            data-testid="videoOverlay"
            variants={animation}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <VideoContainer
              ref={videoRef}
              maxWidth={maxWidth}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => {
                const escKey = e.key === 27 || e.keyCode === 27;
                if (escKey) {
                  closeOverlay();
                  e.target.blur();
                }
              }}
            >
              <VideoLoader
                src={src}
                maxWidth="inherit"
                alt={alt}
                borderRadius={borderRadius}
                width={width}
                placeholderSize={placeholderSize}
                centerVideo={centerVideo}
                lazyLoad={false}
                closeOverlayWhileLoading={closeOverlayWhileLoading}
              />
            </VideoContainer>
          </Overlay>
        </Container>
      )}
    </AnimatePresence>
  );
};

export default VideoOverlay;

const GlobalStyle = createGlobalStyle`
 body {
   overflow: ${({ showOverlay }) => (showOverlay ? "hidden" : "scroll")};
  }
`;

const Container = styled.div``;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(15, 15, 15, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
`;

const VideoContainer = styled(motion.div)`
  width: ${({ maxWidth }) => (maxWidth ? maxWidth : "100%")};
  &:focus:not(:focus-visible) {
    outline: none;
  }
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
