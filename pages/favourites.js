import Movies from "../components/common/movies";
import styled from "styled-components";

const Favourites = () => {
  const [favMovies, setFavMovies] = useState([]);
  return (
    <Container>
      <Movies movies={favMovies} />
    </Container>
  );
};

export default Favourites;

const Container = styled.div``;
