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
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../auth/contexts/AuthContext';

const DocumentVerification = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    file: null,
    expiryDate: null
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workers/${user.id}/documents`);
      const data = await response.json();
      setDocuments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (document = null) => {
    setEditingDocument(document);
    if (document) {
      setFormData({
        type: document.type,
        title: document.title,
        description: document.description,
        file: null,
        expiryDate: document.expiryDate
      });
    } else {
      setFormData({
        type: '',
        title: '',
        description: '',
        file: null,
        expiryDate: null
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingDocument(null);
    setFormData({
      type: '',
      title: '',
      description: '',
      file: null,
      expiryDate: null
    });
    setUploadProgress(0);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      file: event.target.files[0]
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingDocument
        ? `/api/workers/${user.id}/documents/${editingDocument.id}`
        : `/api/workers/${user.id}/documents`;
      
      const method = editingDocument ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(progress);
        }
      });

      if (!response.ok) {
        throw new Error('Failed to save document');
      }

      handleDialogClose();
      fetchDocuments();
    } catch (err) {
      setError('Failed to save document');
      console.error(err);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workers/${user.id}/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      fetchDocuments();
    } catch (err) {
      setError('Failed to delete document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId) => {
    try {
      const response = await fetch(`/api/workers/${user.id}/documents/${documentId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download document');
      console.error(err);
    }
  };

  const theme = useTheme(); // Ensure useTheme is imported

  const getStatusChipProps = (status) => {
    const s = status ? status.toLowerCase() : 'unknown';
    const commonStyles = { fontWeight: 'medium', color: '#000000' };
    let icon = <DescriptionIcon sx={{ color: '#000000' }} />;
    let specificSx = {};

    switch (s) {
      case 'verified':
        icon = <VerifiedIcon sx={{ color: '#000000' }} />;
        specificSx = { ...commonStyles, backgroundColor: '#81C784' }; // Light Green
        break;
      case 'pending':
        icon = <PendingIcon sx={{ color: '#000000' }} />;
        specificSx = { ...commonStyles, backgroundColor: '#D4AF37' }; // Gold for pending
        break;
      case 'rejected':
        icon = <CloseIcon sx={{ color: '#000000' }} />;
        specificSx = { ...commonStyles, backgroundColor: '#E57373' }; // Light Red
        break;
      case 'expired':
        icon = <WarningIcon sx={{ color: '#000000' }} />;
        specificSx = { ...commonStyles, backgroundColor: '#FFB74D' }; // Amber for expired
        break;
      default: // unknown or other statuses
        specificSx = { backgroundColor: '#9E9E9E', color: '#FFFFFF' }; // Grey
        icon = <DescriptionIcon sx={{ color: '#FFFFFF' }} />;
        break;
    }
    return { sx: specificSx, icon };
  };

  const commonTextFieldStyles = {
    '& label.Mui-focused': { color: '#D4AF37' },
    '& .MuiOutlinedInput-root': {
      color: '#FFFFFF',
      '& fieldset': { borderColor: 'rgba(212, 175, 55, 0.3)' },
      '&:hover fieldset': { borderColor: '#D4AF37' },
      '&.Mui-focused fieldset': { borderColor: '#D4AF37' },
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
    '& .MuiSvgIcon-root': { color: '#D4AF37' },
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
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

  const renderDocumentCard = (document) => (
    <Card key={document.id} sx={{ mb: 2, backgroundColor: '#2C2C2C', color: '#FFFFFF', borderRadius: 2, border: '1px solid rgba(212,175,55,0.2)' }}>
      <CardContent sx={{pb: 1}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="h6" sx={{color: '#E0E0E0'}}>{document.title}</Typography>
            <Typography variant="body2" sx={{color: '#B0B0B0'}}>
              Type: {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
            </Typography>
          </Box>
          <Chip
            label={document.status ? document.status.charAt(0).toUpperCase() + document.status.slice(1) : 'Unknown'}
            size="small"
            {...getStatusChipProps(document.status)}
          />
        </Box>
        <Divider sx={{ my: 1.5, borderColor: 'rgba(212,175,55,0.2)' }} />
        <Typography variant="body2" paragraph sx={{color: '#E0E0E0', minHeight: '40px'}}> {/* Ensure some min height for description */}
          {document.description || "No description."}
        </Typography>
        {document.expiryDate && (
          <Typography variant="caption" sx={{color: '#FFB74D', display:'block', mt:1}}> {/* Amber for expiry */}
            Expires: {new Date(document.expiryDate).toLocaleDateString()}
          </Typography>
        )}
        {document.notes && ( // Admin notes or rejection reasons
          <Typography variant="caption" sx={{color: '#B0B0B0', fontStyle:'italic', display:'block', mt:1}}>
            Notes: {document.notes}
          </Typography>
        )}
      </CardContent>
      <Divider sx={{ borderColor: 'rgba(212,175,55,0.2)' }}/>
      <CardActions sx={{ justifyContent: 'flex-end', p:1.5 }}>
        <Button
          size="small"
          startIcon={<DescriptionIcon />}
          onClick={() => handleDownload(document.id)}
          sx={{color: '#D4AF37', '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'}}}
        >
          Download
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleDialogOpen(document)}
          sx={{color: '#D4AF37', '&:hover': {backgroundColor: 'rgba(212,175,55,0.1)'}}}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(document.id)}
          sx={{color: '#E57373', '&:hover': {backgroundColor: 'rgba(229,82,82,0.1)'}}}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{color: '#FFFFFF'}}> {/* Assuming parent page sets dark background */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{color: '#D4AF37', fontWeight: 'bold'}}>
          Document Verification
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDialogOpen()}
          sx={{backgroundColor: '#D4AF37', color: '#000000', '&:hover': {backgroundColor: '#BF953F'}}}
        >
          Upload Document
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
      ) : documents.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#1F1F1F', borderRadius: 2 }}>
          <DescriptionIcon sx={{ fontSize: 60, color: '#D4AF37', mb: 2 }} />
          <Typography sx={{color: '#B0B0B0'}}>
            No documents uploaded yet. Upload your ID, certificates, etc. to get verified.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
              <Typography variant="h6" gutterBottom sx={{color: '#E0E0E0'}}>
                Required Documents
              </Typography>
              <List>
                {documents
                  .filter(doc => doc.required)
                  .map(doc => (
                    <ListItem key={doc.id} sx={{borderBottom: '1px solid rgba(212,175,55,0.1)', '&:last-child': {borderBottom: 'none'}}}>
                      <ListItemIcon sx={{color: getStatusChipProps(doc.status).sx.backgroundColor || '#D4AF37' }}>
                        {getStatusChipProps(doc.status).icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{color:'#FFFFFF'}}>{doc.title}</Typography>}
                        secondary={<Typography sx={{color:'#B0B0B0'}}>{doc.type}</Typography>}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDownload(doc.id)}
                          sx={{color: '#D4AF37'}}
                        >
                          <DescriptionIcon fontSize="small"/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {documents.filter(doc => doc.required).length === 0 && <Typography sx={{color: '#B0B0B0', textAlign:'center', py:2}}>No required documents listed yet.</Typography>}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, backgroundColor: '#1F1F1F', borderRadius: 2, boxShadow: '0 4px 12px rgba(212,175,55,0.1)' }}>
              <Typography variant="h6" gutterBottom sx={{color: '#E0E0E0'}}>
                Additional Documents
              </Typography>
              <List>
                {documents
                  .filter(doc => !doc.required)
                  .map(doc => (
                    <ListItem key={doc.id} sx={{borderBottom: '1px solid rgba(212,175,55,0.1)', '&:last-child': {borderBottom: 'none'}}}>
                      <ListItemIcon sx={{color: getStatusChipProps(doc.status).sx.backgroundColor || '#D4AF37' }}>
                         {getStatusChipProps(doc.status).icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{color:'#FFFFFF'}}>{doc.title}</Typography>}
                        secondary={<Typography sx={{color:'#B0B0B0'}}>{doc.type}</Typography>}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleDownload(doc.id)}
                          sx={{color: '#D4AF37'}}
                        >
                          <DescriptionIcon fontSize="small"/>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {documents.filter(doc => !doc.required).length === 0 && <Typography sx={{color: '#B0B0B0', textAlign:'center', py:2}}>No additional documents uploaded.</Typography>}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sx={{mt:2}}>
            <Typography variant="h6" gutterBottom sx={{color: '#E0E0E0'}}>
              All Uploaded Documents
            </Typography>
            {documents.map(renderDocumentCard)}
          </Grid>
        </Grid>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{sx: {backgroundColor: '#1F1F1F', color: '#FFFFFF', borderRadius: 2, border:'1px solid rgba(212,175,55,0.3)'}}}
      >
        <DialogTitle sx={{color: '#D4AF37', fontWeight: 'bold', borderBottom: '1px solid rgba(212,175,55,0.2)'}}>
          {editingDocument ? 'Edit Document' : 'Upload New Document'}
        </DialogTitle>
        <DialogContent sx={{pt: '20px !important'}}>
          <Box> {/* Removed pt:2 */}
            <Grid container spacing={2}> {/* Reduced spacing */}
              <Grid item xs={12}>
                <FormControl fullWidth required variant="outlined" sx={{ '& .MuiInputLabel-root': { color: '#B0B0B0' } }}>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Document Type"
                    onChange={handleInputChange('type')}
                    sx={commonSelectStyles}
                    MenuProps={{ PaperProps: { sx: { backgroundColor: '#2C2C2C'} } }}
                  >
                    <MenuItem value="id" sx={menuItemStyles}>ID Document (Ghana Card, Passport)</MenuItem>
                    <MenuItem value="certificate" sx={menuItemStyles}>Certificate (Vocational, Academic)</MenuItem>
                    <MenuItem value="license" sx={menuItemStyles}>License (Driver's, Professional)</MenuItem>
                    <MenuItem value="portfolio" sx={menuItemStyles}>Portfolio Piece (Proof of work)</MenuItem>
                    <MenuItem value="other" sx={menuItemStyles}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Document Title / Name"
                  value={formData.title}
                  onChange={handleInputChange('title')}
                  required
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Brief Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  required
                  sx={commonTextFieldStyles}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                  sx={{color: '#D4AF37', borderColor: 'rgba(212,175,55,0.5)', '&:hover': {borderColor: '#D4AF37', backgroundColor: 'rgba(212,175,55,0.1)'}, py:1.5}}
                >
                  {formData.file ? `Selected: ${formData.file.name}` : 'Choose File to Upload'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </Button>
                {uploadProgress > 0 && (
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ mt: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(212,175,55,0.2)', '& .MuiLinearProgress-bar': {backgroundColor: '#D4AF37'} }}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Expiry Date (if applicable)"
                  type="date"
                  value={formData.expiryDate || ''}
                  onChange={handleInputChange('expiryDate')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={commonTextFieldStyles}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{borderTop: '1px solid rgba(212,175,55,0.2)', p:2}}>
          <Button onClick={handleDialogClose} sx={{color: '#B0B0B0'}}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.type || !formData.title || !formData.description || (!editingDocument && !formData.file)}
            sx={{
                backgroundColor: '#D4AF37',
                color: '#000000',
                '&:hover': { backgroundColor: '#BF953F' },
                '&.Mui-disabled': {backgroundColor: 'rgba(212,175,55,0.5)', color: 'rgba(0,0,0,0.5)'}
            }}
          >
            {editingDocument ? 'Update' : 'Upload'} Document
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentVerification; 


