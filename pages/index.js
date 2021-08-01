import { useState, useEffect, useContext } from "react";
import Movies from "../components/common/movies";
import AppContext from "../context/appContext";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function Home(props) {
  const { movies } = useContext(AppContext);
  return (
    <Container>
      <Movies movies={movies} />
    </Container>
  );
}

const Container = styled.div``;
