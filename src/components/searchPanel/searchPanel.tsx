import React from 'react';
import { useEffect } from 'react';
import './searchPanel.css';
import useTodos from '../../hooks/useTodos';
import { searchTodoRequest } from '../../models/Todo';
import { Todo } from '../../models/Todo';

import Textarea from '@mui/joy/Textarea';
import FormControl from '@mui/joy/FormControl';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Button from '@mui/material/Button';

import { useRecoilState } from 'recoil';
import {
  updatedFromDialogAtom,
  checkedFromCardAtom,
  createdFromDialogAtom
} from '../../atom';

interface SearchPanelProps {
  // onSearch: (todos: Todo[]) => void;
  onSearch: (searchRequest: searchTodoRequest) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = React.useState('');
  const [textSearchType, setTextSearchType] = React.useState('title');
  const { todos, loading, error, searchTodo } = useTodos();

  const updatedFromDialog = useRecoilState(updatedFromDialogAtom)[0];
  const createdFromDialog = useRecoilState(createdFromDialogAtom)[0];
  const checkedFromCard = useRecoilState(checkedFromCardAtom)[0];

  useEffect(() => {
    if (updatedFromDialog || createdFromDialog || checkedFromCard) {
      handleSearch(null);
    }
  }, [updatedFromDialog, createdFromDialog, checkedFromCard]);

  const handleSearch = async (e: React.FormEvent | null) => {
    if (e) {
      e.preventDefault();
    }
    const searchRequest = createSearchRequest(searchText, textSearchType);
    //await searchTodo(searchRequest);
    //onSearch(todos);
    onSearch(searchRequest);
  }

  const handleTextChange = () => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchText(e.target.value);
  }

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextSearchType(e.target.value);
  }

  return (
    <div className="search-panel">
      <form onSubmit={handleSearch}>
        <div className="text-search-area">
          <div>
            <Textarea id="password" placeholder='Search...' onChange={handleTextChange()}/>
          </div>
          <FormControl>
            <RadioGroup component="div" defaultValue="title" name="radio-buttons-group"
              orientation="horizontal"
              sx={{ gap: 1 }}
            >
              <Radio value="title" label="Title" variant="outlined" onChange={handleSearchTypeChange} />
              <Radio value="description" label="Description" variant="outlined" onChange={handleSearchTypeChange} />
            </RadioGroup>
          </FormControl>
        </div>
        <br />
        {/* <button className="search-submit" type="submit">Search</button> */}
        <Button type="submit" variant="contained">Search</Button>
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