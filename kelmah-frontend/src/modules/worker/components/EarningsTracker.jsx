import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  LinearProgress
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/contexts/AuthContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const EarningsTracker = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingEarnings: 0,
    completedJobs: 0,
    averageEarnings: 0
  });
  const [timeRange, setTimeRange] = useState('month');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchEarnings();
  }, [timeRange]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const startDate = startOfMonth(subMonths(new Date(), getMonthsForRange(timeRange)));
      const endDate = endOfMonth(new Date());

      const response = await fetch(
        `/api/workers/${user.id}/earnings?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`
      );
      const data = await response.json();
      
      setEarnings(data.earnings);
      setSummary(data.summary);
      setChartData(data.chartData);
      setError(null);
    } catch (err) {
      setError('Failed to load earnings data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthsForRange = (range) => {
    switch (range) {
      case 'week':
        return 1;
      case 'month':
        return 1;
      case 'quarter':
        return 3;
      case 'year':
        return 12;
      default:
        return 1;
    }
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialogOpen = (earning) => {
    setSelectedEarning(earning);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedEarning(null);
  };

  const handleDownloadReceipt = async (earningId) => {
    try {
      const response = await fetch(`/api/workers/${user.id}/earnings/${earningId}/receipt`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${earningId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download receipt');
      console.error(err);
    }
  };

  const theme = useTheme(); // Ensure useTheme is imported

  const summaryCardSx = {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(212,175,55,0.1)',
    height: '100%'
  };

  const commonSelectStyles = {
    color: '#FFFFFF',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.3)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
    '& .MuiSvgIcon-root': { color: '#D4AF37' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
    '.MuiSelect-select': {paddingTop: '8px', paddingBottom: '8px'}
  };

  const menuItemStyles = {
    backgroundColor: '#1F1F1F',
    color: '#FFFFFF',
    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    '&.Mui-selected': {
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.3)' }
    }
  };

  const getStatusChipProps = (status) => {
    const s = status.toLowerCase();
    const commonStyles = { fontWeight: 'medium', color: '#000000' };
    if (s === 'completed') return { sx: { ...commonStyles, backgroundColor: '#81C784'} }; // Light Green
    if (s === 'pending') return { sx: { ...commonStyles, backgroundColor: '#FFB74D'} }; // Amber
    return { sx: { backgroundColor: '#9E9E9E', color: '#FFFFFF'} }; // Grey for others
  };


  const renderSummaryCards = () => (
    <Grid container spacing={2}> {/* Reduced spacing */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={summaryCardSx}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoneyIcon sx={{ color: '#D4AF37', mr: 1 }} />
              <Typography variant="subtitle1" sx={{color: '#B0B0B0'}}>Total Earnings</Typography>
            </Box>
            <Typography variant="h4" sx={{color: '#D4AF37', fontWeight: 'bold'}}>
              ${summary.totalEarnings.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={summaryCardSx}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <TrendingUpIcon sx={{ color: '#D4AF37', mr: 1 }} />
              <Typography variant="subtitle1" sx={{color: '#B0B0B0'}}>Monthly Earnings</Typography>
            </Box>
            <Typography variant="h4" sx={{color: '#D4AF37', fontWeight: 'bold'}}>
              ${summary.monthlyEarnings.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={summaryCardSx}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon sx={{ color: '#FFB74D', mr: 1 }} /> {/* Changed PendingIcon to AccessTimeIcon and color */}
              <Typography variant="subtitle1" sx={{color: '#B0B0B0'}}>Pending Earnings</Typography>
            </Box>
            <Typography variant="h4" sx={{color: '#FFB74D', fontWeight: 'bold'}}>
              ${summary.pendingEarnings.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={summaryCardSx}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon sx={{ color: '#81C784', mr: 1 }} /> {/* Changed CalendarIcon and color */}
              <Typography variant="subtitle1" sx={{color: '#B0B0B0'}}>Completed Jobs</Typography>
            </Box>
            <Typography variant="h4" sx={{color: '#81C784', fontWeight: 'bold'}}>
              {summary.completedJobs}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderEarningsChart = () => (
    <Paper sx={{ ...summaryCardSx, p: {xs:1, sm:2}, mb: 3, mt:2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{color: '#E0E0E0'}}>Earnings Trend</Typography>
        <FormControl size="small" variant="outlined">
          <InputLabel sx={{color: '#B0B0B0', '&.Mui-focused': {color: '#D4AF37'}}}>Period</InputLabel>
          <Select
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Period"
            sx={{ ...commonSelectStyles, minWidth: 120 }}
            MenuProps={{ PaperProps: { sx: { backgroundColor: '#2C2C2C' }}}}
          >
            <MenuItem value="week" sx={menuItemStyles}>Last Week</MenuItem>
            <MenuItem value="month" sx={menuItemStyles}>Last Month</MenuItem>
            <MenuItem value="quarter" sx={menuItemStyles}>Last Quarter</MenuItem>
            <MenuItem value="year" sx={menuItemStyles}>Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.2)" />
            <XAxis dataKey="date" tick={{ fill: '#B0B0B0' }} stroke="rgba(212,175,55,0.3)" />
            <YAxis tick={{ fill: '#B0B0B0' }} stroke="rgba(212,175,55,0.3)" />
            <ChartTooltip
                contentStyle={{backgroundColor: '#2C2C2C', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '4px'}}
                labelStyle={{color: '#D4AF37', fontWeight:'bold'}}
                itemStyle={{color: '#E0E0E0'}}
            />
            <Legend wrapperStyle={{color: '#B0B0B0'}}/>
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#D4AF37" // Gold line
              strokeWidth={2}
              dot={{ r: 4, fill: '#D4AF37' }}
              activeDot={{ r: 6, stroke: '#FFFFFF', fill: '#D4AF37' }}
              name="Earnings ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );

  const renderEarningsTable = () => (
    <Paper sx={{ ...summaryCardSx, p: {xs:1, sm:2} }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{color: '#E0E0E0'}}>Earnings History</Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={() => {/* Implement export functionality */}}
          sx={{color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)', '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)', borderColor: '#D4AF37'}}}
          variant="outlined"
        >
          Export
        </Button>
      </Box>
      <TableContainer>
        <Table sx={{
            '& .MuiTableCell-head': { color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.3)' },
            '& .MuiTableCell-body': { color: '#E0E0E0', borderBottom: '1px solid rgba(212,175,55,0.2)'},
            '& .MuiTableRow-root:hover': {backgroundColor: 'rgba(212,175,55,0.05)'}
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {earnings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>{format(new Date(earning.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{earning.jobTitle}</TableCell>
                  <TableCell align="right">${earning.amount.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      size="small"
                      {...getStatusChipProps(earning.status)}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleDialogOpen(earning)}
                        sx={{color: '#D4AF37'}}
                      >
                        <ReceiptIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Receipt">
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadReceipt(earning.id)}
                        sx={{color: '#D4AF37'}}
                      >
                        <DownloadIcon fontSize="small"/>
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={earnings.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
            color: '#B0B0B0',
            '& .MuiSelect-icon': { color: '#D4AF37'},
            '& .MuiButtonBase-root': {color: '#D4AF37', '&.Mui-disabled': {color: 'rgba(212,175,55,0.3)'}}
        }}
      />
    </Paper>
  );

  return (
    <Box sx={{color: '#FFFFFF'}}> {/* Assuming parent page handles overall dark background */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{color: '#D4AF37', fontWeight: 'bold'}}>
          Earnings Tracker
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchEarnings}
          disabled={loading}
          variant="outlined"
          sx={{color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)', '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)', borderColor: '#D4AF37'}, '&.Mui-disabled': {borderColor: 'rgba(212,175,55,0.2)', color: 'rgba(212,175,55,0.5)'} }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(229,115,115,0.1)', color: '#E57373', '& .MuiAlert-icon': {color: '#E57373'} }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress sx={{color: '#D4AF37'}}/>
        </Box>
      ) : (
        <>
          {renderSummaryCards()}
          {renderEarningsChart()}
          {renderEarningsTable()}
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{sx: {backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2, border:'1px solid rgba(212,175,55,0.3)'}}}
      >
        <DialogTitle sx={{color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.2)'}}>
          Earning Details: {selectedEarning?.jobTitle}
        </DialogTitle>
        <DialogContent sx={{pt: '20px !important'}}>
          {selectedEarning && (
            <Box> {/* Removed pt:2 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{color: '#B0B0B0'}}>Date:</Typography>
                  <Typography variant="body1" sx={{color: '#E0E0E0'}}>
                    {format(new Date(selectedEarning.date), 'MMMM dd, yyyy')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{color: '#B0B0B0'}}>Amount:</Typography>
                  <Typography variant="body1" sx={{color: '#D4AF37', fontWeight: 'bold'}}>
                    ${selectedEarning.amount.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" sx={{color: '#B0B0B0'}}>Job Title:</Typography>
                  <Typography variant="body1" sx={{color: '#E0E0E0'}}>
                    {selectedEarning.jobTitle}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{color: '#B0B0B0'}}>Status:</Typography>
                  <Chip
                    label={selectedEarning.status.charAt(0).toUpperCase() + selectedEarning.status.slice(1)}
                    size="small"
                    {...getStatusChipProps(selectedEarning.status)}
                    sx={{ ...getStatusChipProps(selectedEarning.status).sx, mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{color: '#B0B0B0'}}>Payment Method:</Typography>
                  <Typography variant="body1" sx={{color: '#E0E0E0'}}>
                    {selectedEarning.paymentMethod || 'N/A'}
                  </Typography>
                </Grid>
                {selectedEarning.notes && (
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{color: '#B0B0B0'}}>Notes:</Typography>
                    <Typography variant="body2" sx={{color: '#E0E0E0', whiteSpace:'pre-wrap', p:1, border:'1px solid rgba(255,255,255,0.1)', borderRadius:1}}>
                      {selectedEarning.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.2)', p:2}}>
          <Button onClick={handleDialogClose} sx={{color: '#B0B0B0'}}>Close</Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownloadReceipt(selectedEarning?.id)}
            sx={{
                backgroundColor: '#D4AF37',
                color: '#000000',
                '&:hover': { backgroundColor: '#BF953F' }
            }}
          >
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EarningsTracker; 


