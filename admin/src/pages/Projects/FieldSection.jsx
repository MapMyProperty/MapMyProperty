import React from "react";
import { Grid, Typography, IconButton, Button } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import { Delete } from "@mui/icons-material";
import PropTypes from "prop-types";

const FieldSection = ({ label, values, onChange, onAdd, onRemove }) => {
    return (
        <Grid item xs={12}>
            <Typography variant="caption">{label}</Typography>
            {(values || [""]).map((value, index) => (
                <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    mt={1.5}
                    p={1.5}
                    sx={{
                        background: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "12px",
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        transition: "all 0.2s",
                        "&:hover": {
                            background: "rgba(255, 255, 255, 0.9)",
                            borderColor: "rgba(0, 0, 0, 0.2)"
                        }
                    }}
                >
                    <Input
                        placeholder={label}
                        value={value}
                        onChange={(e) => onChange(index, e.target.value)}
                        fullWidth
                        style={{
                            background: "#fff",
                            border: "1px solid rgba(0,0,0,0.15)",
                            boxShadow: "none",
                            padding: "8px",
                            borderRadius: "6px"
                        }}
                    />
                    {values.length > 1 && (
                        <IconButton onClick={() => onRemove(index)} size="small" sx={{ ml: 1, color: "#888", "&:hover": { color: "#f44336" }, background: "#f5f5f5" }}>
                            <Delete fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ))}
            <Button onClick={onAdd} sx={{ mt: 1 }}>
                Add {label}
            </Button>
        </Grid>
    );
};

FieldSection.propTypes = {
    label: PropTypes.string,
    values: PropTypes.array,
    onChange: PropTypes.func,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func
};

export default FieldSection;
