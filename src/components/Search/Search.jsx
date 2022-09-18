import { SearchOutlined } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchMovie } from "../../features/currentGenreOrCategory";
import useStyles from "./styles";
const Search = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [query, setQuery] = useState("");
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {

      dispatch(searchMovie(query));
    }
    // e.preventDefault();
  };
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
