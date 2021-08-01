import Link from "next/link";
import ImageLoader from "./common/imageLoader";
import ResponsiveHeader from "./responsiveHeader";
import styled from "styled-components";

const Header = (props) => {
  return (
    <Container>
      <LeftContainer>dropdowns</LeftContainer>
      <Link href="/">
        <MiddleContainer>
          <Title>My Movie Favourites</Title>
          <ImageLoader
            src="https://chpistel.sirv.com/Images/popcorn-icon.png?w=60"
            alt="popcorn"
            width="36px"
            placeholderSize="100%"
            hover={true}
          />
        </MiddleContainer>
      </Link>
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
  display: flex;
  flex-direction: row;
  align-items: center;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.h1`
  margin-right: 12px;
  letter-spacing: 0px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
