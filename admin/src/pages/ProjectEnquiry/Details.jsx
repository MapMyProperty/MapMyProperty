import React, { useState } from "react";
import PageLayout from "layouts/PageLayout";
import { Grid, Typography, Button, Box, Divider } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// -- Styles --
const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    marginTop: "20px",
    maxWidth: "800px",
    margin: "20px auto",
  },
  label: {
    fontWeight: "600",
    color: "#344767",
    fontSize: "14px",
    marginBottom: "4px"
  },
  value: {
    color: "#555",
    fontSize: "15px",
    wordBreak: "break-word"
  },
  sectionHeader: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#11cdef",
    marginTop: "10px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center"
  },
  backButton: {
    marginBottom: "20px",
    color: "#666",
    textTransform: "none",
    fontWeight: "600"
  },
  infoBox: {
    background: "rgba(255,255,255,0.5)",
    padding: "20px",
    borderRadius: "15px",
    height: "100%"
  }
};

const DetailItem = ({ label, value, isLink, href }) => (
  <Grid item xs={12} sm={6}>
    <Box mb={2}>
      <Typography sx={styles.label}>{label}</Typography>
      {isLink ? (
        <a href={href} target="_blank" rel="noreferrer" style={{ ...styles.value, color: "#11cdef", textDecoration: "none", fontWeight: "600" }}>
          {value}
        </a>
      ) : (
        <Typography sx={styles.value}>{value || "-"}</Typography>
      )}
    </Box>
  </Grid>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  isLink: PropTypes.bool,
  href: PropTypes.string,
};

const Details = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const item = state?.item;

  if (!item) {
    return (
      <PageLayout title="Enquiry Details">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="50vh">
          <Typography variant="h6" color="textSecondary">No Enquiry Selected</Typography>
          <Button onClick={() => navigate("/projectEnquiry")} sx={{ mt: 2 }} variant="contained" color="info">
            Go Back
          </Button>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Enquiry Details">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={styles.container}>
          <Button
            startIcon={<Box component="i" className="ni ni-bold-left" />}
            onClick={() => navigate("/projectEnquiry")}
            sx={styles.backButton}
          >
            Back to Enquiries
          </Button>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold" color="#344767">
              Enquiry Details
            </Typography>
            <Typography variant="caption" color="textSecondary">
              received on {new Date(item?.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Customer Information */}
            <Grid item xs={12} md={6}>
              <Box sx={styles.infoBox}>
                <Typography sx={styles.sectionHeader}>
                  <Box component="i" className="ni ni-single-02" mr={1} />
                  Customer Info
                </Typography>
                <Grid container>
                  <DetailItem label="Full Name" value={item?.name} />
                  <DetailItem label="Email Address" value={item?.email} isLink href={`mailto:${item?.email}`} />
                  <DetailItem label="Phone Number" value={item?.contactNumber} isLink href={`tel:${item?.contactNumber}`} />
                  <DetailItem label="Mode of Tour" value={item?.mode} />
                  <DetailItem label="Preferred Date" value={item?.date} />
                  <DetailItem label="Preferred Time Slot" value={item?.time} />
                </Grid>
              </Box>
            </Grid>

            {/* Project Information */}
            <Grid item xs={12} md={6}>
              <Box sx={styles.infoBox}>
                <Typography sx={styles.sectionHeader}>
                  <Box component="i" className="ni ni-building" mr={1} />
                  Project Interest
                </Typography>
                <Grid container>
                  <DetailItem
                    label="Project Name"
                    value={item?.projectId?.title}
                    isLink
                    href={`https://www.mapmyproperty.in/property/${item?.projectId?._id}`}
                  />
                  <DetailItem label="Location" value={item?.projectId?.location} />
                  <Grid item xs={12}>
                    <Box mb={2}>
                      <Typography sx={styles.label}>Related Links</Typography>
                      <Box display="flex" gap={2} flexWrap="wrap">
                        <Button
                          component="a"
                          href={`https://www.mapmyproperty.in/property/${item?.projectId?._id}`}
                          target="_blank"
                          size="small"
                          variant="outlined"
                          color="info"
                          startIcon={<Box component="i" className="ni ni-world-2" />}
                        >
                          View Project
                        </Button>
                        <Button
                          component="a"
                          href={`https://www.mapmyproperty.in/builder/${item?.projectId?.builder}`}
                          target="_blank"
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<Box component="i" className="ni ni-shop" />}
                        >
                          View Builder
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Message Area */}
            {item?.description && (
              <Grid item xs={12}>
                <Box sx={{ ...styles.infoBox, minHeight: "auto" }}>
                  <Typography sx={styles.sectionHeader}>
                    <Box component="i" className="ni ni-chat-round" mr={1} />
                    Message from Customer
                  </Typography>
                  <Typography sx={{ ...styles.value, fontStyle: "italic", lineHeight: 1.6 }}>
                    &quot;{item.description}&quot;
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </motion.div>
    </PageLayout>
  );
};

export default Details;
