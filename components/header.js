import Image from "next/image";
import styled from "styled-components";
import ResponsiveHeader from "./responsiveHeader";

const Header = (props) => {
  return (
    <Container>
      <LeftContainer>dropdowns</LeftContainer>
      <MiddleContainer>
        <Title>Movies</Title>
        {/* <Image /> */}
      </MiddleContainer>
      <RightContainer>right buttons</RightContainer>

      {/* {<ResponsiveHeader />} */}
    </Container>
  );
};

export default Header;

const Container = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  position: relative;
  box-sizing: border-box;
  padding: 0px 10px;
  width: 100%;
  height: 93px;
  background-color: #17181b;
  opacity: 0.97;
  box-shadow: 0px 6px 8px -4px rgb(0 0 0 / 90%);
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const MiddleContainer = styled.div`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Title = styled.h2``;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
