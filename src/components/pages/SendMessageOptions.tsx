"use client";

import { useState, useRef } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { MessageSquare, Users } from "lucide-react";
import SendMessageDialog from "@/components/dialogs/SendMessageDialog";

export default function SendMessageOptions() {
  const [showSingleForm, setShowSingleForm] = useState(false);
  const singleFormRef = useRef<HTMLDivElement | null>(null);

  const handleShowSingleForm = () => {
    setShowSingleForm(true);
    setTimeout(() => {
      // singleFormRef.current?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "start",
      // });
    }, 100);
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#fffdf5",
        height: showSingleForm ? "calc(100vh - 120px)" : "calc(100vh - 164px)",
        display: !showSingleForm ? "flex" : "",
        justifyContent: !showSingleForm ? "center" : "",
        alignItems: showSingleForm ? " ":  "center",
        overflow:"hidden"
      }}
    >
      <Box
        sx={{
          display: "grid",
          gap: 3,
         gridTemplateColumns: showSingleForm ? "1fr 3fr" : "1fr 0fr"
        }}
      >
        {/* Send Single Message */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: showSingleForm ? "column" : "row",
            maxHeight:"calc(100vh - 165px)",
            overflow:"auto",
        
           
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "white",
              minWidth: 300,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#0b996e",
                boxShadow: "0 4px 12px rgba(11, 153, 110, 0.15)",
              },
            }}
            onClick={handleShowSingleForm}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#e8f5f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <MessageSquare size={40} color="#0b996e" />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "#333" }}
            >
              Send Single Message
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Send a message to individual recipients
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                handleShowSingleForm();
              }}
              sx={{
                backgroundColor: "#0b996e",
                color: "white",
                textTransform: "none",
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#0a7a5a",
                },
              }}
            >
              Select
            </Button>
          </Paper>

          {/* Group Message */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "white",
              minWidth: 300,
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#0b996e",
                boxShadow: "0 4px 12px rgba(11, 153, 110, 0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: "#e8f5f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Users size={40} color="#0b996e" />
            </Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: "#333" }}
            >
              Group Message
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
              Send a message to multiple recipients at once
            </Typography>
            <Button
              variant="outlined"
              fullWidth
              disabled
              sx={{
                borderColor: "#e0e0e0",
                color: "#999",
                textTransform: "none",
                py: 1.5,
              }}
            >
              Coming Soon
            </Button>
          </Paper>
        </Box>
        
        <Box>
          {showSingleForm && (
            <Box sx={{ width: "100%", mt: 0 }} ref={singleFormRef}>
              <SendMessageDialog
                open={showSingleForm}
                onClose={() => setShowSingleForm(false)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
