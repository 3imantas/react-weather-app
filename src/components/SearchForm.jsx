// SearchForm.jsx
import React from 'react';
import SearchIcon from '../images/SearchIcon';

function SearchForm({ text, setText, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => setText(e.target.value)} type="text" placeholder="Search places" value={text} required />
      <button type="submit" className="search-button">
        <SearchIcon />
      </button>
    </form>
  );
}

export default SearchForm;
