import React, { useEffect, useState } from "react";
import genreIcons from "../../assets/genres";
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  Rating,
} from "@mui/material";
import {
  Movie as MovieIcon,
  PlayArrow,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from "@mui/icons-material";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import {
  useGetRecommendationsQuery,
  useGetMovieQuery,
  useGetListQuery,
} from "../../services/TMDB";
import axios from "axios";
import useStyles from "./styles";
import MovieList from "../MoviesList/MoviesList";
import { userSelector } from "../../features/auth";
import { green, orange, pink, red } from "@mui/material/colors";

const MovieInformation = () => {
  const { id } = useParams();
  const classes = useStyles();
  const { user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);
  // const isMovieFavorited = false;
  // const isMovieWatchListed = false;

  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: recommendations } = useGetRecommendationsQuery({
    list: "/recommendations",
    movie_id: id,
  });
  const { data: favoriteMovies } = useGetListQuery({
    listName: "favorite/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });
  const { data: watchlistMovies } = useGetListQuery({
    listName: "watchlist/movies",
    accountId: user.id,
    sessionId: localStorage.getItem("session_id"),
    page: 1,
  });

  useEffect(() => {
    setIsMovieFavorited(
      !!favoriteMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(
      !!watchlistMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        favorite: !isMovieFavorited,
      }
    );
    setIsMovieFavorited((prev) => !prev);
  };
  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem("session_id")}`,
      {
        media_type: "movie",
        media_id: id,
        watchlist: !isMovieWatchlisted,
      }
    );
    setIsMovieWatchlisted((prev) => !prev);
  };
  // console.log(recommendations);

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
        <Link to="/">______Somethongs Gone Worgs Go Back______</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid
        item
        sm={12}
        lg={4}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h4" align="center" gutterBottom>
          {data?.title}
        </Typography>
        <Typography color="GrayText" variant="h6" align="center" gutterBottom>
          <span style={{ color: "#666", fontSize: "14px" }}>RelaseDate : </span>
          {data.release_date}
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data.vote_average / 2} />
            <Typography
              gutterBottom
              variant="subtitle1"
              style={{ marginLeft: "10px" }}
            >
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}min | {data?.spoken_languages[0].name}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link
              className={classes.links}
              key={genre.name}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                alt={data.title}
                className={classes.genreImage}
                height={30}
              />
              <Typography color="textPrimary" variant="subtitle1">
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
          Overview
        </Typography>
        <Typography style={{ marginBotton: "2rem" }}>
          {data?.overview}
        </Typography>
        <Typography margin="15px 0" variant="h5" gutterBottom>
          Top Billed Cast
        </Typography>
        <Grid item container spacing={2}>
          {data &&
            data?.credits?.cast
              ?.map(
                (character, i) =>
                  character.profile_path && (
                    <Grid
                      key={i}
                      item={4}
                      md={2}
                      style={{ textDecoration: "none" }}
                      component={Link}
                      to={`/actors/${character.id}`}
                    >
                      <img
                        className={classes.castImage}
                        src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                        alt={character.name}
                      />
                      <Typography color="textPrimary">
                        {character.name}
                      </Typography>
                      <span style={{ color: "grey", fontSize: "12px" }}>
                        {character.character.split("/")[0]}
                      </span>
                    </Grid>
                  )
              )
              .slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: "2rem" }}>
          <div className={classes.buttonContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  target="_blank"
                  rel="noopene noreffer"
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  Website
                </Button>
                <Button
                  target="_blank"
                  rel="noopene noreffer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                <Button
                  href="#"
                  endIcon={<PlayArrow />}
                  onClick={() => setOpen(true)}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button
                  onClick={addToFavorites}
                  endIcon={
                    isMovieFavorited ? (
                      <FavoriteBorderOutlined sx={{ color: orange[300] }}/>
                    ) : (
                      <Favorite sx={{ color: orange[500] }} />
                    )
                  }
                >
                  {isMovieFavorited ? "Unfavorite" : "Favorite"}
                </Button>
                <Button
                  onClick={addToWatchlist}
                  endIcon={isMovieWatchlisted ? <Remove sx={{ color: red[300] }}/> : <PlusOne sx={{ color: green[900] }}/>}
                >
                  {isMovieWatchlisted ? "Remove" : "Watchlist"}
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: "primary.main" }}
                  color="warning"
                >
                  <Typography
                    component={Link}
                    to="/"
                    color="inherit"
                    variant="subtitle2"
                    style={{ textDecoration: "none" }}
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" align="center" gutterBottom>
          You might also likes
        </Typography>
        {recommendations ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box>Sorry! nothing found.</Box>
        )}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
          <iframe
            title="Trailers"
            autoPlay
            className={classes.video}
            frameBorder="0"
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
