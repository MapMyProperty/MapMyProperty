import {
  Button,
  Grid,
  TextField,
  ToggleButton,
  Rating,
  IconButton,
  Box,
  Autocomplete,
  MenuItem,
  Select,
} from "@mui/material";
import Input from "components/Input";
import PageLayout from "layouts/PageLayout";
import React, { useEffect, useState } from "react";
import Typography from "components/Typography";
import toast from "react-hot-toast";
import { useGetProjectsById, useUpdateProjects, useGetSelectBuilders } from "queries/ProductQuery";
import { useNavigate, useParams } from "react-router-dom";
import { Delete, Add } from "@mui/icons-material";
import { Icons } from "components/Property/Icons.jsx";
import IconPickerPopup from "./IconPickerPopup";
import FieldSection from "./FieldSection";
import { useGetCategory } from "queries/ProductQuery";
import TextEditor from "utils/TextEditor";
import avatarFemale from "assets/images/avatar-female.png";
import avatarMale from "assets/images/avatar-male.png";
import EditorJSON from "./EditorJSON";

const EditProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const { data, isLoading } = useGetProjectsById({ id });
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedIconField, setSelectedIconField] = useState(null);
  const [builder, setBuilders] = useState({});
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (data?.data) {
      data?.data?.builder && setBuilders(data?.data?.builder);
      data?.data?.category && setCategory(data?.data?.category);
      setDetails(data.data);
    }
  }, [data]);

  const { mutateAsync: updateProjects, isLoading: loading } = useUpdateProjects();
  const { data: build } = useGetSelectBuilders({ pageNo: 1, pageCount: 100 });
  const { data: categories } = useGetCategory({ pageNo: 1, pageCount: 100 });
  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    let flag = true;
    try {
      if (!details?.title) {
        return toast.error("title is required");
      }
      if (!details?.subtitle) {
        return toast.error("subtitle is required");
      }
      if (!builder?._id) {
        return toast.error("builder is required");
      }
      if (!category?._id) {
        return toast.error("category is required");
      }
      if (!details?.href) {
        return toast.error("url is required");
      }
      if (!details?.location) {
        return toast.error("location is required");
      }
      if (!details?.imageGallery[0]?.title) {
        return toast.error("imageGallery is required");
      }
      if (!details?.minPrice) {
        return toast.error("minPrice is required");
      }
      if (!details?.maxPrice) {
        return toast.error("maxPrice is required");
      }
      if (!details?.description) {
        return toast.error("description is required");
      }
      const formData = new FormData();
      for (const key in details) {
        if (
          details.hasOwnProperty(key) &&
          ![
            "expertOpinions",
            "bedrooms",
            "areas",
            "features",
            "faqs",
            "testimonials",
            "imageGallery",
            "plans",
            "accommodation",
            "masterPlan",
            "builder",
          ].includes(key)
        ) {
          formData.append(key, details[key]);
        }
      }
      formData.append("builder", builder?._id);
      formData.append("category_id", category?._id);

      details.features.forEach((feature) => {
        feature.items.forEach((item) => {
          formData.append(`features[${feature.title}][]`, JSON.stringify(item));
        });
      });
      ["expertOpinions", "bedrooms", "areas"].forEach((field) => {
        details[field].forEach((value) => {
          if (value) {
            formData.append(field, value);
          }
        });
      });

      details?.faqs?.forEach((si) => {
        if (si.questions === "") {
        } else {
          formData.append("questions", si.questions);
          formData.append("answer", si.answer);
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
            setDisable(false);
          }
        }
      });
      if (details?.masterPlan) {
        if (details.masterPlan.title === "") {
        } else {
          if (details.masterPlan.src) {
            formData.append(`masterPlan`, details.masterPlan.src);
            formData.append(`masterPlanTitle`, details.masterPlan.title);
            formData.append(`masterPlanDesc`, details.masterPlan.desc);
          } else {
            return toast.error(" masterPlan image is required");
            setDisable(false);
          }
        }
      }
      details?.imageGallery?.forEach((Gallery, i) => {
        if (Gallery.title === "") {
        } else {
          if (Gallery.src) {
            formData.append(`imageGallery`, Gallery.src);
            formData.append(`imageGalleryTitle`, Gallery.title);
            formData.append(`imageGalleryDesc`, Gallery.desc);
            formData.append(
              `imageGalleryPocision`,
              typeof Gallery.src === "object" ? "" : Gallery.src
            );
          } else {
            toast.error(`image Gallery ${i + 1} field image is required`);
            flag = false;
            setDisable(false);
          }
        }
      });
      details?.plans?.forEach((Plans, i) => {
        if (Plans.title === "") {
        } else {
          if (Plans.src) {
            console.log("df", typeof Plans.src === "object");

            formData.append(`floorPlans`, Plans.src);
            formData.append(`floorPlansTitle`, Plans.title);
            formData.append(`floorPlansDesc`, Plans.desc);
            formData.append(
              `floorPlansimagePocision`,
              typeof Plans.src === "object" ? "" : Plans.src
            );
          } else {
            toast.error(`floor Plans ${i + 1} field image is required`);
            flag = false;
            setDisable(false);
          }
        }
      });
      details?.accommodation?.forEach((unit) => {
        if (unit.unit === "") {
        } else {
          formData.append(`accommodationUnit`, unit.unit);
          formData.append(`accommodationArea`, unit.area);
          formData.append(`accommodationPrice`, unit.price);
        }
      });

      if (flag) {
        updateProjects(formData)
          .then((res) => {
            if (res) {
              toast.success(res?.message ?? "Projects updated successfully");
              navigate("/projects");
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
  const handleFieldChange = (field, index, value) => {
    const updated = [...details[field]];
    updated[index] = value;
    setDetails((prevData) => ({ ...prevData, [field]: updated }));
  };

  const handleAddFields = (field) => {
    setDetails((prevData) => ({ ...prevData, [field]: [...prevData[field], ""] }));
  };

  const handleRemoveFields = (field, index) => {
    const updated = details[field].filter((_, i) => i !== index);
    setDetails((prevData) => ({ ...prevData, [field]: updated }));
  };

  const handleFeaturesChange = (index, key, value) => {
    const updatedFeatures = [...details.features];
    updatedFeatures[index][key] = value;
    setDetails({ ...details, features: updatedFeatures });
  };

  const handleFeatureItemsChange = (featureIndex, itemIndex, key, value) => {
    const updatedItems = [...details.features[featureIndex].items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], [key]: value };
    const updatedFeatures = [...details.features];
    updatedFeatures[featureIndex].items = updatedItems;
    setDetails({ ...details, features: updatedFeatures });
  };

  const handleAddFeature = () =>
    setDetails((prev) => ({
      ...prev,
      features: [...prev.features, { title: "", items: [{ text: "", helpertext: "", icon: "" }] }],
    }));

  const handleRemoveFeature = (index) => {
    const updatedFeatures = details.features.filter((_, i) => i !== index);
    setDetails({ ...details, features: updatedFeatures });
  };

  const handleAddFeatureItem = (featureIndex) => {
    const updatedItems = [
      ...details.features[featureIndex].items,
      { text: "", helpertext: "", icon: "" },
    ];
    const updatedFeatures = [...details.features];
    updatedFeatures[featureIndex].items = updatedItems;
    setDetails({ ...details, features: updatedFeatures });
  };

  const handleRemoveFeatureItem = (featureIndex, itemIndex) => {
    const updatedItems = details.features[featureIndex].items.filter((_, i) => i !== itemIndex);
    const updatedFeatures = [...details.features];
    updatedFeatures[featureIndex].items = updatedItems;
    setDetails({ ...details, features: updatedFeatures });
  };

  const handleAddFAQs = () => {
    setDetails((prevData) => ({
      ...prevData,
      faqs: [...prevData.faqs, { questions: "", answer: "" }],
    }));
  };
  const handleFAQsChange = (index, field, value) => {
    const newFAQs = [...details.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setDetails((prevData) => ({ ...prevData, faqs: newFAQs }));
  };

  const handleRemoveFAQs = (index) => {
    const newFAQs = details.faqs.filter((_, i) => i !== index);
    setDetails((prevData) => ({ ...prevData, faqs: newFAQs }));
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

  const handleIconPickerOpen = (featureIndex, itemIndex) => {
    setSelectedIconField({ featureIndex, itemIndex });
    setIconPickerOpen(true);
  };

  const handleIconPickerClose = () => {
    setIconPickerOpen(false);
  };

  const handleIconSelect = (iconName) => {
    const { featureIndex, itemIndex } = selectedIconField;
    const updatedFeatures = [...details.features];
    const updatedItems = [...updatedFeatures[featureIndex].items];
    updatedItems[itemIndex] = { ...updatedItems[itemIndex], icon: iconName };
    updatedFeatures[featureIndex].items = updatedItems;
    setDetails((prev) => ({ ...prev, features: updatedFeatures }));
    setIconPickerOpen(false);
  };

  const handleNestedChange = (field, index, subField, value) => {
    setDetails((prev) => {
      const currentArray = prev[field] || [];
      const updated = [...currentArray];
      if (!updated[index]) {
        updated[index] =
          field === "accommodation"
            ? { unit: "", area: "", price: "" }
            : { title: "", desc: "", src: "" };
      }
      updated[index][subField] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleFileChange = async (field, index, e) => {
    let file = e?.target?.files?.[0];
    if (!file) {
      const response = await fetch(e);
      const blob = await response.blob();
      file = new File([blob], "avatar.png", { type: blob.type });
    }
    if (file) {
      if (field === "testimonials") {
        handleNestedChange(field, index, "image", file);
      } else {
        handleNestedChange(field, index, "src", file);
      }
      if (field === "plans" || field === "imageGallery") {
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        const formattedTitle = fileName
          .split(/[-_\s]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        handleNestedChange(field, index, "title", formattedTitle);
      }
    }
  };

  const handleMasterFileChange = (event) => {
    const file = event.target.files[0];
    setDetails((prev) => ({ ...prev, masterPlan: { ...prev.masterPlan, src: file } }));
  };

  const handleAddField = (field) => {
    const newItem =
      field === "accommodation"
        ? { unit: "", area: "", price: "" }
        : { title: "", desc: "", src: "" };
    setDetails((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const handleRemoveField = (field, index) => {
    const updated = details[field].filter((_, i) => i !== index);
    setDetails((prev) => ({ ...prev, [field]: updated }));
  };

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(details, null, 2);
    navigator.clipboard
      .writeText(jsonString)
      .then(() => toast.success("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <PageLayout title={"Edit Projects"}>
      {isLoading ? (
        <Typography fontSize={14} sx={{ paddingX: 5 }}>
          loading...
        </Typography>
      ) : (
        <Grid container spacing={5} display={"flex"} direction={"row"} px={8} pb={8}>
          <Grid item container spacing={2} xs={12}>
            <Grid item xs={10} display={"flex"} alignItems={"center"} gap={1}>
              <Typography variant="h6">Basic Details</Typography>
              <Typography variant="caption" color="error">
                *required
              </Typography>
            </Grid>
            <EditorJSON details={details} setDetails={setDetails} />
            <Grid item xs={12}>
              <Typography variant="caption">
                Project Title <span style={{ color: "red" }}>*</span>
              </Typography>
              <Input
                required
                placeholder="Project Title"
                id="title"
                name="title"
                value={details?.title || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                Project Subtitle <span style={{ color: "red" }}>*</span>
              </Typography>
              <Input
                required
                placeholder="Project sub title"
                id="subtitle"
                name="subtitle"
                value={details?.subtitle || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">
                Project Category <span style={{ color: "red" }}>*</span>
              </Typography>
              <Autocomplete
                id="Category-select"
                options={categories?.data}
                value={category}
                onChange={(event, newValue) => {
                  setCategory(newValue);
                }}
                autoHighlight
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image}`}
                    />
                    <Typography color="inherit" variant="caption">
                      {option?.name} <br />
                      {option?.desc}
                    </Typography>
                    <Typography
                      sx={{ ml: "auto" }}
                      color={option?.isAvailable ? "success" : "error"}
                      variant="caption"
                    >
                      {option?.isAvailable ? "available" : "NA"}
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose a category"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">
                Builder <span style={{ color: "red" }}>*</span>
              </Typography>
              <Autocomplete
                id="Builders-select"
                options={build?.data}
                value={builder}
                onChange={(event, newValue) => {
                  setBuilders(newValue);
                }}
                autoHighlight
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ "& > img": { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                      loading="lazy"
                      width="20"
                      src={`${process.env.REACT_APP_API_URL}/uploads/${option?.image}`}
                    />
                    <Typography color="inherit" variant="caption">
                      {option?.title} <br />
                      {option?.subtitle}
                    </Typography>
                    <Typography
                      sx={{ ml: "auto" }}
                      color={option?.isAvailable ? "success" : "error"}
                      variant="caption"
                    >
                      {option?.isAvailable ? "available" : "NA"}
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Choose a builder"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">
                Project Status <span style={{ color: "red" }}>*</span>
              </Typography>
              <Autocomplete
                value={details?.status || ""}
                onChange={(event, newValue) => {
                  setDetails((prev) => ({ ...prev, status: newValue }));
                }}
                options={["Pre Launch", "Launch", "Under Construction", "Ready to Move In"]}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Status" required />
                )}
                sx={{
                  "& .MuiAutocomplete-input": {
                    padding: "10px 14px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} mb={2}>
              <Typography variant="caption">
                Project Overview <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextEditor value={details?.description || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption">
                Min property value <span style={{ color: "red" }}>*</span>
              </Typography>
              <Input
                required
                type="number"
                placeholder="Min Price"
                id="minPrice"
                name="minPrice"
                value={details.minPrice}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="caption">
                Max property value <span style={{ color: "red" }}>*</span>
              </Typography>
              <Input
                required
                type="number"
                placeholder="Max Price"
                id="maxPrice"
                name="maxPrice"
                value={details.maxPrice}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                Property URL <span style={{ color: "red" }}>*</span> (avoid blank spaces, numbers or
                special characters for better performance. use &apos;-&apos; to connect words.)
              </Typography>
              <Input
                required
                placeholder="Slug URL (href)"
                id="href"
                name="href"
                value={details.href}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption">
                Property Location <span style={{ color: "red" }}>*</span>
              </Typography>
              <Input
                required
                placeholder="Project Location"
                id="location"
                name="location"
                value={details?.location || ""}
                onChange={handleChange}
              />
            </Grid>
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
            <Grid item xs={12}>
              <Typography variant="h6">Property Features</Typography>
              {details?.features?.map((feature, index) => (
                <Box key={index} mt={2} p={2} border={1}>
                  <Typography variant="h6">Feature {index + 1}</Typography>
                  <Input
                    fullWidth
                    placeholder="Feature Title"
                    value={feature.title}
                    onChange={(e) => handleFeaturesChange(index, "title", e.target.value)}
                  />
                  {feature?.items?.map((item, itemIndex) => (
                    <Box key={itemIndex} display="flex" alignItems="center" mt={1}>
                      {/* <IconButton onClick={() => setIconPickerOpen(true) && setSelectedIconField({ featureIndex: index, itemIndex })}> */}
                      <IconButton onClick={() => handleIconPickerOpen(index, itemIndex)}>
                        {Icons[item.icon] ? (
                          Icons[item.icon]({ width: "24px", height: "24px" })
                        ) : (
                          <Add />
                        )}
                      </IconButton>
                      <Input
                        placeholder="Text"
                        style={{ marginRight: "5px" }}
                        value={item.text}
                        onChange={(e) =>
                          handleFeatureItemsChange(index, itemIndex, "text", e.target.value)
                        }
                        fullWidth
                      />
                      <Input
                        placeholder="Helpertext"
                        value={item.helpertext}
                        onChange={(e) =>
                          handleFeatureItemsChange(index, itemIndex, "helpertext", e.target.value)
                        }
                        fullWidth
                      />
                      <IconButton onClick={() => handleRemoveFeatureItem(index, itemIndex)}>
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                  <Button onClick={() => handleAddFeatureItem(index)}>Add Item</Button>
                  <Button onClick={() => handleRemoveFeature(index)}>Remove Feature</Button>
                </Box>
              ))}
              <Box style={{ marginTop: "10px" }}>
                <Button
                  onClick={handleAddFeature}
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="mt-4"
                >
                  Add Feature
                </Button>
              </Box>
            </Grid>

            <FieldSection
              label="Expert Opinions"
              values={details.expertOpinions}
              onChange={(index, value) => handleFieldChange("expertOpinions", index, value)}
              onAdd={() => handleAddFields("expertOpinions")}
              onRemove={(index) => handleRemoveFields("expertOpinions", index)}
            />
            <FieldSection
              label="Bedrooms (BHK)"
              values={details.bedrooms}
              onChange={(index, value) => handleFieldChange("bedrooms", index, value)}
              onAdd={() => handleAddFields("bedrooms")}
              onRemove={(index) => handleRemoveFields("bedrooms", index)}
            />

            <FieldSection
              label="Area (sq/ft)"
              values={details.areas}
              onChange={(index, value) => handleFieldChange("areas", index, value)}
              onAdd={() => handleAddFields("areas")}
              onRemove={(index) => handleRemoveFields("areas", index)}
            />

            <Grid item xs={12}>
              <Typography variant="h6">Master Plan</Typography>
              <Box display="flex" alignItems="center" marginBottom={1}>
                <Input
                  placeholder=" Master Plan Title"
                  value={details?.masterPlan?.title}
                  style={{ marginRight: "5px" }}
                  fullWidth
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      masterPlan: { ...prev.masterPlan, title: e.target.value },
                    }))
                  }
                />
                <Input
                  placeholder="Description"
                  value={details?.masterPlan?.desc}
                  fullWidth
                  onChange={(e) =>
                    setDetails((prev) => ({
                      ...prev,
                      masterPlan: { ...prev.masterPlan, desc: e.target.value },
                    }))
                  }
                />
              </Box>
              <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                <Button
                  variant="outlined"
                  component="label"
                  style={{ color: "gray", marginTop: "5px" }}
                >
                  Upload Image
                  <input type="file" hidden onChange={(e) => handleMasterFileChange(e)} />
                </Button>
                {details?.masterPlan?.src && (
                  <Box mt={1}>
                    <img
                      src={
                        typeof details?.masterPlan?.src === "object"
                          ? URL.createObjectURL(details?.masterPlan?.src)
                          : `${process.env.REACT_APP_API_URL}/uploads/${details?.masterPlan?.src}`
                      }
                      alt={`masterPlan`}
                      style={{ width: "100%", height: "100px", objectFit: "cover" }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            {["imageGallery", "plans", "accommodation"].map((field) => (
              <Grid item xs={12} key={field}>
                <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
                  {field.replace(/([A-Z])/g, " $1").trim()}
                  {field === "imageGallery" && (
                    <Typography variant="caption" color="error">
                      {" "}
                      *required
                    </Typography>
                  )}
                </Typography>
                {details[field]?.map((item, index) => (
                  <Box key={index} marginBottom={1}>
                    <Box display="flex" alignItems="center">
                      {field !== "accommodation" && (
                        <Input
                          placeholder="Title"
                          value={item?.title}
                          required
                          onChange={(e) =>
                            handleNestedChange(field, index, "title", e.target.value)
                          }
                          style={{ marginRight: "5px" }}
                          fullWidth
                        />
                      )}
                      {field !== "accommodation" && (
                        <Input
                          placeholder="Description"
                          value={item?.desc}
                          style={{ marginRight: "5px" }}
                          onChange={(e) => handleNestedChange(field, index, "desc", e.target.value)}
                          fullWidth
                        />
                      )}

                      {field === "accommodation" && (
                        <Input
                          placeholder="Unit"
                          value={item?.unit}
                          style={{ marginRight: "5px" }}
                          onChange={(e) => handleNestedChange(field, index, "unit", e.target.value)}
                          fullWidth
                        />
                      )}
                      {field === "accommodation" && (
                        <Input
                          placeholder="Area"
                          value={item?.area}
                          style={{ marginRight: "5px" }}
                          onChange={(e) => handleNestedChange(field, index, "area", e.target.value)}
                          fullWidth
                        />
                      )}
                      {field === "accommodation" && (
                        <Input
                          placeholder="Price"
                          value={item?.price}
                          onChange={(e) =>
                            handleNestedChange(field, index, "price", e.target.value)
                          }
                          fullWidth
                        />
                      )}
                    </Box>
                    {field !== "accommodation" && (
                      <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                        <Button
                          variant="outlined"
                          component="label"
                          style={{ color: "gray", marginTop: "5px" }}
                        >
                          Upload Image
                          <input
                            type="file"
                            hidden
                            onChange={(e) => handleFileChange(field, index, e)}
                          />
                        </Button>
                        {item?.src && (
                          <Box mt={1}>
                            <img
                              src={
                                typeof item.src === "object"
                                  ? URL.createObjectURL(item?.src)
                                  : `${process.env.REACT_APP_API_URL}/uploads/${item.src}`
                              }
                              alt={`${item} ${index + 1}`}
                              style={{ width: "100%", height: "100px", objectFit: "cover" }}
                            />
                          </Box>
                        )}
                      </Box>
                    )}
                    <IconButton onClick={() => handleRemoveField(field, index)}>
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  onClick={() => handleAddField(field)}
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="mt-4"
                >
                  Add {field}
                </Button>
              </Grid>
            ))}

            <Grid item xs={12}>
              <Typography variant="h6">FAQs</Typography>
              <Grid container direction="row">
                {details?.faqs?.map((FAQs, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      key={index}
                      display="flex"
                      style={{ marginBottom: "10px" }}
                      alignItems="center"
                    >
                      <Input
                        placeholder={`questions ${index + 1}`}
                        value={FAQs.questions}
                        onChange={(e) => handleFAQsChange(index, "questions", e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        style={{ marginRight: "5px" }}
                      />
                      <Input
                        placeholder="answer"
                        value={FAQs.answer}
                        onChange={(e) => handleFAQsChange(index, "answer", e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                      />
                      {details.faqs.length > 1 && (
                        <IconButton onClick={() => handleRemoveFAQs(index)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                ))}
                <Button
                  onClick={handleAddFAQs}
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="mt-4"
                >
                  Add FAQs
                </Button>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6">Reviews</Typography>
              {details?.testimonials?.map((review, index) => (
                <Box
                  key={index}
                  mt={2}
                  display="flex"
                  flexDirection="column"
                  style={{ marginBottom: "10px" }}
                >
                  <Input
                    placeholder="Reviewer Name"
                    value={review.name}
                    onChange={(e) => handleReviewChange(index, "name", e.target.value)}
                    fullWidth
                    style={{ marginBottom: "10px" }}
                  />
                  <Rating
                    value={review.rating}
                    onChange={(e, value) => handleReviewChange(index, "rating", value)}
                    style={{ marginBottom: "10px" }}
                  />
                  <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                    <Box display={"flex"} alignItems={"center"}>
                      <Box
                        sx={{
                          width: 90,
                          height: 80,
                          cursor: "pointer",
                          backgroundColor: "#D3D3D3",
                          "&:hover": {
                            backgroundColor: "#424242",
                            opacity: [0.9, 0.8, 0.7],
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                        onClick={(e) => handleFileChange("testimonials", index, avatarFemale)}
                      >
                        <img style={{ width: 90, height: 80 }} src={avatarFemale} />
                      </Box>
                      <Box
                        sx={{
                          width: 90,
                          height: 80,
                          cursor: "pointer",
                          backgroundColor: "#D3D3D3",
                          "&:hover": {
                            backgroundColor: "#424242",
                            opacity: [0.9, 0.8, 0.7],
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          overflow: "hidden",
                          mx: 2,
                        }}
                        onClick={(e) => handleFileChange("testimonials", index, avatarMale)}
                      >
                        <img style={{ width: 90, height: 80 }} src={avatarMale} />
                      </Box>
                      <Box
                        variant="outlined"
                        component="label"
                        sx={{
                          width: 90,
                          height: 80,
                          cursor: "pointer",
                          backgroundColor: "#D3D3D3",
                          "&:hover": {
                            backgroundColor: "#D3D3D3",
                            opacity: [0.9, 0.8, 0.7],
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <Typography variant="caption">Upload Image</Typography>
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange("testimonials", index, e)}
                        />
                      </Box>
                    </Box>
                    {review.image && (
                      <Box
                        sx={{
                          width: 110,
                          height: 80,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={
                            typeof review.image === "object"
                              ? URL.createObjectURL(review.image)
                              : `${process.env.REACT_APP_API_URL}/uploads/${review.image}`
                          }
                          alt={`Review ${index + 1}`}
                          style={{ width: "100%", height: 80 }}
                        />
                      </Box>
                    )}
                  </Box>
                  <Input
                    placeholder="Review"
                    value={review.review}
                    onChange={(e) => handleReviewChange(index, "review", e.target.value)}
                    fullWidth
                    style={{ marginTop: "10px" }}
                    multiline
                    rows={3}
                  />
                  {details?.testimonials?.length > 1 && (
                    <IconButton onClick={() => handleRemoveReview(index)}>
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                onClick={handleAddReview}
                variant="contained"
                color="primary"
                className="mt-4"
                fullWidth
              >
                Add Review
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Projects status &nbsp;</Typography>
              <ToggleButton
                value={details?.isAvailable}
                selected={details?.isAvailable}
                onChange={() => {
                  setDetails((prev) => ({ ...prev, isAvailable: !details?.isAvailable }));
                }}
              >
                {details?.isAvailable ? "Active" : "Blocked"}
              </ToggleButton>
            </Grid>
            <Grid item xs={12} sm={12} mt={"auto"}>
              <Grid item xs={12} display={"flex"} flexDirection={"column"} gap={1}>
                <Button onClick={handleSubmit} variant="contained">
                  UPDATE PROPERTY
                </Button>
                <Typography variant="caption" color="error">
                  Caution: This action is irreversible, Previous data will be overwritten
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <IconPickerPopup
        open={iconPickerOpen}
        onClose={handleIconPickerClose}
        onSelectIcon={handleIconSelect}
      />
    </PageLayout>
  );
};

export default EditProjects;
