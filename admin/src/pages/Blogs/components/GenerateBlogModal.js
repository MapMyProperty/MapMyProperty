import React, { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogTitle, TextField, Button, Box, Typography, MenuItem, CircularProgress } from "@mui/material";
import { useGenerateBlog } from "queries/StoreQuery";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GenerateBlogModal = ({ open, onClose }) => {
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState("");
    const [tone, setTone] = useState("Professional");
    const { mutate: generate, isLoading } = useGenerateBlog();
    const navigate = useNavigate();

    const handleGenerate = () => {
        if (!topic) return toast.error("Please enter a topic");

        const data = {
            topic,
            keywords,
            tone
        };

        generate(data, {
            onSuccess: (res) => {
                toast.success("Blog Generated Successfully!");
                onClose();
                // Navigate to Add Blog with state
                navigate("/blogs/addBlog", { state: { aiData: res.data } });
            },
            onError: (err) => {
                toast.error(err?.response?.data?.message || "Generation Failed");
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Generate Blog with AI</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        label="Blog Topic"
                        variant="outlined"
                        fullWidth
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Top 10 Investment Areas in Bangalore"
                    />

                    <TextField
                        label="Keywords (Optional)"
                        variant="outlined"
                        fullWidth
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Comma separated keywords"
                    />

                    <TextField
                        select
                        label="Tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="Professional">Professional</MenuItem>
                        <MenuItem value="Engaging">Engaging</MenuItem>
                        <MenuItem value="Informative">Informative</MenuItem>
                        <MenuItem value="Persuasive">Persuasive</MenuItem>
                    </TextField>

                    <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={onClose} color="secondary">Cancel</Button>
                        <Button
                            onClick={handleGenerate}
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Box component="i" className="ni ni-bulb-61" />}
                        >
                            {isLoading ? "Generating..." : "Generate Draft"}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

GenerateBlogModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default GenerateBlogModal;
