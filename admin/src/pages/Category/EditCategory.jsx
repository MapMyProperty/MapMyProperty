import { Alert, Box, Button, Grid, ToggleButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageLayout from "layouts/PageLayout";
import toast from "react-hot-toast";
import Input from "components/Input";
import { useNavigate, useParams } from "react-router-dom";
import { useEditCategorys, useGetCategorysById, useDeleteCategorys } from "queries/ProductQuery";
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

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: res, isLoading } = useGetCategorysById({ id });
  const [data, setData] = useState({});

  useEffect(() => {
    setData(res?.data);
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
  const { mutateAsync: editCategory, isLoading: updating } = useEditCategorys();
  const { mutateAsync: deleteCategory, isLoading: deleting } = useDeleteCategorys();

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    deleteCategory(data)
      .then((res) => {
        if (res) {
          toast.success(res?.message ?? "Category deleted Successfully");
          navigate("/category");
        }
      })
      .catch((err) => {
        toast.error(err?.message ?? "Something went wrong");
      });
  };

  const handleSubmit = () => {
    try {
      if (!data?.name) return toast.error("name is required");
      if (!data?.desc) return toast.error("description is required");
      if (!data?.image) return toast.error("image is required");

      const formData = new FormData();
      for (const key in data) {
        if (data.hasOwnProperty(key) && key !== "image" && key !== "countries") {
          formData.append(key, data[key]);
        }
      }

      typeof data.image == "object" && formData.append("image", data.image, data?.image?.name);

      editCategory(formData)
        .then((res) => {
          if (res) {
            toast.success(res?.message ?? "Category updated Successfully");
            navigate("/category");
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
    <PageLayout title={"Edit Category"}>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.container}>
            <Typography sx={styles.title}>Edit Category</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Input
                  required
                  placeholder="Category Name"
                  id="name"
                  name="name"
                  value={data?.name || ""}
                  onChange={handleChange}
                  fullWidth
                  autoComplete="name"
                />
              </Grid>

              <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="center">
                <ToggleButton
                  value={data?.isAvailable}
                  selected={data?.isAvailable}
                  onChange={() => {
                    setData((prev) => ({ ...prev, isAvailable: !data?.isAvailable }));
                  }}
                  sx={{
                    borderRadius: "10px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    px: 3,
                    background: data?.isAvailable ? "rgba(46, 204, 113,0.1) !important" : "rgba(231, 76, 60, 0.1) !important",
                    color: data?.isAvailable ? "#27ae60 !important" : "#c0392b !important",
                    fontWeight: "bold"
                  }}
                >
                  {data?.isAvailable ? "Active" : "Blocked"}
                </ToggleButton>
              </Grid>

              <Grid item xs={12}>
                <Input
                  id="description"
                  name="desc"
                  placeholder="Category Description"
                  value={data?.desc || ""}
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
                      src={
                        typeof data?.image == "object"
                          ? URL.createObjectURL(data.image)
                          : `${process.env.REACT_APP_API_URL}/uploads/${data.image}`
                      }
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
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={updating}
                    sx={{ boxShadow: "none", "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" } }}
                  >
                    {updating ? "Updating..." : "Save Changes"}
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleDelete}
                    disabled={deleting}
                    sx={{
                      flex: 1,
                      borderColor: "#e74c3c",
                      color: "#e74c3c",
                      "&:hover": {
                        background: "rgba(231, 76, 60, 0.05)",
                        borderColor: "#c0392b"
                      }
                    }}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </Box>
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

export default EditCategory;
