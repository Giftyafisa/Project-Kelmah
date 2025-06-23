import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, Avatar, ListItemText, Divider, Box, Skeleton, Tooltip } from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@mui/icons-material';
import { format } from 'date-fns';

// Currency formatter for Ghana Cedi
const currencyFormatter = new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' });

const TransactionsList = ({ transactions = [], loading = false, limit }) => {
  if (loading) {
    return (
      <Box role="status" aria-live="polite">
        {[...Array(limit || 3)].map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} aria-label="Loading transaction" />
        ))}
      </Box>
    );
  }

  const items = limit ? transactions.slice(0, limit) : transactions;
  // Empty state when no transactions
  if (!loading && items.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }} role="alert" aria-atomic="true">
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Recent Transactions
        </Typography>
        <Typography color="text.secondary">
          No transactions found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }} role="region" aria-labelledby="transactions-list-header">
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }} id="transactions-list-header">
        Recent Transactions
      </Typography>
      <List role="list" aria-label="Recent Transactions">
        {items.map((tx, idx) => (
          <React.Fragment key={tx.id}>
            <ListItem role="listitem">
              <ListItemIcon>
                <Tooltip title={tx.type === 'deposit' ? 'Money received' : 'Money spent'}>
                  <Avatar sx={{ bgcolor: tx.type === 'deposit' ? 'success.light' : 'error.light' }} aria-label={tx.type === 'deposit' ? 'Money received' : 'Money spent'}>
                    {tx.type === 'deposit' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </Avatar>
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={tx.title || tx.description}
                secondary={format(new Date(tx.date), 'd MMMM yyyy, hh:mm a')}
              />
              <Tooltip title={tx.type === 'deposit' ? 'Amount received' : 'Amount paid'}>
                <Typography color={tx.type === 'deposit' ? 'success.main' : 'error.main'} fontWeight="bold" aria-label={(tx.type === 'deposit' ? '+' : '-') + currencyFormatter.format(tx.amount)}>
                  {(tx.type === 'deposit' ? '+' : '-') + currencyFormatter.format(tx.amount)}
                </Typography>
              </Tooltip>
            </ListItem>
            {idx < items.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default TransactionsList; 