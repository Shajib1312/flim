import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
// import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { useGetMoviesQuery } from "../../services/TMDB.js";
import MoviesList from "../MoviesList/MoviesList.jsx";
import { Pagination } from "..";
import FeaturedMovie from "../FeaturedMovie/FeaturedMovie.jsx";

const Movies = () => {
  const lg = useMediaQuery((theme) => theme.breakpoints.only("lg"));
  const numberOfMovies = lg ? 17 : 19;

  const [page, setPage] = useState(1);
  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
  });
  // console.log(data)
  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="4rem" />
      </Box>
    );
  }
  if (!data.results.length) {
    return (
      <Box display="flex" mt="20px" alignItems="center">
        <Typography variant="h4">
          No Movies that match that name .<br />
          please Search Something else.
        </Typography>
      </Box>
    );
  }

  if (error) return "An error occurred";

  return (
    <div>
      <FeaturedMovie movie={data.results[Math.floor(Math.random())]} />
      <MoviesList numberOfMovies={numberOfMovies} excludeFirst movies={data} />
      <Pagination
        currentPage={page}
        setPage={setPage}
        totalPages={data?.total_pages}
      />
    </div>
  );
};

export default Movies;
