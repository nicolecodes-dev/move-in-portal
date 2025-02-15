"use client";

import { useState, useEffect } from "react";

// mui components
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

// mui icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";

// styles
import { styles } from "./styles";

// steps configuration
const stepsList = [
  { key: "contractSigned", label: "Contract signed" },
  { key: "depositPaid", label: "Deposit paid" },
  { key: "membershipPaid", label: "Membership fee paid", alwaysComplete: true },
  { key: "welcomeEmailSent", label: "Your welcome email has been sent" },
];

/**
 * Determines which icon to display based on step completion status.
 */
const getIcon = (completed: boolean, alwaysComplete = false) => {
  if (alwaysComplete || completed) return <CheckCircleIcon color="success" sx={styles.icon} />;
  return <WarningAmberIcon color="warning" sx={styles.icon} />;
};

export default function Home() {
  const [steps, setSteps] = useState({
    contractSigned: false,
    depositPaid: false,
    membershipPaid: true, // always paid
    welcomeEmailSent: false,
  });

  /**
   * Loads saved progress from localStorage on first render.
   */
  useEffect(() => {
    const savedSteps = JSON.parse(localStorage.getItem("moveInSteps") || "{}");
    setSteps((prev) => ({ ...prev, ...savedSteps }));
  }, []);

  /**
   * Saves move-in progress to localStorage whenever steps change.
   */
  useEffect(() => {
    localStorage.setItem("moveInSteps", JSON.stringify(steps));
  }, [steps]);

  /**
   * Marks a step as completed and updates state.
   */
  const handleComplete = (step: string) => {
    setSteps((prev) => ({ ...prev, [step]: true }));
  };

  // check if all required steps are completed
  const allStepsCompleted = Object.entries(steps)
    .filter(([key]) => key !== "membershipPaid") // ignore static steps
    .every(([, value]) => value);

  return (
    <Box sx={styles.layout}>
      {/* Sidebar */}
      <Drawer variant="permanent" sx={styles.drawer}>
        <Box sx={styles.sidebar}>
          <Typography variant="h6" gutterBottom>
            NABYT
          </Typography>
          <List>
            {["Homepage", "Profile", "Bookings", "Documents", "Payments"].map((text) => (
              <ListItem key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={styles.content}>
        <Container maxWidth="md">
          <Typography variant="h5" sx={styles.title}>
            Manage Your Move-in
          </Typography>

          <Paper sx={styles.card}>
            <Typography variant="h6">Your Move-in Progress</Typography>

            {stepsList.map(({ key, label, alwaysComplete }) => (
              <Box key={key} sx={styles.step}>
                {getIcon(steps[key], alwaysComplete)}
                <Typography>{steps[key] || alwaysComplete ? `${label} ✅` : label}</Typography>
                {!steps[key] && !alwaysComplete && (
                  <Button size="small" variant="contained" sx={styles.button} onClick={() => handleComplete(key)}>
                    {key === "contractSigned" ? "Activate Now" : key === "depositPaid" ? "Pay Now" : "Complete"}
                  </Button>
                )}
              </Box>
            ))}

            <Typography variant="h6" sx={styles.subTitle}>
              Move-in Instructions
            </Typography>
            <Box sx={styles.step}>
              {allStepsCompleted ? (
                <Button variant="contained" color="primary" onClick={() => alert("Move-in instructions coming soon!")}>
                  Get Move-in Instructions
                </Button>
              ) : (
                <>
                  <CancelIcon color="error" sx={styles.icon} />
                  <Typography color="error">Disabled: Complete all steps to enable.</Typography>
                </>
              )}
            </Box>

            <Typography variant="h6" sx={styles.subTitle}>
              Notifications
            </Typography>
            <Typography>
              {allStepsCompleted
                ? "You've successfully completed all steps. You can now proceed with your move-in."
                : "You have pending actions. Please complete all steps to proceed with your move-in."}
            </Typography>

            <Divider sx={styles.divider} />
            <Typography variant="h6">Need Help?</Typography>
            <Button sx={styles.helpButton} variant="outlined">
              Help Center
            </Button>
            <Button sx={styles.helpButton} variant="outlined">
              Contact Support
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
