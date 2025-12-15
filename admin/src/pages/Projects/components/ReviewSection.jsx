import React from "react";
import { Grid, Typography, Button, IconButton, Rating } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import { Delete } from "@mui/icons-material";
import avatarFemale from "assets/images/avatar-female.png";
import avatarMale from "assets/images/avatar-male.png";
import PropTypes from "prop-types";

const ReviewSection = ({
    testimonials,
    handleReviewChange,
    handleAddReview,
    handleRemoveReview,
    handleFileChange
}) => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6">Reviews</Typography>
            {(testimonials || []).map((testimonial, index) => (
                <Box
                    key={index}
                    mt={3}
                    p={3}
                    display="flex"
                    flexDirection="column"
                    sx={{
                        background: "rgba(255, 255, 255, 0.7)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        marginBottom: "15px"
                    }}
                >
                    <Input
                        placeholder="Reviewer Name"
                        value={testimonial.name}
                        onChange={(e) => handleReviewChange(index, "name", e.target.value)}
                        fullWidth
                        style={{
                            marginBottom: "15px",
                            background: "#fff",
                            border: "1px solid rgba(0,0,0,0.15)",
                            borderRadius: "6px",
                            padding: "8px"
                        }}
                    />
                    <Rating
                        value={testimonial.rating}
                        onChange={(e, value) => handleReviewChange(index, "rating", value)}
                        style={{ marginBottom: "15px" }}
                    />
                    <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Box display={"flex"} alignItems={"center"}>
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    cursor: "pointer",
                                    backgroundColor: "#f0f0f0",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    "&:hover": {
                                        backgroundColor: "#fff",
                                        borderColor: "#999",
                                    },
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    transition: "all 0.2s"
                                }}
                                onClick={(e) => handleFileChange("testimonials", index, avatarFemale)}
                            >
                                <img style={{ width: 60, height: 60 }} src={avatarFemale} alt="female avatar" />
                            </Box>
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    cursor: "pointer",
                                    backgroundColor: "#f0f0f0",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    "&:hover": {
                                        backgroundColor: "#fff",
                                        borderColor: "#999",
                                    },
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    mx: 2,
                                    transition: "all 0.2s"
                                }}
                                onClick={(e) => handleFileChange("testimonials", index, avatarMale)}
                            >
                                <img style={{ width: 60, height: 60 }} src={avatarMale} alt="male avatar" />
                            </Box>
                            <Box
                                variant="outlined"
                                component="label"
                                sx={{
                                    width: 70,
                                    height: 70,
                                    cursor: "pointer",
                                    backgroundColor: "#f5f5f5",
                                    border: "1px dashed rgba(0,0,0,0.3)",
                                    "&:hover": {
                                        backgroundColor: "#fff",
                                        borderColor: "#666",
                                    },
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    transition: "all 0.2s",
                                    flexDirection: "column"
                                }}
                            >
                                <Typography variant="caption" sx={{ fontSize: "10px", color: "#666", mt: 0.5 }}>Upload</Typography>
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => handleFileChange("testimonials", index, e)}
                                />
                            </Box>
                        </Box>
                        {(testimonial.src || testimonial.image) && (
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                    border: "1px solid rgba(0,0,0,0.1)"
                                }}
                            >
                                {/* Handle both src (AddProjects) and image (EditProjects/initial) */}
                                <img
                                    src={
                                        (testimonial.src || testimonial.image).startsWith("data:image/")
                                            ? (testimonial.src || testimonial.image)
                                            : `${process.env.REACT_APP_API_URL}/uploads/${testimonial.src || testimonial.image}`
                                    }
                                    alt={`Review ${index + 1}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </Box>
                        )}
                    </Box>
                    <Input
                        placeholder="Review"
                        value={testimonial.review}
                        onChange={(e) => handleReviewChange(index, "review", e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        style={{
                            marginTop: "15px",
                            background: "#fff",
                            border: "1px solid rgba(0,0,0,0.15)",
                            borderRadius: "6px",
                            padding: "8px"
                        }}
                    />
                    {testimonials.length > 1 && (
                        <Box mt={1} display="flex" justifyItems="flex-end">
                            <IconButton onClick={() => handleRemoveReview(index)} color="error" size="small">
                                <Delete />
                            </IconButton>
                        </Box>
                    )}
                </Box>
            ))}
            <Button
                onClick={handleAddReview}
                variant="contained"
                color="info"
                className="mt-4"
                fullWidth
            >
                Add Review
            </Button>
        </Grid>
    );
};

ReviewSection.propTypes = {
    testimonials: PropTypes.array,
    handleReviewChange: PropTypes.func,
    handleAddReview: PropTypes.func,
    handleRemoveReview: PropTypes.func,
    handleFileChange: PropTypes.func
};

export default ReviewSection;
