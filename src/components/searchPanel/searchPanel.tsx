import React from 'react';
import { useEffect } from 'react';
import './searchPanel.css';
import { searchTodoRequest } from '../../models/Todo';

import { TextField, Box, FormControlLabel } from '@mui/material';
import FormControl from '@mui/joy/FormControl';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Button from '@mui/material/Button';
import { Controller, useForm } from 'react-hook-form';

import { useAtom } from 'jotai';
import { 
  updatedFromDialogAtom, 
  checkedFromCardAtom, 
  createdFromDialogAtom 
} from '../../atomJotai';
interface SearchPanelProps {
  onSearch: (searchRequest: searchTodoRequest) => void;
}


const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch }) => {
  const updatedFromDialog = useAtom(updatedFromDialogAtom)[0];
  const createdFromDialog = useAtom(createdFromDialogAtom)[0];
  const checkedFromCard = useAtom(checkedFromCardAtom)[0];

  const { control, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (updatedFromDialog || createdFromDialog || checkedFromCard) {
      onSubmit(null);
    }
  }, [updatedFromDialog, createdFromDialog, checkedFromCard]);

  const onSubmit = (data: any) => {
    const searchRequest = createSearchRequest(data.searchText, data.searchType);
    onSearch(searchRequest);
  }

  return (
    <div className="search-panel">
      <div className="text-search-area">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Controller name="searchText" control={control} 
              defaultValue="" render={({ field }) => (
                <TextField {...field} id="searchText" label="Search"
                  type="searchText" size="small" error={!!errors.searchText}
                />
              )}
            />
            <Controller name="searchType" control={control}
              defaultValue="title" render={({ field }) => (
                <FormControl >
                  <RadioGroup {...field} component="div" defaultValue={field.value} name="radio-buttons-group"
                    orientation="horizontal"
                    sx={{ gap: 1, ml: 2 }}
                  >
                    {/* <Radio value="title" label="Title" variant="outlined" />
                    <Radio value="description" label="Description" variant="outlined" /> */}
                    <FormControlLabel value="title" control={<Radio />} label="Title" sx={{gap: 1}} />
                    <FormControlLabel value="description" control={<Radio />} label="Description" sx={{gap: 1}} />
                  </RadioGroup>
                </FormControl>
              )}
            />
            <Button type="submit" variant="contained">Search</Button>
          </Box>
        </form>
      </div>
      <br />
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