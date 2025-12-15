import React from "react";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const AccommodationSection = ({
    items,
    handleNestedChange,
    handleAddField,
    handleRemoveField
}) => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                Accommodation
            </Typography>
            {(items || []).map((item, index) => (
                <Box
                    key={index}
                    mb={3}
                    p={2}
                    display="flex"
                    alignItems="center"
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
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) => handleNestedChange("accommodation", index, "unit", e.target.value)}
                        fullWidth
                        style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", padding: "8px" }}
                    />
                    <Input
                        placeholder="Area"
                        value={item.area}
                        onChange={(e) => handleNestedChange("accommodation", index, "area", e.target.value)}
                        fullWidth
                        style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", padding: "8px" }}
                    />
                    <Input
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => handleNestedChange("accommodation", index, "price", e.target.value)}
                        fullWidth
                        style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", padding: "8px" }}
                    />
                    <IconButton onClick={() => handleRemoveField("accommodation", index)} color="error" size="small" sx={{ background: "#f5f5f5", "&:hover": { background: "#ffebee" } }}>
                        <Delete />
                    </IconButton>
                </Box>
            ))}
            <Button
                onClick={() => handleAddField("accommodation")}
                variant="contained"
                color="info"
                fullWidth
                className="mt-4"
            >
                Add Accommodation
            </Button>
        </Grid>
    );
};

AccommodationSection.propTypes = {
    items: PropTypes.array,
    handleNestedChange: PropTypes.func,
    handleAddField: PropTypes.func,
    handleRemoveField: PropTypes.func
};

export default AccommodationSection;
