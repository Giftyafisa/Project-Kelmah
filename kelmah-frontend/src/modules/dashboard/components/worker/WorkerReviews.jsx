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
  Divider,
  Rating
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';

const WorkerReviews = ({ reviews = [] }) => {
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <RateReviewIcon fontSize="large" sx={{ mr: 1, color: '#FFD700' }} />
          <Typography variant="h6">Reviews ({reviews.length})</Typography>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Rating value={parseFloat(averageRating)} precision={0.1} readOnly />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {averageRating} / 5
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {reviews.map((review, idx) => (
            <React.Fragment key={review.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>{review.reviewer.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1">{review.reviewer}</Typography>
                      <Rating value={review.rating} size="small" readOnly sx={{ ml: 1 }} />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  }
                />
              </ListItem>
              {idx < reviews.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default WorkerReviews;