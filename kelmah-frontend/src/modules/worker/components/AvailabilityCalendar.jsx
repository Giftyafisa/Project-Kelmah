import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
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
  Tooltip
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/contexts/AuthContext';
import { format, parseISO, isSameDay } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

const AvailabilityCalendar = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    startTime: null,
    endTime: null,
    status: 'available'
  });

  useEffect(() => {
    fetchAvailability();
  }, [selectedDate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workers/${user.id}/availability?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      const data = await response.json();
      setAvailability(data);
      setError(null);
    } catch (err) {
      setError('Failed to load availability');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleDialogOpen = (slot = null) => {
    setEditingSlot(slot);
    if (slot) {
      setFormData({
        startTime: parseISO(slot.startTime),
        endTime: parseISO(slot.endTime),
        status: slot.status
      });
    } else {
      setFormData({
        startTime: null,
        endTime: null,
        status: 'available'
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingSlot(null);
    setFormData({
      startTime: null,
      endTime: null,
      status: 'available'
    });
  };

  const handleInputChange = (field) => (value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const url = editingSlot
        ? `/api/workers/${user.id}/availability/${editingSlot.id}`
        : `/api/workers/${user.id}/availability`;
      
      const method = editingSlot ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: format(selectedDate, 'yyyy-MM-dd'),
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save availability');
      }

      handleDialogClose();
      fetchAvailability();
    } catch (err) {
      setError('Failed to save availability');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slotId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workers/${user.id}/availability/${slotId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete availability slot');
      }

      fetchAvailability();
    } catch (err) {
      setError('Failed to delete availability slot');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme(); // Make sure useTheme is imported

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available':
        return { color: '#81C784', fontWeight: 'medium' }; // Light Green
      case 'unavailable':
        return { color: '#E57373', fontWeight: 'medium' }; // Light Red
      case 'booked':
        return { color: '#FFB74D', fontWeight: 'medium' }; // Orange/Amber
      default:
        return { color: '#B0B0B0' }; // Light Grey
    }
  };

  const commonTextFieldStyles = {
    '& label.Mui-focused': { color: '#D4AF37' },
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF',
      '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
      '&:hover fieldset': { borderColor: '#D4AF37' },
      '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
      '& .MuiSvgIcon-root': { color: '#D4AF37' }
    },
    '& .MuiInputLabel-root': { color: '#B0B0B0' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

  const commonSelectStyles = {
    color: '#FFFFFF',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(212, 175, 55, 0.3)' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4AF37' },
    '& .MuiSvgIcon-root': { color: '#D4AF37' }, // Dropdown arrow
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
  };

  const menuItemStyles = {
    backgroundColor: '#1F1F1F', // Dark background for menu items
    color: '#FFFFFF',
    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    '&.Mui-selected': {
      backgroundColor: 'rgba(212, 175, 55, 0.2)',
      '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.3)' }
    }
  };

  const renderTimeSlot = (slot) => (
    <Paper
      key={slot.id}
      sx={{
        p: 1.5, // Reduced padding
        mb: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2C2C2C', // Darker background for slots
        color: '#E0E0E0',
        borderRadius: 1,
        borderLeft: `4px solid ${getStatusStyle(slot.status).color}` // Status indicator border
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AccessTimeIcon sx={{color: '#D4AF37'}} />
        <Box>
          <Typography variant="body1" sx={{fontWeight: 'medium'}}>
            {format(parseISO(slot.startTime), 'h:mm a')} - {format(parseISO(slot.endTime), 'h:mm a')}
          </Typography>
          <Typography variant="body2" sx={getStatusStyle(slot.status)}>
            {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleDialogOpen(slot)}
            disabled={slot.status === 'booked'}
            sx={{color: slot.status === 'booked' ? 'grey.700' : '#D4AF37'}}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDelete(slot.id)}
            disabled={slot.status === 'booked'}
            sx={{color: slot.status === 'booked' ? 'grey.700' : '#E57373'}}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{color: '#FFFFFF'}}> {/* Assuming parent page sets dark background */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{color: '#D4AF37', fontWeight: 'bold'}}>
          Availability Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
          sx={{backgroundColor: '#D4AF37', color: '#000000', '&:hover': {backgroundColor: '#BF953F'}}}
        >
          Add Time Slot
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(229,115,115,0.1)', color: '#E57373', '& .MuiAlert-icon': {color: '#E57373'} }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}> {/* Adjusted grid for better calendar display */}
          <Paper sx={{ p: 2, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                sx={{
                  width: '100%',
                  color: '#FFFFFF',
                  '& .MuiPickersDay-root': { // Day numbers
                    color: '#E0E0E0',
                    '&.Mui-selected': {
                      backgroundColor: '#D4AF37',
                      color: '#000000',
                      '&:hover': { backgroundColor: '#BF953F'},
                      '&:focus': { backgroundColor: '#D4AF37'}
                    },
                    '&.MuiPickersDay-today': {
                      borderColor: '#D4AF37',
                      color: '#D4AF37'
                    }
                  },
                  '& .MuiDayPicker-weekDayLabel': { // Day labels (Mon, Tue)
                    color: '#B0B0B0'
                  },
                  '& .MuiPickersCalendarHeader-label': { // Month/Year in header
                    color: '#D4AF37',
                    fontWeight: 'medium'
                  },
                  '& .MuiPickersArrowSwitcher-button': { // Arrow buttons
                    color: '#D4AF37'
                  }
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}> {/* Adjusted grid */}
          <Paper sx={{ p: 2, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)', minHeight: 300 }}>
            <Typography variant="h6" gutterBottom sx={{color: '#D4AF37'}}>
              Slots for: {format(selectedDate, 'MMMM d, yyyy')}
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'rgba(212,175,55,0.2)' }} />
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress sx={{color: '#D4AF37'}} />
              </Box>
            ) : availability.length === 0 ? (
              <Typography sx={{color: '#B0B0B0'}} align="center" mt={3}>
                No time slots scheduled for this date.
              </Typography>
            ) : (
              <Box sx={{maxHeight: 320, overflowY: 'auto', pr: 0.5}}>
                {availability.map(renderTimeSlot)}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{sx: {backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2, border:'1px solid rgba(212,175,55,0.3)'}}}
      >
        <DialogTitle sx={{color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.2)'}}>
          {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'} for {format(selectedDate, 'MMMM d')}
        </DialogTitle>
        <DialogContent sx={{pt: '20px !important'}}>
          <Box> {/* Removed pt:2 */}
            <Grid container spacing={2}> {/* Reduced spacing */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Start Time"
                    value={formData.startTime}
                    onChange={handleInputChange('startTime')}
                    sx={commonTextFieldStyles}
                    slotProps={{ textField: { fullWidth: true, sx: commonTextFieldStyles } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="End Time"
                    value={formData.endTime}
                    onChange={handleInputChange('endTime')}
                    sx={commonTextFieldStyles}
                    slotProps={{ textField: { fullWidth: true, sx: commonTextFieldStyles } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputLabel-root': { color: '#B0B0B0' } }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => handleInputChange('status')(e.target.value)}
                    sx={commonSelectStyles}
                    MenuProps={{ PaperProps: { sx: { backgroundColor: '#1F1F1F'} } }}
                  >
                    <MenuItem value="available" sx={menuItemStyles}>Available</MenuItem>
                    <MenuItem value="unavailable" sx={menuItemStyles}>Unavailable</MenuItem>
                    {/* Booked status might be system-set, not user-selectable here */}
                    {/* <MenuItem value="booked" sx={menuItemStyles}>Booked</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.2)', p:2}}>
          <Button onClick={handleDialogClose} sx={{color: '#B0B0B0'}}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.startTime || !formData.endTime}
            sx={{
                backgroundColor: '#D4AF37',
                color: '#000000',
                '&:hover': { backgroundColor: '#BF953F' },
                '&.Mui-disabled': {backgroundColor: 'rgba(212,175,55,0.5)', color: 'rgba(0,0,0,0.5)'}
            }}
          >
            {editingSlot ? 'Update' : 'Add'} Time Slot
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvailabilityCalendar; 


