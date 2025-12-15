import React from "react";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const GallerySection = ({
    items,
    field,
    handleNestedChange,
    handleFileChange,
    handleAddField,
    handleRemoveField
}) => {
    const title = field.replace(/([A-Z])/g, " $1").trim();

    return (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                {title}
                {field === "imageGallery" && (
                    <Typography variant="caption" color="error">
                        {" "}
                        *required
                    </Typography>
                )}
            </Typography>
            {(items || []).map((item, index) => (
                <Box
                    key={index}
                    mb={3}
                    p={3}
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
                    <Box display="flex" alignItems="center" mb={2} gap={2}>
                        <Input
                            placeholder="Title"
                            value={item.title}
                            required
                            onChange={(e) => handleNestedChange(field, index, "title", e.target.value)}
                            fullWidth
                            style={{
                                background: "#fff",
                                border: "1px solid rgba(0,0,0,0.15)",
                                borderRadius: "6px",
                                padding: "8px"
                            }}
                        />
                        <Input
                            placeholder="Description"
                            value={item.desc}
                            onChange={(e) => handleNestedChange(field, index, "desc", e.target.value)}
                            fullWidth
                            style={{
                                background: "#fff",
                                border: "1px solid rgba(0,0,0,0.15)",
                                borderRadius: "6px",
                                padding: "8px"
                            }}
                        />
                    </Box>
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{
                                color: "#555",
                                borderColor: "rgba(0,0,0,0.2)",
                                background: "#fff",
                                textTransform: "none",
                                borderRadius: "8px",
                                "&:hover": {
                                    background: "#f5f5f5",
                                    borderColor: "#999"
                                }
                            }}
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                onChange={(e) => handleFileChange(field, index, e)}
                            />
                        </Button>
                        {item.src && (
                            <Box
                                sx={{
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                    borderRadius: "8px",
                                    overflow: "hidden"
                                }}
                            >
                                <img
                                    src={
                                        typeof item.src === "string" && item.src.startsWith("data:image/")
                                            ? item.src
                                            : typeof item.src === "object"
                                                ? URL.createObjectURL(item.src)
                                                : `${process.env.REACT_APP_API_URL}/uploads/${item.src}`
                                    }
                                    alt={`${item} ${index + 1}`}
                                    style={{ width: "100px", height: "60px", objectFit: "cover", display: "block" }}
                                />
                            </Box>
                        )}
                        <IconButton onClick={() => handleRemoveField(field, index)} color="error">
                            <Delete />
                        </IconButton>
                    </Box>
                </Box>
            ))}
            <Button
                onClick={() => handleAddField(field)}
                variant="contained"
                color="info"
                fullWidth
                className="mt-4"
            >
                Add {title}
            </Button>
        </Grid>
    );
};

GallerySection.propTypes = {
    items: PropTypes.array,
    field: PropTypes.string,
    handleNestedChange: PropTypes.func,
    handleFileChange: PropTypes.func,
    handleAddField: PropTypes.func,
    handleRemoveField: PropTypes.func
};

export default GallerySection;
