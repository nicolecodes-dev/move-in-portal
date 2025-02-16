"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography, Paper, Button, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { CheckCircle as CheckCircleIcon, WarningAmber as WarningAmberIcon, Cancel as CancelIcon } from "@mui/icons-material";

const stepsList = [
  { key: "contractSigned", label: "Contract signed" },
  { key: "depositPaid", label: "Deposit paid" },
  { key: "membershipPaid", label: "Membership fee paid", alwaysComplete: true },
  { key: "welcomeEmailSent", label: "Your welcome email has been sent" },
];

// get icon based on step status
const getIcon = (completed: boolean, alwaysComplete = false) =>
  alwaysComplete || completed ? <CheckCircleIcon color="success" /> : <WarningAmberIcon color="warning" />;

export default function Home() {
  const defaultSteps = {
    contractSigned: false,
    depositPaid: false,
    membershipPaid: true, // always paid
    welcomeEmailSent: false,
  };

  const [steps, setSteps] = useState(defaultSteps);
  const [loading, setLoading] = useState(true);

  // 🚨 resets progress on every load
  useEffect(() => {
    localStorage.removeItem("moveInSteps"); // wipe out saved progress
    setSteps(defaultSteps); // reset state
    setLoading(false);
  }, []);

  // update steps (but no longer saves to localStorage)
  const updateSteps = (step: keyof typeof defaultSteps) => {
    setSteps((prev) => {
      if (prev[step]) return prev; // prevent useless updates
      return { ...prev, [step]: true };
    });
  };

  if (loading) return <Typography>Loading...</Typography>;

  const allStepsCompleted = stepsList.every(({ key, alwaysComplete }) => alwaysComplete || steps[key]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
        <Box sx={{ width: 240, p: 2 }}>
          <Typography variant="h6" gutterBottom>NABYT</Typography>
          <List>
            {["Homepage", "Profile", "Bookings", "Documents", "Payments"].map((text) => (
              <ListItem key={text}><ListItemText primary={text} /></ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="md">
          <Typography variant="h5" gutterBottom>Manage Your Move-in</Typography>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Your Move-in Progress</Typography>

            {stepsList.map(({ key, label, alwaysComplete }) => {
              const isCompleted = steps[key] || alwaysComplete;

              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
                  {getIcon(isCompleted, alwaysComplete)}
                  <Typography>{isCompleted ? `${label} ✅` : label}</Typography>
                  {!isCompleted && (
                    <Button size="small" variant="contained" onClick={() => updateSteps(key)}>Complete</Button>
                  )}
                </Box>
              );
            })}

            <Typography variant="h6" sx={{ mt: 3 }}>Move-in Instructions</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
              {allStepsCompleted ? (
                <Button variant="contained" onClick={() => alert("Move-in instructions coming soon!")}>
                  Get Move-in Instructions
                </Button>
              ) : (
                <>
                  <CancelIcon color="error" />
                  <Typography color="error">Disabled: Complete all steps to enable.</Typography>
                </>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Need Help?</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Button variant="outlined">Help Center</Button>
              <Button variant="outlined">Contact Support</Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
