import {
  Button,
  Grid,
  TextField,
  ToggleButton,
  Rating,
  IconButton,
  Box,
  Autocomplete,
} from "@mui/material";
import Input from "components/Input";
import PageLayout from "layouts/PageLayout";
import React, { useEffect, useState } from "react";
import Typography from "components/Typography";
import toast from "react-hot-toast";
import { useGetBuildersById, useUpdateBuilders } from "queries/ProductQuery";
import { useNavigate, useParams } from "react-router-dom";
import ImageSelector from "./ImageSelector";
import { Delete } from "@mui/icons-material";
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
    minHeight: 120,
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
      borderColor: "#777",
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

const EditBuilders = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const { data, isLoading } = useGetBuildersById({ id });

  useEffect(() => {
    if (data?.data) {
      setDetails(data.data);
    }
  }, [data]);

  const { mutateAsync: updateBuilders, isLoading: loading } = useUpdateBuilders();

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const fileInputRef = React.useRef(null);
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handlelogoFileChange = (event) => {
    const file = event.target.files[0];
    setDetails((prev) => ({ ...prev, logo: file }));
  };

  const handleSubmit = () => {
    let flag = true;

    try {
      if (!details?.title) return toast.error("title is required");
      if (!details?.subtitle) return toast.error("subtitle is required");
      if (!details?.image) return toast.error("image is required");
      if (!details?.logo) return toast.error("logo is required");
      if (!details?.description) return toast.error("description is required");
      if (!details?.vision) return toast.error("vision is required");
      if (!details?.url) return toast.error("url is required");
      if (!details?.location) return toast.error("location is required");

      const formData = new FormData();

      typeof details.image == "object" &&
        formData.append("images", details?.image, details?.image?.name);
      typeof details.logo == "object" &&
        formData.append("logo", details?.logo, details?.logo?.name);
      for (const key in details) {
        if (
          details.hasOwnProperty(key) &&
          key !== "image" &&
          key !== "faqs" &&
          key !== "testimonials" &&
          key !== "address" &&
          key !== "features" &&
          key !== "logo"
        ) {
          formData.append(key, details[key]);
        }
      }
      details?.features?.forEach((features) => {
        if (features.text === "") {
        } else {
          formData.append("featuresText", features.text);
          formData.append("featuresHelpertext", features.helpertext);
        }
      });
      details?.testimonials?.forEach((review, i) => {
        if (review.name === "") {
        } else {
          if (review.image) {
            formData.append(`reviewsName`, review.name);
            formData.append(`reviewsRating`, review.rating);
            formData.append(`reviewsReview`, review.review);
            formData.append(`reviews`, review.image);
            formData.append(
              `reviewsImagePocision`,
              typeof review.image === "object" ? "" : review.image
            );
          } else {
            toast.error(`reviews ${i + 1} field image is required`);
            flag = false;
          }
        }
      });

      if (flag) {
        updateBuilders(formData)
          .then((res) => {
            if (res) {
              toast.success(res?.message ?? "Builders updated successfully");
              localStorage.removeItem("addBuilderData");
              navigate("/builders");
            }
          })
          .catch((err) => {
            toast.error(err?.message ?? "Something went wrong");
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFeatures = () => {
    setDetails((prevData) => ({
      ...prevData,
      features: [...prevData.features, { text: "", helpertext: "" }],
    }));
  };
  const handleFeaturesChange = (index, field, value) => {
    const newconfiguration = [...details.features];
    newconfiguration[index] = { ...newconfiguration[index], [field]: value };
    setDetails((prevData) => ({ ...prevData, features: newconfiguration }));
  };

  const handleFeaturesRemove = (index) => {
    const newconfiguration = details.features.filter((_, i) => i !== index);
    setDetails((prevData) => ({ ...prevData, features: newconfiguration }));
  };

  const handleAddReview = () => {
    setDetails((prevData) => ({
      ...prevData,
      testimonials: [...prevData.testimonials, { name: "", rating: 0, review: "" }],
    }));
  };

  const handleReviewChange = (reviewIndex, field, value) => {
    const newReviews = [...details.testimonials];
    newReviews[reviewIndex] = { ...newReviews[reviewIndex], [field]: value };
    setDetails((prevData) => ({ ...prevData, testimonials: newReviews }));
  };

  const handleRemoveReview = (reviewIndex) => {
    const newReviews = details.testimonials.filter((_, i) => i !== reviewIndex);
    setDetails((prevData) => ({ ...prevData, testimonials: newReviews }));
  };

  const handleFileChange = (field, index, e) => {
    const file = e.target.files[0];
    const updated = [...details[field]];
    updated[index]["image"] = file;
    setDetails((prev) => ({ ...prev, [field]: updated }));
  };

  return (
    <PageLayout title={"Edit Builders"}>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <Typography>Loading Builder Details...</Typography>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={styles.container}>
              <Typography sx={styles.title}>Edit Builder: {details?.title}</Typography>

              <Grid container spacing={3}>
                {/* Basic Details */}
                <Grid item xs={12} md={6}>
                  <Typography sx={styles.sectionTitle}>Basic Info</Typography>
                  <Input
                    required
                    placeholder="Builder Name"
                    id="title"
                    name="title"
                    value={details?.title || ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Input
                    required
                    placeholder="Subtitle/Tagline"
                    id="subtitle"
                    name="subtitle"
                    value={details?.subtitle || ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Input
                    required
                    placeholder="Location"
                    id="location"
                    name="location"
                    value={details?.location || ""}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Input
                    required
                    placeholder="URL Slug"
                    id="url"
                    name="url"
                    value={details?.url || ""}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>

                {/* Media Uploads */}
                <Grid item xs={12} md={6}>
                  <Typography sx={styles.sectionTitle}>Branding</Typography>

                  <Box mb={2}>
                    <Typography variant="caption" fontWeight="bold">Cover Image</Typography>
                    <ImageSelector data={details?.image} dispatch={setDetails} />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="bold" mb={1} display="block">Builder Logo</Typography>
                    <Box sx={styles.uploadBox} onClick={handleFileSelect}>
                      {details?.logo ? (
                        <img
                          style={{ maxWidth: "100%", maxHeight: 150, objectFit: "contain" }}
                          src={
                            typeof details?.logo == "object"
                              ? URL.createObjectURL(details?.logo)
                              : `${process.env.REACT_APP_API_URL}/uploads/${details?.logo}`
                          }
                          alt="Logo Preview"
                        />
                      ) : (
                        <>
                          <Box component="i" className="ni ni-cloud-upload-96" fontSize="24px" color="#aaa" mb={1} />
                          <Typography variant="caption" color="text">Click to upload Logo</Typography>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handlelogoFileChange}
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Typography sx={styles.sectionTitle}>Content</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Input
                        id="description"
                        placeholder="About the Builder"
                        name="description"
                        value={details?.description || ""}
                        onChange={handleChange}
                        multiline
                        rows={6}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Input
                        id="vision"
                        placeholder="Our Vision"
                        name="vision"
                        value={details?.vision || ""}
                        onChange={handleChange}
                        multiline
                        rows={6}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Features */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={styles.sectionTitle}>Features</Typography>
                    <Button onClick={handleAddFeatures} variant="outlined" size="small" color="primary">
                      + Add Feature
                    </Button>
                  </Box>
                  {details?.features?.map((features, index) => (
                    <Box key={index} display="flex" gap={2} alignItems="center" mb={2} sx={{ background: "rgba(255,255,255,0.5)", p: 2, borderRadius: 2 }}>
                      <TextField
                        placeholder="Feature Title"
                        value={features.text}
                        onChange={(e) => handleFeaturesChange(index, "text", e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        placeholder="Description"
                        value={features.helpertext}
                        onChange={(e) => handleFeaturesChange(index, "helpertext", e.target.value)}
                        fullWidth
                        size="small"
                      />
                      <IconButton onClick={() => handleFeaturesRemove(index)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Grid>

                {/* Reviews */}
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={styles.sectionTitle}>Reviews & Testimonials</Typography>
                    <Button onClick={handleAddReview} variant="outlined" size="small" color="primary">
                      + Add Review
                    </Button>
                  </Box>

                  {details?.testimonials?.map((review, index) => (
                    <Box key={index} sx={{ background: "rgba(255,255,255,0.5)", p: 2, borderRadius: 2, mb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                          <Button component="label" sx={{ width: "100%", height: 100, border: "1px dashed #ccc", display: "flex", flexDirection: "column" }}>
                            {review.image ? (
                              <img
                                src={typeof review.image === "object" ? URL.createObjectURL(review.image) : `${process.env.REACT_APP_API_URL}/uploads/${review.image}`}
                                alt="Review"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <>Upload Img <input type="file" hidden onChange={(e) => handleFileChange("testimonials", index, e)} /></>
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={9}>
                          <Box display="flex" gap={2} mb={2}>
                            <Input
                              placeholder="Reviewer Name"
                              value={review.name}
                              onChange={(e) => handleReviewChange(index, "name", e.target.value)}
                              fullWidth
                            />
                            <Box display="flex" alignItems="center" minWidth={150}>
                              <Rating
                                value={review.rating}
                                onChange={(e, val) => handleReviewChange(index, "rating", val)}
                              />
                            </Box>
                          </Box>
                          <Input
                            placeholder="Review Content"
                            value={review.review}
                            onChange={(e) => handleReviewChange(index, "review", e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                          />
                          <Box display="flex" justifyContent="flex-end" mt={1}>
                            <IconButton onClick={() => handleRemoveReview(index)} color="error" size="small">
                              <Delete fontSize="small" /> Remove Review
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Grid>

                {/* Status & Actions */}
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Typography fontWeight="bold">Status:</Typography>
                    <ToggleButton
                      value={details?.isAvailable}
                      selected={details?.isAvailable}
                      onChange={() => {
                        setDetails((prev) => ({ ...prev, isAvailable: !details?.isAvailable }));
                      }}
                      color="primary"
                      size="small"
                    >
                      {details?.isAvailable ? "Active" : "Blocked"}
                    </ToggleButton>
                  </Box>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    variant="contained"
                    color="info"
                    fullWidth
                    sx={{ py: 1.5, fontSize: "16px" }}
                  >
                    {loading ? "Updating..." : "Update Builder"}
                  </Button>
                </Grid>

              </Grid>
            </Box>
          </motion.div>
        )}
      </Box>
    </PageLayout>
  );
};

export default EditBuilders;
