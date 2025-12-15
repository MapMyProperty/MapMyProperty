import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PropTypes from "prop-types";

const MESSAGES = [
    "Connecting to AI Intelligence...",
    "Analyzing Real Estate Market data...",
    "Structuring Project Amenities...",
    "Drafting SEO-Optimized Descriptions...",
    "Finalizing Project Details..."
];

const AiLoader = ({ loading }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!loading) return;

        // Reset index on start
        setMessageIndex(0);

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(interval);
    }, [loading]);

    if (!loading) return null;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            gap={2}
        >
            <Box position="relative" display="inline-flex">
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: "#2196F3",
                        filter: "drop-shadow(0 0 8px rgba(33, 150, 243, 0.5))"
                    }}
                />
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <AutoAwesomeIcon sx={{ color: "#21CBF3", fontSize: 24, animation: "pulse 1.5s infinite" }} />
                </Box>
            </Box>

            <Typography
                variant="h6"
                fontWeight="bold"
                textAlign="center"
                sx={{
                    background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    minHeight: "32px", // Prevent layout jump
                    transition: "opacity 0.5s ease-in-out"
                }}
            >
                {MESSAGES[messageIndex]}
            </Typography>

            <style>
                {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
            </style>
        </Box>
    );
};

AiLoader.propTypes = {
    loading: PropTypes.bool
};

export default AiLoader;
