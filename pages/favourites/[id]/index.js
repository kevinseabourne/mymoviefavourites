import MoviePage from "../../../components/common/moviePage";
import { useContext } from "react";
import AppContext from "../../../context/appContext";

const FavMoviePage = () => {
  const { handleFavouriteSelected, favouriteMovies } = useContext(AppContext);

  return (
    <MoviePage
      handleFavouriteSelected={handleFavouriteSelected}
      favouriteMovies={favouriteMovies}
    />
  );
};

export default FavMoviePage;
