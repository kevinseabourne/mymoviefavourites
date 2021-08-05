import React from "react";
import styled, { keyframes } from "styled-components";

export const LoadingSpinner = React.forwardRef(({ marginTop }, ref) => (
  <Spinner marginTop={marginTop} ref={ref}>
    <CircleOutside />
    <CircleInside />
  </Spinner>
));

const clockwise = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const counterClockwise = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`;

const Spinner = styled.div`
  height: 67px;
  width: 67px;
  display: block;
  opacity: 0.8;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : "auto")};
  margin-bottom: auto;
  margin-left: auto;
  margin-right: auto;
`;

const CircleOutside = styled.div`
  background-color: rgba(0, 0, 0, 0);
  border: 6px solid rgba(0, 183, 229, 0.9);
  opacity: 0.9;
  border-top: 6px solid rgba(0, 0, 0, 0);
  border-left: 6px solid rgba(0, 0, 0, 0);
  border-radius: 50px;
  -webkit-box-shadow: 0 0 35px #2187e7;
  box-shadow: 0 0 35px #2187e7;
  width: 55px;
  height: 55px;
  margin-right: 0px;
  margin: 0 auto;
  -moz-animation: ${clockwise} 0.57s infinite linear;
  -webkit-animation: ${clockwise} 0.57s infinite linear;
`;

const CircleInside = styled.div`
  background-color: rgba(0, 0, 0, 0);
  border: 6px solid rgba(0, 183, 229, 0.9);
  opacity: 0.9;
  border-top: 6px solid rgba(0, 0, 0, 0);
  border-left: 6px solid rgba(0, 0, 0, 0);
  border-radius: 50px;
  -webkit-box-shadow: 0 0 15px #2187e7;
  box-shadow: 0 0 15px #2187e7;
  width: 28px;
  height: 28px;
  margin-left: 13px;
  position: relative;
  top: -53px;
  -moz-animation: ${counterClockwise} 0.57s infinite linear;
  -webkit-animation: ${counterClockwise} 0.57s infinite linear;
`;
