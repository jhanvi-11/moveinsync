import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useApp } from '../../state/AppContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export const RoleSwitcher = () => {
  const { state, dispatch } = useApp();
  const theme = useTheme();
  
  if (!state || !state.vendors) return null;

  const currentVendor = state.vendors.find(v => v.id === state.currentVendorId);

  return (
    <Box>
      <div aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
        {currentVendor ? `Current role: ${currentVendor.name}` : ''}
      </div>
      <Autocomplete
        size="small"
        disableClearable
        options={state.vendors}
        getOptionLabel={(option) => `${option.name} (${option.level})`}
        value={currentVendor || null}
        onChange={(event, newValue) => {
          if (newValue) {
            dispatch({ type: 'SWITCH_VENDOR', payload: newValue.id });
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select Role"
            sx={{ 
              width: 250, 
              bgcolor: 'background.paper', 
              borderRadius: 1 
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box key={key} component="li" {...otherProps} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="body1">{option.name}</Typography>
              <Typography variant="caption" sx={{ color: theme.palette.vendorAccents[option.level] }}>
                {option.level.toUpperCase()}
              </Typography>
            </Box>
          );
        }}
      />
    </Box>
  );
};
