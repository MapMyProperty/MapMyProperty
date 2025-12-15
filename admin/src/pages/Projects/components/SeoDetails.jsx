import React from "react";
import { Grid, Typography } from "@mui/material";
import Input from "components/Input";
import PropTypes from "prop-types";

const SeoDetails = ({ details, handleChange }) => {
    return (
        <>
            <Grid item xs={12}>
                <Typography variant="h6" mt={2}>
                    SEO Meta Data
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption">Meta Title</Typography>
                <Input
                    placeholder="Meta Title"
                    id="metaTitle"
                    name="metaTitle"
                    value={details?.metaTitle || ""}
                    onChange={handleChange}
                />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption">Meta Description</Typography>
                <Input
                    placeholder="Meta Description"
                    id="metaDescription"
                    name="metaDescription"
                    value={details?.metaDescription || ""}
                    onChange={handleChange}
                    multiline
                    rows={3}
                />
            </Grid>

            <Grid item xs={12}>
                <Typography variant="caption">Meta Keywords</Typography>
                <Input
                    placeholder="Meta Keywords (comma separated)"
                    id="metaKeywords"
                    name="metaKeywords"
                    value={details?.metaKeywords || ""}
                    onChange={handleChange}
                    multiline
                    rows={3}
                />
            </Grid>
        </>
    );
};

SeoDetails.propTypes = {
    details: PropTypes.object,
    handleChange: PropTypes.func
};

export default SeoDetails;
