import React, { useState } from "react";
import styles from "./Search.module.css";

const Search = (props) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  };

  const resetInputField = () => {
    setSearchValue("");
  };

  const callSearchFunction = (e) => {
    e.preventDefault();
    props.search(searchValue);
    resetInputField();
  };

  return (
    <form className={styles.search_container}>
      <input
        value={searchValue}
        onChange={handleSearchInputChanges}
        type="text"
        placeholder="Title"
        className={styles.input}
      />
      <input
        className={styles.button}
        onClick={callSearchFunction}
        type="submit"
        value="Search"
      />
    </form>
  );
};

export default Search;
