import React from 'react';
import { Box, Typography, Paper, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

function FAQ() {
  const faqData = [
    {
      question: 'When do I switch to adult food from puppy/Kitten food?',
      applicable: 'Dogs and Cats',
      answer: 'Switching a puppy or kitten to adult food too early can cause obesity and gastrointestinal issues. It is recommended to switch to adult dog or cat food between 10-12 months. Always check with your vet first.',
    },
    {
      question: 'How often do I need to bathe my dog?',
      applicable: 'Dogs',
      answer: 'If no skin condition is present, you can bathe your dog every 4-6 weeks. In some cases, you may need to bathe them more often than that, but no more than once a week. It is important to use Pet Shampoos (not people shampoos) in order to not damage or cause allergy outbreaks on your pet\'s skin.',
    },
    {
      question: 'How much sunshine does my reptile need daily?',
      applicable: 'Reptiles',
      answer: 'Reptiles need to have the standard 12 hours of daylight and 12 hours of nighttime. During the day, they need a light that offers the complete spectrum, with both UVA and UVB rays. This is necessary for the proper production of vitamin D3, which helps them to metabolize calcium and grow healthy bones.',
    },
  ];

  return (
    <Box>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>
        
        {faqData.map((faq, index) => (
          <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
            <Typography variant="h6">{faq.question}</Typography>
            <Typography variant="subtitle1" sx={{ fontStyle: 'italic', marginBottom: 1 }}>
              Applicable: {faq.applicable}
            </Typography>
            <Typography>{faq.answer}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default FAQ;
