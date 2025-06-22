import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationsPanel = ({ notifications = [] }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <NotificationsIcon fontSize="large" sx={{ mr: 1, color: '#FFD700' }} />
        <Typography variant="h6">Notifications ({notifications.length})</Typography>
      </Box>
      <List>
        {notifications.map((n, idx) => (
          <React.Fragment key={n.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar>
                  <NotificationsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={n.message} secondary={n.time} />
            </ListItem>
            {idx < notifications.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default NotificationsPanel;