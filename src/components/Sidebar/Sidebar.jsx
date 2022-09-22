import { useTheme } from "@mui/styles";
import useStyles from "./styles";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetGenresQuery } from "../../services/TMDB.js";
import genreIcons from "../../assets/genres";
import { useDispatch, useSelector } from "react-redux";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import {
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";

const categoties = [
  { label: "Popular", value: "popular" },
  { label: "Top Rated", value: "top_rated" },
  { label: "Upcoming", value: "upcoming" },
];

const blueLogo =
  "https://fontmeme.com/permalink/220920/6ce3a52cab45a0c7adeffb63af0ee5e4.png";
const redLogo =
  "https://fontmeme.com/permalink/220920/1a6fb3bd86dc9a3fd73cb875f56497a4.png";

const Sidebar = ({ setMobileOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { data, isFetching } = useGetGenresQuery();
  // console.log(data)
  const dispatch = useDispatch();
  const { genreIdOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  // console.log(genreIdOrCategoryName);
  useEffect(() => {
    setMobileOpen(false);
  }, [genreIdOrCategoryName, setMobileOpen]);

  return (
    <>
      <Link to="/" className={classes.imageLink}>
        <img
          src={theme.palette.mode === "light" ? blueLogo : redLogo}
          alt="logo"
          className="classes.image"
        />
      </Link>
      <Divider />
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categoties.map(({ label, value }) => (
          <Link to="/" className={classes.links} key={value}>
            <ListItem
              onClick={() => dispatch(selectGenreOrCategory(value))}
              button
            >
              <ListItemIcon>
                <img
                  src={genreIcons[label.toLowerCase()]}
                  alt="genraImage"
                  className={classes.genraImage}
                  height={30}
                />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Genres</ListSubheader>
        {isFetching ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          data.genres.map(({ name, id }) => (
            <Link to="/" className={classes.links} key={name}>
              <ListItem
                onClick={() => dispatch(selectGenreOrCategory(id))}
                button
              >
                <ListItemIcon>
                  <img
                    src={genreIcons[name.toLowerCase()]}
                    alt="genraImage"
                    className={classes.genraImage}
                    height={30}
                  />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          ))
        )}
      </List>
    </>
  );
};

export default Sidebar;
