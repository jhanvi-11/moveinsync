import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export const ConfirmDialog = ({ open, title, content, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => (
  <Dialog open={open} onClose={onCancel} aria-modal="true">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="inherit">{cancelText}</Button>
      <Button onClick={onConfirm} color={isDangerous ? 'error' : 'primary'} variant="contained">{confirmText}</Button>
    </DialogActions>
  </Dialog>
);
