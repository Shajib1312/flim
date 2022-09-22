import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStyles from "./styles";
import {
  useGetActorQuery,
  useGetMoviesByActorIdQuery,
} from "../../services/TMDB";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { ArrowBack, Movie as MovieIcon } from "@mui/icons-material";
import MovieList from "../MoviesList/MoviesList";
import {Pagination} from "..";
const Actors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();
  // const page = 1;
  // console.log(id);
  const [page, setPage] = useState(1)
  const { data, isFetching, error } = useGetActorQuery(id);
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page });

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }
  // console.log(data);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4}>
          <img
            className={classes.image}
            src={`https://image.tmdb.org/t/p/w780/${data.profile_path}`}
            alt={data.name}
          />
        </Grid>
        <Grid
          item
          lg={7}
          xl={8}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="h3" gutterBottom>
            {data?.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <span style={{ color: "grey", fontSize: "14px" }}>Born:</span>{" "}
            {new Date(data?.birthday).toDateString()}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <span style={{ color: "grey", fontSize: "14px" }}>
              Place of Birth:{" "}
            </span>{" "}
            {data?.place_of_birth}
          </Typography>
          <Typography variant="h6" gutterBottom>
            <span style={{ color: "grey", fontSize: "14px" }}>
              popularity:{" "}
            </span>{" "}
            {data?.popularity} points
          </Typography>
          <Typography variant="body1" align="justify" paragraph>
            <Typography variant="h6" gutterBottom>
              Biography
            </Typography>
            {data?.biography || "Sorry, no biography yet..."}
          </Typography>
          <Box className={classes.btns}>
            <Button
              variant="contained"
              color="primary"
              target="_blank"
              href={`https://www.imdb.com/name/${data?.imdb_id}`}
              startIcon={<MovieIcon />}
            >
              IMDB Profile
            </Button>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              color="warning"
            >
              Back
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom>
          Actor also Act
        </Typography>
        {movies && <MovieList movies={movies} numberOfMovies={12} />}
        <Pagination
        currentPage={page}
        setPage={setPage}
        totalPages={movies?.total_pages}
      />
      </Box>
    </>
  );
};

export default Actors;
