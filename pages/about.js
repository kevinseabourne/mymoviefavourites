import styled from "styled-components";

const About = () => {
  return (
    <Container>
      <Title>About</Title>
      <Description>
        Watch trailer's and save the movies you love. In the favourite's
        section, (Please note when clearing browser data. Your favourite's data
        may be deleted as is it stored in the browser) All data from this site
        is provided by the Movie DB.
      </Description>
    </Container>
  );
};

export default About;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin-top: 60px;
`;

const Description = styled.p`
  font-size: 18px;
  font-weight: 500;
  max-width: 840px;
  line-height: 1.8;
`;
