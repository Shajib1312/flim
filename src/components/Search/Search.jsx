import { SearchOutlined } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { searchMovie } from "../../features/currentGenreOrCategory";
import useStyles from "./styles";
const Search = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      dispatch(searchMovie(query));
    }
  };
  if(location.pathname !== '/') return null;
  return (
    <div className={classes.searchContainer}>
      <TextField
        onKeyPress={handleKeyPress}
        value={query}
        placeholder="search..."
        onChange={(e) => setQuery(e.target.value)}
        variant="standard"
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default Search;
