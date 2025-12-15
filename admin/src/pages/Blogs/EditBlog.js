import { Alert, Box, Button, Grid, ToggleButton, Typography, MenuItem, Select } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageLayout from "layouts/PageLayout";
import toast from "react-hot-toast";
import Input from "components/Input";
import { useEditBlogs } from "queries/StoreQuery";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBlogsById } from "queries/StoreQuery";
import { useDeleteBlogs } from "queries/StoreQuery";
import TextEditor from "./TextEditor";
import { motion } from "framer-motion";

// -- Styles --
const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  uploadBox: {
    width: "100%",
    minHeight: 200,
    cursor: "pointer",
    background: "rgba(255,255,255,0.5)",
    border: "2px dashed #ccc",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    transition: "all 0.3s ease",
    padding: "20px",
    "&:hover": {
      background: "rgba(255,255,255,0.8)",
      borderColor: "#11cdef",
    },
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#344767",
    marginBottom: "20px",
    textAlign: "center"
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#344767",
    marginTop: "20px",
    marginBottom: "10px",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    paddingBottom: "5px"
  }
};

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: res, isLoading } = useGetBlogsById({ id });
  const [data, setData] = useState({});

  useEffect(() => {
    if (res?.data) {
      setData(res.data);
    }
  }, [res]);

  const fileInputRef = React.useRef(null);
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setData((prev) => ({ ...prev, image: file }));
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutateAsync: editBlogs, isLoading: updating } = useEditBlogs();
  const { mutateAsync: deleteBlog, isLoading: deleting } = useDeleteBlogs();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlog(data)
        .then((res) => {
          if (res) {
            toast.success(res?.message ?? "Blog deleted Successfully");
            navigate("/blogs");
          }
        })
        .catch((err) => {
          toast.error(err?.message ?? "Something went wrong");
        });
    }
  };

  const handleSubmit = () => {
    try {
      if (!data?.title) return toast.error("Title is required");
      if (!data?.subtitle) return toast.error("Subtitle is required");
      if (!data?.url) return toast.error("URL is required");
      if (!data?.description) return toast.error("Description is required");
      if (!data?.image) return toast.error("Image is required");

      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key) && key !== "image") {
          formData.append(key, data[key]);
        }
      }
      // Only append image if it's a new file object
      typeof data.image == "object" && formData.append("image", data.image, data?.image?.name);

      editBlogs(formData)
        .then((res) => {
          if (res) {
            toast.success(res?.message ?? "Blog updated Successfully");
            navigate("/blogs");
          }
        })
        .catch((err) => {
          toast.error(err?.message ?? "Something went wrong");
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout title={"Edit Blog"}>
      <Box sx={{ flexGrow: 1, py: 3 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.container}>
            <Typography sx={styles.title}>Edit Blog Post</Typography>

            {isLoading ? (
              <Typography textAlign="center">Loading blog details...</Typography>
            ) : (
              <Grid container spacing={3}>
                {/* Left Column: Details */}
                <Grid item xs={12} md={7}>
                  <Typography sx={styles.sectionTitle}>Details</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Input
                        required
                        placeholder="Blog Title"
                        name="title"
                        value={data?.title || ""}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Input
                        required
                        placeholder="Blog Subtitle"
                        name="subtitle"
                        value={data?.subtitle || ""}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Input
                        required
                        placeholder="Target URL (e.g., top-10-properties)"
                        name="url"
                        value={data?.url || ""}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Box mt={2}>
                    <Typography sx={styles.sectionTitle}>Content</Typography>
                    <TextEditor value={data?.description || ""} onChange={handleChange} />
                  </Box>
                </Grid>

                {/* Right Column: Settings & Image */}
                <Grid item xs={12} md={5}>
                  <Typography sx={styles.sectionTitle}>Settings</Typography>

                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" fontWeight="bold">Blog Status:</Typography>
                    <ToggleButton
                      value={data?.status}
                      selected={data?.status}
                      onChange={() => setData(prev => ({ ...prev, status: !data?.status }))}
                      size="small"
                      color="success"
                      sx={{ borderRadius: "10px", padding: "5px 20px" }}
                    >
                      {data?.status ? "Active" : "Blocked"}
                    </ToggleButton>
                  </Box>

                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" fontWeight="bold">Important:</Typography>
                    <ToggleButton
                      value={data?.isImportant}
                      selected={data?.isImportant}
                      onChange={() => setData(prev => ({ ...prev, isImportant: !data?.isImportant }))}
                      size="small"
                      color="warning"
                      sx={{ borderRadius: "10px", padding: "5px 20px" }}
                    >
                      {data?.isImportant ? "Important" : "Standard"}
                    </ToggleButton>
                  </Box>
                  {data?.isImportant && (
                    <Alert severity="warning" sx={{ mb: 2, fontSize: 11, borderRadius: "10px" }}>
                      Important blogs are featured on the homepage.
                    </Alert>
                  )}

                  <Typography variant="body2" fontWeight="bold" mb={1}>Display Size:</Typography>
                  <Select
                    name="type"
                    value={data?.type || "1"}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mb: 3, background: "white", borderRadius: "10px" }}
                  >
                    <MenuItem value="1">Small (Title & Subtitle)</MenuItem>
                    <MenuItem value="2">Medium (Title & Image)</MenuItem>
                    <MenuItem value="3">Large (Full Height Image)</MenuItem>
                  </Select>

                  <Typography sx={styles.sectionTitle}>Thumbnail</Typography>
                  <Box sx={styles.uploadBox} onClick={handleFileSelect}>
                    {data?.image ? (
                      <img
                        style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain", borderRadius: "10px" }}
                        src={
                          typeof data?.image == "object"
                            ? URL.createObjectURL(data.image)
                            : `${process.env.REACT_APP_API_URL}/uploads/${data.image}`
                        }
                        alt="Preview"
                      />
                    ) : (
                      <>
                        <Box component="i" className="ni ni-cloud-upload-96" fontSize="40px" color="#aaa" mb={1} />
                        <Typography variant="body2" color="textSecondary" fontWeight="bold">
                          Upload Image
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          1280x720 (16:9)
                        </Typography>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </Box>

                  {/* Action Buttons */}
                  <Grid item xs={12} mt={3} display="flex" gap={2}>
                    <Button
                      onClick={handleSubmit}
                      disabled={updating}
                      variant="contained"
                      color="info"
                      fullWidth
                      sx={{ py: 1.5, fontSize: "16px", borderRadius: "10px", boxShadow: "0 4px 14px 0 rgba(0,188,212,0.39)" }}
                    >
                      {updating ? "Updating..." : "Update Post"}
                    </Button>

                    <Button
                      onClick={handleDelete}
                      disabled={deleting}
                      variant="outlined"
                      color="error"
                      fullWidth
                      sx={{ py: 1.5, fontSize: "16px", borderRadius: "10px" }}
                    >
                      {deleting ? "Deleting..." : "Delete Post"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Box>
        </motion.div>
      </Box>
    </PageLayout>
  );
};

export default EditBlog;
