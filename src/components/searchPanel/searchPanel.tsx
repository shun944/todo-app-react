import React from 'react';
import './searchPanel.css';
import useTodos from '../../hooks/useTodos';
import { searchTodoRequest } from '../../models/Todo';

const SearchPanel = () => {
  const [searchText, setSearchText] = React.useState('');
  const [textSearchType, setTextSearchType] = React.useState('title');
  const { todos, loading, error, searchTodo } = useTodos();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('searching...');
    console.log(searchText);
    console.log(textSearchType);
    const searchRequest = createSearchRequest(searchText, textSearchType);
    searchTodo(searchRequest);
    console.log('search result -> ',todos);
  }

  const handleTextChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }

  const handleSearchTypeChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearchType(e.target.value);
  }

  return (
    <div className="search-panel">
      <form onSubmit={handleSearch}>
        <div className="text-search-area">
        <input type="text" placeholder="Search..." onChange={handleTextChange()}/>
          <div>
            <input type="radio" id="titleSearch" name="textSearchType" 
            value="title" onChange={handleSearchTypeChange()} defaultChecked />
            <label htmlFor="titleSearch">Title</label>
            <input type="radio" id="descriptionSearch" name="textSearchType"
            value="description" onChange={handleSearchTypeChange()} />
            <label htmlFor="descriptionSearch">Description</label>
          </div>
        </div>
        <br />
        <button className="search-submit" type="submit">Search</button>
      </form>
    </div>
  );
};

//like private method
const createSearchRequest = (searchText: string, textSearchType: string): searchTodoRequest => {
  const searchRequest: searchTodoRequest = {};
  if (textSearchType === 'title') {
    searchRequest.title = searchText;
  } else if (textSearchType === 'description') {
    searchRequest.description = searchText;
  }
  return searchRequest;
}

export default SearchPanel;