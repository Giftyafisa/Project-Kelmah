import React from 'react';
import { Stepper, Step, StepButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GavelIcon from '@mui/icons-material/Gavel';
import PaymentIcon from '@mui/icons-material/Payment';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const steps = [
  { label: 'Find Work', icon: <SearchIcon />, path: '/worker/find-work' },
  { label: 'Applications', icon: <AssignmentIcon />, path: '/worker/applications' },
  { label: 'Contracts', icon: <GavelIcon />, path: '/worker/contracts' },
  { label: 'Payments', icon: <PaymentIcon />, path: '/worker/payment' }
];

const WorkflowStepper = () => {
  const location = useLocation();
  const active = steps.findIndex(step => location.pathname.startsWith(step.path));
  const activeStep = active === -1 ? 0 : active;

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(step => (
          <Step key={step.label}>
            <StepButton
              component={RouterLink}
              to={step.path}
              icon={step.icon}
            >
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default WorkflowStepper;