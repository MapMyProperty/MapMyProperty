import { Alert, Box, Button, Grid, ToggleButton, Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import PageLayout from 'layouts/PageLayout';
import toast from "react-hot-toast";
import Input from "components/Input";
import { useNavigate, useParams } from "react-router-dom";
import { useEditBanners, useGetBannersById, useDeleteBanners } from "queries/StoreQuery";
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
      maxWidth: "800px",
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

const EditBanner = () => {
   const { id } = useParams();
   const navigate = useNavigate()
   const { data: res, isLoading } = useGetBannersById({ id });
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
      setData(prev => ({ ...prev, image: file }));
   };

   const handleChange = (e) => {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const { mutateAsync: editBanners, isLoading: updating } = useEditBanners()
   const { mutateAsync: deleteBanner, isLoading: deleting } = useDeleteBanners()

   const handleDelete = () => {
      if (window.confirm("Are you sure you want to delete this banner?")) {
         deleteBanner(data)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "Banner deleted Successfully");
                  navigate('/banners')
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
         if (!data?.url) return toast.error("Target URL is required");
         if (!data?.description) return toast.error("Description is required");
         if (!data?.image && !data?.src) return toast.error("Image is required");

         const formData = new FormData();
         for (const key in data) {
            if (data.hasOwnProperty(key) && key !== "image") {
               formData.append(key, data[key]);
            }
         }
         // Only append image if it's a new file object
         data?.type === "image" && typeof (data.image) == 'object' && formData.append("image", data?.image, data?.image?.name);

         editBanners(formData)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "Banner updated Successfully");
                  navigate('/banners')
               }
            })
            .catch((err) => {
               toast.error(err?.message ?? "Something went wrong");
            });

      } catch (error) {
         console.error(error)
      }
   }

   return (
      <PageLayout title={'Edit Banner'}>
         <Box sx={{ flexGrow: 1, py: 3 }}>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
               <Box sx={styles.container}>
                  <Typography sx={styles.title}>Edit Banner</Typography>

                  {isLoading ? (
                     <Typography textAlign="center">Loading banner details...</Typography>
                  ) : (
                     <Grid container spacing={3}>
                        {/* Text Inputs */}
                        <Grid item xs={12} md={6}>
                           <Typography sx={styles.sectionTitle}>Details</Typography>
                           <Input
                              required
                              placeholder="Banner Title"
                              name="title"
                              value={data?.title || ''}
                              onChange={handleChange}
                              fullWidth
                              sx={{ mb: 2 }}
                           />
                           <Input
                              required
                              placeholder="Banner Subtitle"
                              name="subtitle"
                              value={data?.subtitle || ''}
                              onChange={handleChange}
                              fullWidth
                              sx={{ mb: 2 }}
                           />
                           <Input
                              required
                              placeholder="Target URL (e.g., /products/new)"
                              name="url"
                              value={data?.url || ''}
                              onChange={handleChange}
                              fullWidth
                              sx={{ mb: 2 }}
                           />
                           <Box display="flex" alignItems="center" gap={2} mb={2}>
                              <Typography variant="body2" fontWeight="bold">Status:</Typography>
                              <ToggleButton
                                 value={data?.status}
                                 selected={data?.status}
                                 onChange={() => setData(prev => ({ ...prev, status: !data?.status }))}
                                 size="small"
                                 color="primary"
                                 sx={{ borderRadius: "10px", padding: "5px 20px" }}
                              >
                                 {data?.status ? 'Active' : 'Blocked'}
                              </ToggleButton>
                           </Box>
                        </Grid>

                        {/* Image Upload */}
                        <Grid item xs={12} md={6}>
                           <Typography sx={styles.sectionTitle}>Banner Image</Typography>
                           <Box sx={styles.uploadBox} onClick={handleFileSelect}>
                              {data?.image || data?.src ? (
                                 <img
                                    style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", borderRadius: "10px" }}
                                    src={
                                       typeof (data?.image) == 'object'
                                          ? URL.createObjectURL(data.image)
                                          : `${process.env.REACT_APP_API_URL}/uploads/${data.src}`
                                    }
                                    alt="Banner Preview"
                                 />
                              ) : (
                                 <>
                                    <Box component="i" className="ni ni-cloud-upload-96" fontSize="40px" color="#aaa" mb={1} />
                                    <Typography variant="body2" color="textSecondary" fontWeight="bold">
                                       Click to Upload Image
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                       Recommended: 1280x720 (4:5)
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

                        {/* Description */}
                        <Grid item xs={12}>
                           <Typography sx={styles.sectionTitle}>Description</Typography>
                           <Input
                              name="description"
                              placeholder="Write a short description..."
                              value={data?.description || ''}
                              onChange={handleChange}
                              fullWidth
                              multiline
                              rows={3}
                           />
                           <Alert color="primary" severity="info" sx={{ mt: 2, fontSize: 13, borderRadius: "10px" }}>
                              Ensure your image is less than 2MB and in JPG/PNG format for best performance.
                           </Alert>
                        </Grid>

                        {/* Action Buttons */}
                        <Grid item xs={12} mt={2} display="flex" gap={2}>
                           <Button
                              onClick={handleSubmit}
                              disabled={updating}
                              variant="contained"
                              color="info"
                              fullWidth
                              sx={{ py: 1.5, fontSize: "16px", borderRadius: "10px", boxShadow: "0 4px 14px 0 rgba(0,188,212,0.39)" }}
                           >
                              {updating ? "Updating..." : "Update Banner"}
                           </Button>

                           <Button
                              onClick={handleDelete}
                              disabled={deleting}
                              variant="outlined"
                              color="error"
                              fullWidth
                              sx={{ py: 1.5, fontSize: "16px", borderRadius: "10px" }}
                           >
                              {deleting ? "Deleting..." : "Delete Banner"}
                           </Button>
                        </Grid>
                     </Grid>
                  )}
               </Box>
            </motion.div>
         </Box>
      </PageLayout>
   )
}

export default EditBanner