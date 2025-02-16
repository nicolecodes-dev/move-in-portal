"use client";

import { useState, useEffect } from "react";
import { 
  Box, Container, Typography, Paper, Button, Drawer, List, ListItem, ListItemText, Divider, Snackbar 
} from "@mui/material";
import { CheckCircle, WarningAmber, Cancel } from "@mui/icons-material";

const STORAGE_KEY = "moveInProgress";

const stepsList = [
  { key: "contractSigned", label: "Contract signed" },
  { key: "depositPaid", label: "Deposit paid" },
  { key: "membershipPaid", label: "Membership fee paid", alwaysComplete: true },
  { key: "welcomeEmailSent", label: "Your welcome email has been sent" },
];

export default function Home() {
  const [steps, setSteps] = useState<Record<string, boolean>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      const parsedData: Record<string, boolean> | null = rawData ? JSON.parse(rawData) : null;

      // Validate parsedData to make sure it's an object and not garbage
      if (parsedData && typeof parsedData === "object") {
        setSteps(parsedData);
      } else {
        throw new Error("Invalid stored data");
      }
    } catch (error) {
      console.error("Error loading steps from localStorage:", error);
      // Reset to default if parsing fails
      setSteps({
        contractSigned: false,
        depositPaid: false,
        membershipPaid: true,
        welcomeEmailSent: false,
      });
    }
  }, []);

  const updateSteps = (step: string) => {
    setSteps((prev) => {
      const newSteps = { ...prev, [step]: true };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSteps));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      return newSteps;
    });
  };

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
            <Typography variant="h6" color="error">DEMO MODE: Progress persists now!</Typography>

            {stepsList.map(({ key, label, alwaysComplete }) => {
              const isCompleted = steps[key] || alwaysComplete;

              return (
                <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
                  {isCompleted ? <CheckCircle color="success" /> : <WarningAmber color="warning" />}
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
                <Button 
                  variant="contained" 
                  onClick={() => setSnackbar({ open: true, message: "Move-in instructions coming soon!" })}
                >
                  Get Move-in Instructions
                </Button>
              ) : (
                <>
                  <Cancel color="error" />
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Box>
  );
}
