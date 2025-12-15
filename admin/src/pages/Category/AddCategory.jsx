import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from 'react';
import PageLayout from 'layouts/PageLayout';
import { useAddCategory } from "queries/ProductQuery";
import toast from "react-hot-toast";
import Input from "components/Input";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  uploadBox: {
    width: "100%",
    height: 120,
    cursor: "pointer",
    background: "rgba(255,255,255,0.5)",
    border: "2px dashed #ccc",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255,255,255,0.8)",
      borderColor: "#777",
    },
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#344767",
    marginBottom: "20px",
    textAlign: "center"
  }
};

const AddCategory = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const fileInputRef = React.useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setData(prev => ({ ...prev, image: file }));
  };

  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { mutateAsync: addCategory, isLoading } = useAddCategory();

  const handleSubmit = () => {
    try {
      if (!data?.name) return toast.error("name is required");
      if (!data?.desc) return toast.error("description is required");
      if (!data?.image) return toast.error("image is required");

      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key) && key !== "image") {
          formData.append(key, data[key]);
        }
      }
      typeof (data.image) == 'object' && formData.append("image", data.image, data?.image?.name);
      addCategory(formData)
        .then((res) => {
          toast.success(res?.message ?? "category added");
          navigate('/category');
        })
        .catch((err) => {
          toast.error(err?.message ?? "Something went wrong");
        });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout title={'Add Category'}>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.container}>
            <Typography sx={styles.title}>Add New Category</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Input
                  required
                  placeholder="Category Name"
                  id="name"
                  name="name"
                  value={data?.name || ''}
                  onChange={handleChange}
                  fullWidth
                  autoComplete="name"
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  id="description"
                  name="desc"
                  placeholder="Category Description"
                  value={data?.desc || ''}
                  onChange={handleChange}
                  fullWidth
                  autoComplete="Description"
                  multiline
                  rows={4}
                />
                <Typography variant="caption" color="text" sx={{ mt: 1, display: "block" }}>
                  Short Description (about 10-20 words)
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={styles.uploadBox} onClick={handleFileSelect}>
                  {data?.image ? (
                    <img
                      style={{ width: "100%", height: "100%", objectFit: "contain", padding: 10 }}
                      src={typeof (data?.image) == 'object' ? URL.createObjectURL(data.image) : `${process.env.REACT_APP_BASE_URL}/${data.image}`}
                      alt="preview"
                    />
                  ) : (
                    <>
                      <Box component="i" className="ni ni-cloud-upload-96" fontSize="24px" color="#aaa" mb={1} />
                      <Typography variant="caption" fontWeight="bold" color="text">
                        Upload Thumbnail
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
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={isLoading}
                  sx={{ boxShadow: "none", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } }}
                >
                  {isLoading ? "Adding..." : "Add Category"}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info" sx={{ background: "rgba(255,255,255,0.5)", fontSize: 13, border: "1px solid rgba(0,0,0,0.05)" }}>
                  <ul style={{ margin: "0", paddingLeft: "20px" }}>
                    <li>Dimensions: 1280x720 pixels (16:9)</li>
                    <li>Max size: 2MB</li>
                    <li>Format: JPG, PNG, JPEG</li>
                  </ul>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Box>
    </PageLayout>
  );
};

export default AddCategory;