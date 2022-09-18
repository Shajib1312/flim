import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { useGetMoviesQuery } from "../../services/TMDB.js";
import MoviesList from "../MoviesList/MoviesList.jsx";

const Movies = () => {
  const [page, setPage] = useState(1)
  const { genreIdOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  const { data, error, isFetching } = useGetMoviesQuery({genreIdOrCategoryName,page});
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
      <MoviesList movies={data} />
    </div>
  );
};

export default Movies;
