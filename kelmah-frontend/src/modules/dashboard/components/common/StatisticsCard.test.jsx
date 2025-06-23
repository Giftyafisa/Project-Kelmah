import React from 'react';
import { render, screen } from '@testing-library/react';
import StatisticsCard from './StatisticsCard';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('StatisticsCard', () => {
  const theme = createTheme();

  it('renders title and value', () => {
    render(
      <ThemeProvider theme={theme}>
        <StatisticsCard title="Test Stats" value="123" color="#f00" icon={<span>Icon</span>} />
      </ThemeProvider>
    );
    expect(screen.getByText('Test Stats')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('wraps content in link when linkTo is provided', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MemoryRouter>
          <StatisticsCard title="Stats" value={0} icon={<span />} linkTo="/stats" />
        </MemoryRouter>
      </ThemeProvider>
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/stats');
  });
});