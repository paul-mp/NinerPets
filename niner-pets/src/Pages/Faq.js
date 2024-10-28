import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

function FAQ() {
  const faqData = [
    {
      question: 'When do I switch to adult food from puppy/kitten food?',
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
    {
      question: 'How often should I trim my bird’s nails?',
      applicable: 'Birds',
      answer: 'Bird nails can grow quickly, and it’s generally recommended to trim them every 4-6 weeks to prevent injury. If you’re unsure or uncomfortable trimming them yourself, consult a vet who specializes in avian care.',
    },
    {
      question: 'What should I do if my pet has a tick?',
      applicable: 'All Pets',
      answer: 'If you find a tick on your pet, use tweezers to carefully remove it, grasping close to the skin, and pull it out gently. Dispose of the tick properly, and clean the area with an antiseptic. If you’re concerned, check with your vet, especially if your pet shows any symptoms afterward.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Box 
        sx={{
          padding: '10px', 
          marginBottom: '20px', 
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
          borderRadius: '6px'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold', marginBottom: 2 }}
        >
          Frequently Asked Questions
        </Typography>
      </Box>

      <Box>
        {faqData.map((faq, index) => (
          <Paper 
            key={index} 
            elevation={3} 
            sx={{ 
              padding: 2, 
              marginBottom: 2, 
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)', 
              borderRadius: '6px' 
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{faq.question}</Typography>
            <Divider sx={{ margin: '10px 0', borderWidth: 1 }} />
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
