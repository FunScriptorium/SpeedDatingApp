import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Event List', 'Event Details', 'Registration', 'Matchmaking'];

const StatusBar = ({ activeStep }) => {
  return (
    <Stepper activeStep={activeStep}>
      {steps.map((label, index) => (
        <Step key={label} completed={index < activeStep}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default StatusBar;
