import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import QuickActions from './QuickActions';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('QuickActions', () => {
  const actions = [
    { title: 'Test Action', path: '/test', icon: <span data-testid="icon">Icon</span>, color: '#000' }
  ];
  const theme = createTheme();

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows loading indicator and feedback on click', async () => {
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <QuickActions actions={actions} />
        </MemoryRouter>
      </ThemeProvider>
    );

    const actionButton = screen.getByText('Test Action');
    fireEvent.click(actionButton);

    // CircularProgress shown during loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Advance timers to resolve loading and show snackbar
    act(() => {
      jest.advanceTimersByTime(800);
    });

    await waitFor(() => {
      expect(screen.getByText(/Navigating to Test Action/)).toBeInTheDocument();
    });
  });
});