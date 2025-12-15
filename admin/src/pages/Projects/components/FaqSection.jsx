import React from "react";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const FaqSection = ({ faqs, handleFAQsChange, handleAddFAQs, handleRemoveFAQs }) => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6">FAQs</Typography>
            <Grid container direction="row">
                {(Array.isArray(faqs) ? faqs : [{ questions: "", answer: "" }]).map(
                    (FAQ, index) => (
                        <Grid item xs={12} key={`faq-${index}`}>
                            <Box
                                display="flex"
                                alignItems="center"
                                p={2}
                                mb={2}
                                gap={2}
                                sx={{
                                    background: "rgba(255, 255, 255, 0.7)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "16px",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)"
                                    }
                                }}
                            >
                                <Input
                                    placeholder={`Question ${index + 1}`}
                                    value={FAQ?.questions || ""}
                                    onChange={(e) => handleFAQsChange(index, "questions", e.target.value)}
                                    fullWidth
                                    required
                                    style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", padding: "8px" }}
                                />
                                <Input
                                    placeholder="Answer"
                                    value={FAQ?.answer || ""}
                                    onChange={(e) => handleFAQsChange(index, "answer", e.target.value)}
                                    fullWidth
                                    required
                                    style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", padding: "8px" }}
                                />
                                <IconButton
                                    onClick={() => handleRemoveFAQs(index)}
                                    disabled={faqs?.length <= 1}
                                    color="error"
                                    size="small"
                                    sx={{ background: "#f5f5f5", "&:hover": { background: "#ffebee" } }}
                                >
                                    <Delete />
                                </IconButton>
                            </Box>
                        </Grid>
                    )
                )}
                <Button onClick={handleAddFAQs} variant="contained" color="info" fullWidth>
                    Add FAQs
                </Button>
            </Grid>
        </Grid>
    );
};

FaqSection.propTypes = {
    faqs: PropTypes.array,
    handleFAQsChange: PropTypes.func,
    handleAddFAQs: PropTypes.func,
    handleRemoveFAQs: PropTypes.func
};

export default FaqSection;
