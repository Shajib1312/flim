import alanBtn from "@alan-ai/alan-sdk-web";
import { useContext, useEffect } from "react";
import { fetchToken } from "../utils";
import { ColorModeContext } from "../utils/ToggleColorMode";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { searchMovie, selectGenreOrCategory } from "../features/currentGenreOrCategory";
const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    alanBtn({
      key: "d1fa75ed30d59b59a33fa1cc200757a82e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: ({ command, mode, genres, genreOrCategory ,query }) => {
        if (command === "chooseGenre") {
          const foundGenre = genres.find(
            (g) => g.name.toLowerCase() === genreOrCategory.toLowerCase()
          );
          if (foundGenre) {
            navigate("/");
            dispatch(selectGenreOrCategory(foundGenre.id));
          } else {
            const category = genreOrCategory.startsWith("top")
              ? "top_rated"
              : genreOrCategory;
            navigate("/");
            dispatch(selectGenreOrCategory(category));
          }
        } else if (command === "changeMode") {
          if (mode === "light") {
            setMode("light");
          } else {
            setMode("dark");
          }
        } else if (command === "login") {
          fetchToken();
        } else if (command === "logout") {
          localStorage.clear();
          window.location.href = "/";
        } else if (command === 'search') {
          dispatch(searchMovie(query));
        }
      },
    });
  }, [dispatch, navigate, setMode]);
};

export default useAlan;
