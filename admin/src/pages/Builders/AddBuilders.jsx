import { Autocomplete, Button, Grid, TextField, IconButton, Rating, Alert } from "@mui/material";
import Box from "components/Box";
import Input from "components/Input";
import PageLayout from "layouts/PageLayout";
import React, { useEffect, useState } from "react";
import ImageList from "./ImageList";
import Typography from "components/Typography";
import { useAddBuilders } from "queries/ProductQuery";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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

const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const AddBuilders = () => {
  const navigat = useNavigate();
  const storageKey = "addBuilderData";
  const initialDetails = {
    features: [{ text: "", helpertext: "" }],
    reviews: [{ name: "", rating: 0, review: "", image: "" }],
  };

  const [details, setDetails] = useState(() => {
    const savedData = localStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData) : initialDetails;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(details));
  }, [details]);

  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setDetails(initialDetails);
  };

  const fileInputRef = React.useRef(null);
  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handlelogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setDetails((prev) => ({ ...prev, logo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutateAsync: AddBuilders, isLoading: loading } = useAddBuilders();
  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const [disable, setDisable] = useState(false);

  // Preserve original handleSubmit logic
  const handleSubmit = () => {
    let flag = true;
    try {
      if (!details?.title) return toast.error("title is required");
      if (!details?.subtitle) return toast.error("subtitle is required");
      if (!details?.image) return toast.error("image is required");
      if (!details?.logo) return toast.error("logo is required");
      if (!details?.description) return toast.error("description is required");
      if (!details?.vision) return toast.error("vision is required");
      if (!details?.location) return toast.error("location is required");
      if (!details?.url) return toast.error("url is required");

      setDisable(true);
      const formData = new FormData();

      if (
        details.image &&
        typeof details.image === "string" &&
        details.image.startsWith("data:image/")
      ) {
        const blob = dataURLtoFile(details.image, `file-images.png`);
        formData.append(`images`, blob);
      }

      if (
        details.logo &&
        typeof details.logo === "string" &&
        details.logo.startsWith("data:image/")
      ) {
        const blob = dataURLtoFile(details.logo, `file-logo.png`);
        formData.append(`logo`, blob);
      }
      for (const key in details) {
        if (
          details.hasOwnProperty(key) &&
          !["image", "FAQs", "reviews", "addresses", "features", "logo"].includes(key)
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
      details?.reviews?.forEach((review, i) => {
        if (review.name === "") {
        } else {
          if (review.image) {
            formData.append(`reviewsName`, review.name);
            formData.append(`reviewsRating`, review.rating);
            formData.append(`reviewsReview`, review.review);
            if (
              review.image &&
              typeof review.image === "string" &&
              review.image.startsWith("data:image/")
            ) {
              const blob = dataURLtoFile(review.image, `file-${i}.png`);
              formData.append(`reviews`, blob);
            }
          } else {
            toast.error(`reviews ${i + 1} field image is required`);
            flag = false;
            setDisable(false);
          }
        }
      });

      if (flag) {
        AddBuilders(formData)
          .then((res) => {
            toast.success(res?.message ?? "Builders added");
            setDisable(false);
            navigat("/builders");
          })
          .catch((err) => {
            toast.error(err?.message ?? "Something went wrong");
            setDisable(false);
          });
      }
    } catch (error) {
      setDisable(false);
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
      reviews: [...prevData.reviews, { name: "", rating: 0, review: "" }],
    }));
  };

  const handleReviewChange = (reviewIndex, field, value) => {
    const newReviews = [...details.reviews];
    newReviews[reviewIndex] = { ...newReviews[reviewIndex], [field]: value };
    setDetails((prevData) => ({ ...prevData, reviews: newReviews }));
  };

  const handleRemoveReview = (reviewIndex) => {
    const newReviews = details.reviews.filter((_, i) => i !== reviewIndex);
    setDetails((prevData) => ({ ...prevData, reviews: newReviews }));
  };

  const handleFileChange = (field, index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        const updated = [...details[field]];
        updated[index]["image"] = base64String;
        setDetails((prev) => ({ ...prev, [field]: updated }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageLayout title={"Add Builders"}>
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={styles.container}>
            <Typography sx={styles.title}>Add New Builder</Typography>

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
                  placeholder="Location (City, Country)"
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
                  <ImageList data={details?.image} dispatch={setDetails} />
                </Box>

                <Box>
                  <Typography variant="caption" fontWeight="bold" mb={1} display="block">Builder Logo</Typography>
                  <Box sx={styles.uploadBox} onClick={handleFileSelect}>
                    {details?.logo ? (
                      <img
                        style={{ maxWidth: "100%", maxHeight: 150, objectFit: "contain" }}
                        src={
                          details?.logo.startsWith("data:image/")
                            ? details?.logo
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

                {details.reviews.map((review, index) => (
                  <Box key={index} sx={{ background: "rgba(255,255,255,0.5)", p: 2, borderRadius: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Button component="label" sx={{ width: "100%", height: 100, border: "1px dashed #ccc", display: "flex", flexDirection: "column" }}>
                          {review.image ? (
                            <img
                              src={review.image.startsWith("data:image/") ? review.image : `${process.env.REACT_APP_API_URL}/uploads/${review.image}`}
                              alt="Review"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          ) : (
                            <>Upload Img <input type="file" hidden onChange={(e) => handleFileChange("reviews", index, e)} /></>
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

              {/* Actions */}
              <Grid item xs={12} mt={3}>
                <Box display="flex" gap={2}>
                  <Button
                    onClick={handleSubmit}
                    disabled={disable || loading}
                    variant="contained"
                    color="info"
                    fullWidth
                    sx={{ py: 1.5, fontSize: "16px" }}
                  >
                    {loading ? "Adding..." : "Add Builder"}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    disabled={disable || loading}
                    sx={{ py: 1.5, fontSize: "16px" }}
                  >
                    Clear Form
                  </Button>
                </Box>
              </Grid>

            </Grid>
          </Box>
        </motion.div>
      </Box>
    </PageLayout>
  );
};

export default AddBuilders;
