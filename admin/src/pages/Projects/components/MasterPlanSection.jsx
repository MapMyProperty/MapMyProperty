import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import PropTypes from "prop-types";

const MasterPlanSection = ({ masterPlan, setDetails, handleFileChange }) => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6">Master Plan</Typography>
            <Box display="flex" alignItems="center" marginBottom={1}>
                <Input
                    placeholder="Master Plan Title"
                    value={masterPlan?.title || ""}
                    style={{ marginRight: "5px" }}
                    fullWidth
                    onChange={(e) =>
                        setDetails((prev) => ({
                            ...prev,
                            masterPlan: { ...prev.masterPlan, title: e.target.value },
                        }))
                    }
                />
                <Input
                    placeholder="Description"
                    value={masterPlan?.desc || ""}
                    fullWidth
                    onChange={(e) =>
                        setDetails((prev) => ({
                            ...prev,
                            masterPlan: { ...prev.masterPlan, desc: e.target.value },
                        }))
                    }
                />
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} mt={2}>
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
                    <input type="file" hidden onChange={(e) => handleFileChange("masterPlan", 0, e)} />
                </Button>
                {masterPlan?.src && (
                    <Box
                        mt={1}
                        sx={{
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid rgba(0,0,0,0.1)"
                        }}
                    >
                        <img
                            src={
                                typeof masterPlan.src === "string" && masterPlan.src.startsWith("data:image/")
                                    ? masterPlan.src
                                    : typeof masterPlan.src === "object"
                                        ? URL.createObjectURL(masterPlan.src)
                                        : `${process.env.REACT_APP_API_URL}/uploads/${masterPlan.src}`
                            }
                            alt={`masterPlan`}
                            style={{ width: "100%", height: "100px", objectFit: "cover", display: "block" }}
                        />
                    </Box>
                )}
            </Box>
        </Grid>
    );
};

MasterPlanSection.propTypes = {
    masterPlan: PropTypes.object,
    setDetails: PropTypes.func,
    handleFileChange: PropTypes.func
};

export default MasterPlanSection;
