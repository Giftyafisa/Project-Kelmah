import React from 'react';
import { Container, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>Something went wrong.</Typography>
          <Typography variant="body1" paragraph>{this.state.error?.toString()}</Typography>
          <Button variant="contained" onClick={this.handleReset}>Reload</Button>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;