import { Alert, Box, Button, Grid, ToggleButton, Typography, Autocomplete, TextField } from "@mui/material";
import React, { useState } from 'react'
import PageLayout from 'layouts/PageLayout';
import toast from "react-hot-toast";
import Input from "components/Input";
import { useAddTags } from "queries/StoreQuery";
import { useNavigate } from "react-router-dom";
import { useGetSelectProjects } from 'queries/ProductQuery'
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

const AddTag = () => {
   const [datas, setData] = useState({ status: true })
   const { data, isLoading } = useGetSelectProjects({ pageNo: 1, pageCount: 100 });
   const [projects, setProjects] = useState([])
   const navigate = useNavigate()
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
   const { mutateAsync: addTags, isLoading: loading } = useAddTags()

   const handleSubmit = () => {
      try {
         if (!datas?.title) return toast.error("Title is required");
         if (!datas?.subtitle) return toast.error("Subtitle is required");
         if (!projects.length) return toast.error("At least one project is required");
         if (!datas?.description) return toast.error("Description is required");
         if (!datas?.image) return toast.error("Image is required");

         const formData = new FormData();
         for (const key in datas) {
            if (datas.hasOwnProperty(key) && key !== "image") {
               formData.append(key, datas[key]);
            }
         }
         typeof (datas.image) == 'object' && formData.append("image", datas?.image, datas?.image?.name);
         projects.forEach((proj) => formData.append('projects', proj._id));

         addTags(formData)
            .then((res) => {
               if (res) {
                  toast.success(res?.message ?? "Tags added Successfully");
                  navigate('/tags')
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
      <PageLayout title={'Add Tags'}>
         <Box sx={{ flexGrow: 1, py: 3 }}>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
            >
               <Box sx={styles.container}>
                  <Typography sx={styles.title}>Create New Tag</Typography>

                  <Grid container spacing={3}>
                     {/* Text Inputs */}
                     <Grid item xs={12} md={6}>
                        <Typography sx={styles.sectionTitle}>Details</Typography>
                        <Input
                           required
                           placeholder="Tag Title"
                           name="title"
                           value={datas?.title || ''}
                           onChange={handleChange}
                           fullWidth
                           sx={{ mb: 2 }}
                        />
                        <Input
                           required
                           placeholder="Tag Subtitle"
                           name="subtitle"
                           value={datas?.subtitle || ''}
                           onChange={handleChange}
                           fullWidth
                           sx={{ mb: 2 }}
                        />

                        <Autocomplete
                           multiple
                           options={data?.data || []}
                           value={projects}
                           onChange={(event, newValue) => setProjects(newValue)}
                           getOptionLabel={(option) => option.title}
                           renderInput={(params) => (
                              <TextField
                                 {...params}
                                 placeholder="Select Projects"
                                 variant="outlined"
                                 sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                       borderRadius: "10px",
                                       background: "white"
                                    }
                                 }}
                              />
                           )}
                           renderOption={(props, option) => (
                              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                 <img
                                    loading="lazy"
                                    width="20"
                                    src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image}`}
                                    alt=""
                                 />
                                 <Box>
                                    <Typography variant="body2">{option?.title}</Typography>
                                    <Typography variant="caption" color={option?.isAvailable ? 'success.main' : 'error.main'}>
                                       {option?.isAvailable ? 'Available' : 'NA'}
                                    </Typography>
                                 </Box>
                              </Box>
                           )}
                        />

                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                           <Typography variant="body2" fontWeight="bold">Status:</Typography>
                           <ToggleButton
                              value={datas?.status}
                              selected={datas?.status}
                              onChange={() => setData(prev => ({ ...prev, status: !datas?.status }))}
                              size="small"
                              color="primary"
                              sx={{ borderRadius: "10px", padding: "5px 20px" }}
                           >
                              {datas?.status ? 'Active' : 'Blocked'}
                           </ToggleButton>
                        </Box>
                     </Grid>

                     {/* Image Upload */}
                     <Grid item xs={12} md={6}>
                        <Typography sx={styles.sectionTitle}>Tag Image</Typography>
                        <Box sx={styles.uploadBox} onClick={handleFileSelect}>
                           {datas?.image ? (
                              <img
                                 style={{ maxWidth: "100%", maxHeight: 180, objectFit: "contain", borderRadius: "10px" }}
                                 src={typeof (datas?.image) == 'object' ? URL.createObjectURL(datas.image) : datas.image}
                                 alt="Tag Preview"
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
                           value={datas?.description || ''}
                           onChange={handleChange}
                           fullWidth
                           multiline
                           rows={3}
                        />
                     </Grid>

                     {/* Submit Button */}
                     <Grid item xs={12} mt={2}>
                        <Button
                           onClick={handleSubmit}
                           disabled={loading}
                           variant="contained"
                           color="info"
                           fullWidth
                           sx={{ py: 1.5, fontSize: "16px", borderRadius: "10px", boxShadow: "0 4px 14px 0 rgba(0,188,212,0.39)" }}
                        >
                           {loading ? "Creating..." : "Create Tag"}
                        </Button>
                     </Grid>
                  </Grid>
               </Box>
            </motion.div>
         </Box>
      </PageLayout>
   )
}

export default AddTag