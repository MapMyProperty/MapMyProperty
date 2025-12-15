import React from "react";
import { Autocomplete, Grid, TextField, Typography } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import TextEditor from "utils/TextEditor";
import EditorJSON from "../EditorJSON";
import PropTypes from "prop-types";

const BasicDetails = ({
    details,
    setDetails,
    handleChange,
    category,
    setCategory,
    builder,
    setBuilders,
    categories,
    builders
}) => {
    return (
        <Grid item container spacing={2} xs={12}>
            <Grid item xs={10} display={"flex"} alignItems={"center"} gap={1}>
                <Typography variant="h6">Basic Details</Typography>
                <Typography variant="caption" color="error">
                    *required
                </Typography>
            </Grid>
            <EditorJSON details={details} setDetails={setDetails} />
            <Grid item xs={12}>
                <Typography variant="caption">
                    Project Title <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                    required
                    placeholder="Project Title"
                    id="title"
                    name="title"
                    value={details?.title || ""}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption">
                    Project Subtitle <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                    required
                    placeholder="Project sub title"
                    id="subtitle"
                    name="subtitle"
                    value={details?.subtitle || ""}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="caption">
                    Project Category <span style={{ color: "red" }}>*</span>
                </Typography>
                <Autocomplete
                    id="category-select"
                    options={categories?.data || []}
                    value={category}
                    onChange={(event, newValue) => {
                        setCategory(newValue);
                    }}
                    autoHighlight
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image}`}
                                alt={option?.name}
                            />
                            <Typography color="inherit" variant="caption">
                                {option?.name} <br />
                                {option?.desc}
                            </Typography>
                            <Typography
                                sx={{ ml: "auto" }}
                                color={option?.isAvailable ? "success" : "error"}
                                variant="caption"
                            >
                                {option?.isAvailable ? "available" : "NA"}
                            </Typography>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Choose a category"
                            inputProps={{
                                ...params.inputProps,
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="caption">
                    Builder <span style={{ color: "red" }}>*</span>
                </Typography>
                <Autocomplete
                    id="Builders-select"
                    options={builders?.data || []}
                    value={builder}
                    onChange={(event, newValue) => {
                        setBuilders(newValue);
                    }}
                    autoHighlight
                    getOptionLabel={(option) => option.title || ""}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image}`}
                                alt={option?.title}
                            />
                            <Typography color="inherit" variant="caption">
                                {option?.title} <br />
                                {option?.subtitle}
                            </Typography>
                            <Typography
                                sx={{ ml: "auto" }}
                                color={option?.isAvailable ? "success" : "error"}
                                variant="caption"
                            >
                                {option?.isAvailable ? "available" : "NA"}
                            </Typography>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Choose a builder"
                            inputProps={{
                                ...params.inputProps,
                            }}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant="caption">
                    Project Status <span style={{ color: "red" }}>*</span>
                </Typography>
                <Autocomplete
                    value={details?.status || ""}
                    onChange={(event, newValue) => {
                        setDetails((prev) => ({ ...prev, status: newValue }));
                    }}
                    options={["Pre Launch", "Launch", "Under Construction", "Ready to Move In"]}
                    renderInput={(params) => (
                        <TextField {...params} placeholder="Select Status" required />
                    )}
                    sx={{
                        "& .MuiAutocomplete-input": {
                            padding: "10px 14px",
                        },
                    }}
                />
            </Grid>
            <Grid item xs={12} mb={2}>
                <Typography variant="caption">
                    Project Overview <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextEditor value={details?.description || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="caption">
                    Min property value <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                    required
                    type="number"
                    placeholder="Min Price"
                    id="minPrice"
                    name="minPrice"
                    value={details.minPrice}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={6}>
                <Typography variant="caption">
                    Max property value <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                    required
                    type="number"
                    placeholder="Max Price"
                    id="maxPrice"
                    name="maxPrice"
                    value={details.maxPrice}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption">
                    Property URL <span style={{ color: "red" }}>*</span> (avoid blank spaces, numbers or
                    special characters for better performance. use &apos;-&apos; to connect words.)
                </Typography>
                <Input
                    required
                    placeholder="Slug URL (href)"
                    id="href"
                    name="href"
                    value={details.href}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="caption">
                    Property Location <span style={{ color: "red" }}>*</span>
                </Typography>
                <Input
                    required
                    placeholder="Project Location"
                    id="location"
                    name="location"
                    value={details?.location || ""}
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    );
};

BasicDetails.propTypes = {
    details: PropTypes.object,
    setDetails: PropTypes.func,
    handleChange: PropTypes.func,
    category: PropTypes.object,
    setCategory: PropTypes.func,
    builder: PropTypes.object,
    setBuilders: PropTypes.func,
    categories: PropTypes.object,
    builders: PropTypes.object
};

export default BasicDetails;
