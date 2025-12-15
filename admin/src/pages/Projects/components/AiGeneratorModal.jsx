import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    Button,
    Box,
    Typography,
    IconButton,
    LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LinkIcon from "@mui/icons-material/Link";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-hot-toast";
import { axiosInstance } from "utils/axiosInstance";
import PropTypes from "prop-types";
import Input from "components/Input";
import { useController } from "context";

// Loading stages (matching 3-stage backend)
const LOADING_STAGES = [
    { text: "Connecting to AI...", progress: 10 },
    { text: "Stage 1: Extracting basic info...", progress: 25 },
    { text: "Stage 2: Generating SEO content...", progress: 50 },
    { text: "Stage 3: Building features & FAQs...", progress: 75 },
    { text: "Finalizing project data...", progress: 95 },
];

const AiGeneratorModal = ({ open, onClose, onGenerate }) => {
    const [controller] = useController();
    const { darkMode } = controller;

    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [stageIndex, setStageIndex] = useState(0);
    const [formData, setFormData] = useState({
        url: "",
        rawText: "",
        projectName: "",
        location: ""
    });

    // Theme colors (matching admin panel)
    const colors = {
        info: "#11cdef",
        dark: "#344767",
        text: darkMode ? "#ffffff" : "#344767",
        textSecondary: darkMode ? "#a0aec0" : "#67748e",
        textMuted: darkMode ? "#718096" : "#8898aa",
        background: darkMode ? "#1a2035" : "#ffffff",
        backgroundSecondary: darkMode ? "#111c44" : "#f8f9fa",
        border: darkMode ? "rgba(255,255,255,0.1)" : "#e9ecef",
        inputBorder: darkMode ? "rgba(255,255,255,0.2)" : "#d2d6da",
    };

    useEffect(() => {
        if (!loading) {
            setStageIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setStageIndex((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
        }, 4000);
        return () => clearInterval(interval);
    }, [loading]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            let payload = { preview: true };

            if (tabIndex === 0) {
                if (!formData.url) {
                    setLoading(false);
                    return toast.error("Please enter a URL");
                }
                payload.url = formData.url;
            } else if (tabIndex === 1) {
                if (!formData.rawText) {
                    setLoading(false);
                    return toast.error("Please enter text");
                }
                payload.rawText = formData.rawText;
            } else {
                if (!formData.projectName) {
                    setLoading(false);
                    return toast.error("Please enter project name");
                }
                payload.projectName = formData.projectName;
                payload.location = formData.location;
            }

            const response = await axiosInstance.post("/ai/generate-project", payload);

            if (response.data && response.data.data) {
                onGenerate(response.data);
                toast.success("Data Generated Successfully!");
                onClose();
            } else {
                toast.error("Failed to generate data");
            }

        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "AI Generation Failed");
        } finally {
            setLoading(false);
        }
    };

    const currentStage = LOADING_STAGES[stageIndex] || LOADING_STAGES[0];

    const tabs = [
        { icon: <LinkIcon fontSize="small" />, label: "By URL" },
        { icon: <TextSnippetIcon fontSize="small" />, label: "By Text" },
        { icon: <SearchIcon fontSize="small" />, label: "By Name" },
    ];

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    background: colors.background,
                    boxShadow: darkMode
                        ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                        : "0 8px 32px rgba(0, 0, 0, 0.1)",
                    border: `1px solid ${colors.border}`,
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 3,
                    py: 2,
                    borderBottom: `1px solid ${colors.border}`,
                    background: colors.backgroundSecondary,
                }}
            >
                <Box display="flex" alignItems="center" gap={1.5}>

                    <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: colors.text }}>
                        AI Project Generator
                    </Typography>
                </Box>
                <IconButton onClick={onClose} disabled={loading} size="small" sx={{ color: colors.textSecondary }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            <DialogContent sx={{ p: 3, background: colors.background }}>
                {loading ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                margin: "0 auto 20px",
                                borderRadius: "50%",
                                backgroundColor: colors.info,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                animation: "pulse 2s ease-in-out infinite",
                                "@keyframes pulse": {
                                    "0%, 100%": { transform: "scale(1)" },
                                    "50%": { transform: "scale(1.05)" },
                                },
                            }}
                        >
                            <AutoAwesomeIcon sx={{ color: "#fff", fontSize: 28 }} />
                        </Box>
                        <Box sx={{ px: 4, mb: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={currentStage.progress}
                                sx={{
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: darkMode ? "rgba(255,255,255,0.1)" : "#e9ecef",
                                    "& .MuiLinearProgress-bar": {
                                        borderRadius: 3,
                                        backgroundColor: colors.info,
                                    },
                                }}
                            />
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: colors.text }}>
                            {currentStage.text}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.textMuted }}>
                            This may take up to 30 seconds
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Tab Buttons */}
                        <Box display="flex" gap={1} mb={3}>
                            {tabs.map((tab, index) => (
                                <Button
                                    key={index}
                                    variant={tabIndex === index ? "contained" : "outlined"}
                                    color="info"
                                    onClick={() => setTabIndex(index)}
                                    startIcon={tab.icon}
                                    sx={{
                                        flex: 1,
                                        py: 1,
                                        borderRadius: "8px",
                                        textTransform: "none",
                                        fontWeight: 500,
                                        fontSize: "0.85rem",
                                        ...(tabIndex !== index && {
                                            color: colors.textSecondary,
                                            borderColor: colors.inputBorder,
                                            "&:hover": {
                                                borderColor: colors.info,
                                                backgroundColor: "rgba(17, 205, 239, 0.04)",
                                            },
                                        }),
                                    }}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </Box>

                        {/* Input Fields */}
                        {tabIndex === 0 && (
                            <Box>
                                <Typography variant="caption" sx={{ color: colors.text, mb: 0.5, display: "block" }}>
                                    Project URL
                                </Typography>
                                <Input
                                    fullWidth
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    placeholder="https://99acres.com/project-details..."
                                />
                            </Box>
                        )}

                        {tabIndex === 1 && (
                            <Box>
                                <Typography variant="caption" sx={{ color: colors.text, mb: 0.5, display: "block" }}>
                                    Raw Text / Description
                                </Typography>
                                <Input
                                    fullWidth
                                    multiline
                                    rows={4}
                                    name="rawText"
                                    value={formData.rawText}
                                    onChange={handleChange}
                                    placeholder="Paste project details, brochure content..."
                                />
                            </Box>
                        )}

                        {tabIndex === 2 && (
                            <Box display="flex" flexDirection="column" gap={2}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: colors.text, mb: 0.5, display: "block" }}>
                                        Project Name
                                    </Typography>
                                    <Input
                                        fullWidth
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        placeholder="e.g., Prestige Lakeside Habitat"
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: colors.text, mb: 0.5, display: "block" }}>
                                        Location (City/Area)
                                    </Typography>
                                    <Input
                                        fullWidth
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., Whitefield, Bangalore"
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Generate Button */}
                        <Button
                            variant="contained"
                            color="info"
                            fullWidth
                            onClick={handleGenerate}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: "10px",
                                fontWeight: 600,
                                textTransform: "none",
                                boxShadow: "0 4px 14px rgba(17, 205, 239, 0.25)",
                                "&:hover": {
                                    boxShadow: "0 6px 20px rgba(17, 205, 239, 0.35)",
                                },
                            }}
                        >
                            Generate Project Details
                        </Button>

                        <Typography
                            variant="caption"
                            sx={{ mt: 1.5, display: "block", textAlign: "center", color: colors.textMuted }}
                        >
                            AI will auto-fill all fields including SEO, FAQs, and Amenities
                        </Typography>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

AiGeneratorModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onGenerate: PropTypes.func.isRequired
};

export default AiGeneratorModal;
