import { useState } from "react";
import { Box, TextField, Pagination, MenuItem, Select, IconButton, Skeleton, Card, CardContent, CardMedia, Typography, Chip, Grid, Switch, Button, Tooltip } from "@mui/material";
import GenerateBlogModal from "./components/GenerateBlogModal";
import { useGetBlogs, useUpdateBlogBanner } from "queries/StoreQuery";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// -- Styles --
const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    height: "calc(100vh - 140px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchField: {
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "12px",
    width: "300px",
    "& fieldset": { border: "none" },
  },
  scrollContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "0 5px 20px 5px", // Extra bottom padding for scroll
  },
  card: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(10px)",
    borderRadius: "15px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
    height: "100%",
    display: "flex", // Enable flex layout
    flexDirection: "column", // Stack children vertically
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      "& .card-actions": {
        opacity: 1,
        bottom: 20
      }
    }
  },
  cardMedia: {
    height: 180,
    borderBottom: "1px solid rgba(0,0,0,0.05)"
  },
  cardContent: {
    flexGrow: 1, // Allow content to expand and fill space
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"

  },
  cardActionsOverlay: {
    position: "absolute",
    bottom: -50,
    left: 0,
    right: 0,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(5px)",
    padding: "10px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    opacity: 0,
    zIndex: 10
  },
  actionBtn: {
    minWidth: 40,
    width: 40,
    height: 40,
    borderRadius: "50%",
    padding: 0,
    border: "1px solid rgba(0,0,0,0.05)",
    "&:hover": {
      background: "#344767",
      color: "#fff",
      transform: "scale(1.1)"
    }
  },
  badge: (isActive) => ({
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
    background: isActive ? "rgba(46, 204, 113,0.15)" : "rgba(231, 76, 60, 0.15)",
    color: isActive ? "#27ae60" : "#c0392b",
    display: "inline-block",
  })
};

const TableData = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const { data, isLoading } = useGetBlogs({ page, perPage, sortBy, order, search });
  const { mutate: updateBanner } = useUpdateBlogBanner();

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  const handleBannerChange = (blogId, isBanner) => {
    // Optimistic or simple toggle, logic preserved from original
    updateBanner({ blogId, banner: isBanner });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <TextField
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          sx={styles.searchField}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Button
            variant="contained"
            color="info"
            size="small"
            startIcon={<Box component="i" className="ni ni-bulb-61" />}
            onClick={() => setAiModalOpen(true)}
            sx={{ color: "#fff", fontWeight: "bold" }}
          >
            Auto Generate w/ AI
          </Button>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ height: 40, background: "rgba(255,255,255,0.8)", borderRadius: "10px", minWidth: 140 }}
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="isImportant">Importance</MenuItem>
          </Select>
          <IconButton onClick={() => setOrder(order === "asc" ? "desc" : "asc")} sx={{ background: "rgba(255,255,255,0.8)" }}>
            <Box component="i" className={`ni ni-bold-${order === "asc" ? "up" : "down"}`} fontSize="12px" />
          </IconButton>
        </div>
      </div>

      <div style={styles.scrollContainer}>
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ ...styles.card, opacity: 0.7 }}>
                  <Skeleton variant="rectangular" height={180} />
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Skeleton variant="rounded" width={60} height={24} />
                      <Skeleton variant="rounded" width={40} height={24} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Grid container spacing={3}>
              {data?.data?.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={item._id}>
                  <motion.div variants={itemVariants} style={{ height: "100%" }}>
                    <Card sx={styles.card}>
                      <Box className="card-actions" sx={styles.cardActionsOverlay}>
                        <Tooltip title="View Live">
                          <IconButton
                            component="a"
                            href={`/blogs/${item?.href || item?._id}`} // Assuming client route structure
                            target="_blank"
                            size="small"
                            sx={{ ...styles.actionBtn, color: "#11cdef", background: "#f8f9fa" }}
                          >
                            <Box component="i" className="ni ni-glasses-2" fontSize="14px" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Live Edit">
                          <IconButton
                            component={Link}
                            to={`/blogs/editBlog/${item?._id}`}
                            size="small"
                            sx={{ ...styles.actionBtn, color: "#2dce89", background: "#f8f9fa" }}
                          >
                            <Box component="i" className="ni ni-ruler-pencil" fontSize="14px" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <CardMedia
                        component="img"
                        image={`${process.env.REACT_APP_API_URL}/uploads/${item?.image}`}
                        alt={item?.title}
                        sx={styles.cardMedia}
                      />

                      <CardContent style={styles.cardContent}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" noWrap title={item?.title} gutterBottom color="#344767">
                            {item?.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: 40 }}>
                            {item?.subtitle}
                          </Typography>
                        </Box>

                        <Box>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <div style={styles.badge(item?.status)}>
                              {item?.status ? "Active" : "Blocked"}
                            </div>
                            <Box display="flex" alignItems="center" gap={1}>
                              <span style={{ fontSize: "12px", color: "#666", fontWeight: "600" }}>Banner:</span>
                              <Switch
                                size="small"
                                checked={item?.banner || false}
                                onChange={(e) => handleBannerChange(item?._id, e.target.checked)}
                                color="info"
                              />
                            </Box>
                          </Box>

                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="textSecondary">
                              {new Date(item?.createdAt).toDateString()}
                            </Typography>
                            {item?.isImportant && (
                              <Chip label="Important" size="small" color="warning" variant="outlined" sx={{ height: 20, fontSize: 10, borderRadius: "5px" }} />
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </div>

      {/* Pagination component commented out if API doesn't return totalDocs, otherwise uncomment */}
      {/* <Box display="flex" justifyItems="center" justifyContent="center" mt={3} py={2}>
        <Pagination
          count={Math.ceil((data?.totalDocs || 0) / perPage)}
          page={page}
          onChange={(e, v) => setPage(v)}
          color="primary"
          shape="rounded"
        />
      </Box> */}
      <GenerateBlogModal open={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    </div>
  );
};

export default TableData;
