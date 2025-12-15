import React from "react";
import { Grid, Typography, IconButton, Button } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import { Delete, Add } from "@mui/icons-material";
import PropTypes from "prop-types";

const FeatureSection = ({
    features,
    handleFeaturesChange,
    handleFeatureItemsChange,
    handleAddFeature,
    handleRemoveFeature,
    handleAddFeatureItem,
    handleRemoveFeatureItem,
    handleIconPickerOpen,
    Icons,
}) => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6">Property Features</Typography>
            {(features || [{ title: "", items: [{ text: "", helpertext: "", icon: "" }] }]).map(
                (feature, index) => (
                    <Box
                        key={index}
                        mt={3}
                        p={3}
                        sx={{
                            background: "rgba(255, 255, 255, 0.7)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "16px",
                            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(0, 0, 0, 0.12)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                                transform: "translateY(-2px)"
                            }
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" color="textPrimary" sx={{ fontWeight: 600 }}>
                                Feature {index + 1}
                            </Typography>
                            <IconButton onClick={() => handleRemoveFeature(index)} color="error" size="small">
                                <Delete />
                            </IconButton>
                        </Box>

                        <Box display="flex" alignItems="center" mb={2}>
                            <Input
                                fullWidth
                                placeholder="Feature Title"
                                value={feature?.title || ""}
                                onChange={(e) => handleFeaturesChange(index, "title", e.target.value)}
                                style={{
                                    background: "#fff",
                                    border: "1px solid rgba(0, 0, 0, 0.2)",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    marginBottom: 0
                                }}
                            />
                        </Box>

                        {feature?.items?.map((item, itemIndex) => (
                            <Box
                                key={itemIndex}
                                display="flex"
                                alignItems="center"
                                mt={1.5}
                                p={1.5}
                                sx={{
                                    background: "#fff",
                                    borderRadius: "10px",
                                    border: "1px solid rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                <IconButton onClick={() => handleIconPickerOpen(index, itemIndex)} sx={{ mr: 1, border: "1px solid #eee", borderRadius: "8px" }}>
                                    {Icons[item?.icon] ? (
                                        Icons[item.icon]({ width: "24px", height: "24px", fill: "#555" })
                                    ) : (
                                        <Add fontSize="small" />
                                    )}
                                </IconButton>
                                <Input
                                    placeholder="Text"
                                    style={{
                                        marginRight: "10px",
                                        flex: 1,
                                        background: "#f9f9f9",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: "6px",
                                        padding: "8px"
                                    }}
                                    value={item?.text || ""}
                                    onChange={(e) =>
                                        handleFeatureItemsChange(index, itemIndex, "text", e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Helpertext"
                                    value={item?.helpertext || ""}
                                    style={{
                                        marginRight: "10px",
                                        flex: 1,
                                        background: "#f9f9f9",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: "6px",
                                        padding: "8px"
                                    }}
                                    onChange={(e) =>
                                        handleFeatureItemsChange(index, itemIndex, "helpertext", e.target.value)
                                    }
                                />
                                <IconButton onClick={() => handleRemoveFeatureItem(index, itemIndex)} size="small" sx={{ color: "#777", "&:hover": { color: "#f44336" }, background: "#f5f5f5" }}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                        <Box mt={2} display="flex" justifyContent="flex-end">
                            <Button
                                onClick={() => handleAddFeatureItem(index)}
                                size="small"
                                variant="contained"
                                color="info"
                                sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
                            >
                                + Add Item
                            </Button>
                        </Box>
                    </Box>
                )
            )}
            <Box style={{ marginTop: "10px" }}>
                <Button
                    onClick={handleAddFeature}
                    variant="contained"
                    color="info"
                    fullWidth
                    className="mt-4"
                >
                    Add Feature
                </Button>
            </Box>
        </Grid >
    );
};

FeatureSection.propTypes = {
    features: PropTypes.array,
    handleFeaturesChange: PropTypes.func,
    handleFeatureItemsChange: PropTypes.func,
    handleAddFeature: PropTypes.func,
    handleRemoveFeature: PropTypes.func,
    handleAddFeatureItem: PropTypes.func,
    handleRemoveFeatureItem: PropTypes.func,
    handleIconPickerOpen: PropTypes.func,
    Icons: PropTypes.object
};

export default FeatureSection;
