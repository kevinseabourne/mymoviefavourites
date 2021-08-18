import DynamicHead from "../components/common/dynamicHead";
import styled from "styled-components";
import ImageLoader from "../components/common/imageLoader";

const About = () => {
  return (
    <Container>
      <DynamicHead title="My Movie Favs | About" urlQuery="/about" />
      <Title>About</Title>
      <Description>
        Watch trailer's and favourite the movies you love. (Please note:
        favourite's limit is 300 movies and when clearing browser data. Your
        favourite's data may be deleted as is it stored in the browser) All data
        from this site is provided by the Movie DB.
      </Description>
      <ImageLoader
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
        alt="movie db logo"
        width="95px"
        priority={true}
        opacity={0}
        centerImage={true}
        duration={0.9}
      />
    </Container>
  );
};

export default About;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  padding: 0px 20px;
`;

const Title = styled.h1`
  margin-top: 80px;
  @media (max-width: 425px) {
    font-size: 1.9em;
  }
`;

const Description = styled.p`
  margin-top: 30px;
  margin-bottom: 70px;
  font-size: 18px;
  font-weight: 600;
  max-width: 820px;
  line-height: 1.8;
  @media (max-width: 1380px) {
    font-size: 1.12em;
  }
  @media (max-width: 425px) {
    width: 100%;
    font-size: 1em;
  }
`;
