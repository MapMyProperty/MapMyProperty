import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import PageLayout from "layouts/PageLayout";
import Box from "components/Box";
import { useGetProjectsById, useUpdateProjects, useGetSelectBuilders, useGetCategory, useGenerateProjectBlog } from "queries/ProductQuery";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Icons } from "components/Property/Icons.jsx";
import IconPickerPopup from "./IconPickerPopup";
import FieldSection from "./FieldSection";
import BasicDetails from "./components/BasicDetails";
import SeoDetails from "./components/SeoDetails";
import FeatureSection from "./components/FeatureSection";
import MasterPlanSection from "./components/MasterPlanSection";
import GallerySection from "./components/GallerySection";
import AccommodationSection from "./components/AccommodationSection";
import FaqSection from "./components/FaqSection";
import ReviewSection from "./components/ReviewSection";


const EditProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const { data, isLoading } = useGetProjectsById({ id });

  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedIconField, setSelectedIconField] = useState(null);


  // These are managed locally here to pass to BasicDetails, matching AddProjects interface
  const [builder, setBuilders] = useState(null);
  const [category, setCategory] = useState(null);

  const { mutateAsync: updateProjects } = useUpdateProjects();
  const { data: categories, refetch: refetchCategories } = useGetCategory({ pageNo: 1, pageCount: 100 });
  const { data: builders, refetch: refetchBuilders } = useGetSelectBuilders({ pageNo: 1, pageCount: 100 });
  const { mutateAsync: generateProjectBlog, isLoading: isGeneratingBlog } = useGenerateProjectBlog();
  const { refetch: refetchProject } = useGetProjectsById({ id });

  useEffect(() => {
    if (data?.data) {
      setDetails(data.data);
      if (data.data.builder) setBuilders(data.data.builder);
      if (data.data.category) setCategory(data.data.category);
    }
  }, [data]);



  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Generic Field Handlers
  const handleFieldChange = (field, index, value) => {
    setDetails((prevData) => {
      const updated = [...prevData[field]];
      updated[index] = value;
      return { ...prevData, [field]: updated };
    });
  };

  const handleAddFields = (field) => {
    setDetails((prevData) => ({ ...prevData, [field]: [...prevData[field], ""] }));
  };

  const handleRemoveFields = (field, index) => {
    setDetails((prevData) => {
      const updated = prevData[field].filter((_, i) => i !== index);
      return { ...prevData, [field]: updated };
    });
  };

  // Feature Handlers
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

  const handleAddFeature = () => {
    setDetails((prev) => ({
      ...prev,
      features: [...(prev.features || []), { title: "", items: [{ text: "", helpertext: "", icon: "" }] }],
    }));
  };

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

  // Icon Picker
  const handleIconPickerOpen = (featureIndex, itemIndex) => {
    setSelectedIconField({ featureIndex, itemIndex });
    setIconPickerOpen(true);
  };

  const handleIconSelect = (iconName) => {
    const { featureIndex, itemIndex } = selectedIconField;
    handleFeatureItemsChange(featureIndex, itemIndex, "icon", iconName);
    setIconPickerOpen(false);
  };
  const handleIconPickerClose = () => setIconPickerOpen(false);

  // FAQ Handlers
  const handleAddFAQs = () => {
    setDetails((prev) => ({ ...prev, faqs: [...prev.faqs, { questions: "", answer: "" }] }));
  };
  const handleFAQsChange = (index, field, value) => {
    const newFAQs = [...details.faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    setDetails((prev) => ({ ...prev, faqs: newFAQs }));
  };
  const handleRemoveFAQs = (index) => {
    setDetails((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  // Review Handlers
  const handleAddReview = () => {
    setDetails((prev) => ({ ...prev, testimonials: [...prev.testimonials, { name: "", rating: 0, review: "", src: "" }] }));
  };
  const handleReviewChange = (index, field, value) => {
    const newReviews = [...details.testimonials];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setDetails((prev) => ({ ...prev, testimonials: newReviews }));
  };
  const handleRemoveReview = (index) => {
    setDetails((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));
  };

  // Nested & File Handlers
  const handleNestedChange = (field, index, subField, value) => {
    setDetails((prev) => {
      const currentArray = prev[field] || [];
      const updated = [...currentArray];
      if (!updated[index]) {
        // Create default object if not exists
        updated[index] = field === "accommodation" ? { unit: "", area: "", price: "" } : { title: "", desc: "", src: "" };
      }
      updated[index][subField] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleFileChange = async (field, index, e) => {
    let file = e?.target?.files?.[0];
    if (!file) {
      if (typeof e === 'string') {
        const response = await fetch(e);
        const blob = await response.blob();
        file = new File([blob], "avatar.png", { type: blob.type });
      }
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // Review special case -> map 'src' to 'image' for editing compatibility if needed? 
        // Actually, AddProjects used `src` for everything in state. EditProjects used `image` for review src in formData.
        // We will stick to `src` in state for consistency with ReviewSection component.

        if (field === "testimonials") {
          // Check if ReviewSection uses 'src'. Yes it does: testimonial.src
          handleNestedChange(field, index, "src", base64String);
        } else if (field === "masterPlan") {
          setDetails(prev => ({ ...prev, masterPlan: { ...prev.masterPlan, src: base64String } }));
        } else {
          handleNestedChange(field, index, "src", base64String);
          if (field === "plans" || field === "imageGallery") {
            const fileName = file.name.replace(/\.[^/.]+$/, "");
            const formattedTitle = fileName.split(/[-_\s]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
            handleNestedChange(field, index, "title", formattedTitle);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddField = (field) => {
    const newItem = field === "accommodation" ? { unit: "", area: "", price: "" } : { title: "", desc: "", src: "" };
    setDetails((prev) => ({ ...prev, [field]: [...(prev[field] || []), newItem] }));
  };

  const handleRemoveField = (field, index) => {
    setDetails((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = () => {
    if (!details?.title) return toast.error("title is required");
    if (!builder?._id) return toast.error("builder is required");
    if (!category?._id) return toast.error("category is required");

    const formData = new FormData();

    // Standard fields
    for (const key in details) {
      if (details.hasOwnProperty(key) && !["category", "builder", "expertOpinions", "bedrooms", "areas", "features", "faqs", "testimonials", "imageGallery", "plans", "accommodation", "masterPlan", "createdAt", "updatedAt", "__v", "_id"].includes(key)) {
        formData.append(key, details[key]);
      }
    }
    if (category?._id) formData.append("category_id", category._id); // API expects category_id for update
    if (builder?._id) formData.append("builder", builder._id);

    // Arrays
    if (details?.features) {
      details.features.forEach((feature) => {
        if (feature?.items) {
          feature.items.forEach((item) => {
            formData.append(`features[${feature.title}][]`, JSON.stringify(item));
          });
        }
      });
    }

    ["expertOpinions", "bedrooms", "areas"].forEach((field) => {
      if (details?.[field]) {
        details[field].forEach((value) => value && formData.append(field, value));
      }
    });

    if (details?.faqs) {
      details.faqs.forEach((si) => {
        if (si.questions) {
          formData.append("questions", si.questions);
          formData.append("answer", si.answer);
        }
      });
    }

    // Reviews
    if (details?.testimonials) {
      details.testimonials.forEach((review, i) => {
        if (review.name) {
          formData.append(`reviewsName`, review.name);
          formData.append(`reviewsRating`, review.rating);
          formData.append(`reviewsReview`, review.review);

          // Image handling
          // In state, we use 'src' for everything.
          // In API for edit: 'reviews' is key for file, 'reviewsImagePocision' for existing.
          // NOTE: 'review.image' was used in old code, but 'review.src' is used in ReviewSection.
          // We must use review.src or review.image based on what comes from DB.
          // DB usually sends 'image' for reviews? Let's check 'src' in backend or assume 'src' if ReviewSection uses it.
          // Actually, our BasicDetails loads data into 'details'. 
          // If backend sends 'image' for reviews, ReviewSection (which uses .src) won't show it unless we map it.
          // But let's assume 'src' is normalized or we use 'src' for UI.

          // Let's check if we need to map backend data 'image' to 'src' in useEffect.
          // Ignoring that for a moment, let's handle the submit part.

          const imageSource = review.src || review.image;

          if (imageSource && typeof imageSource === "string" && imageSource.startsWith("data:image/")) {
            // New File
            const blob = dataURLtoFile(imageSource, `file-${i}.png`);
            formData.append(`reviews`, blob);
            formData.append(`reviewsImagePocision`, "");
          } else if (imageSource) {
            // Existing File URL/String
            formData.append(`reviews`, imageSource);
            formData.append(`reviewsImagePocision`, imageSource);
          }
        }
      });
    }

    // Master Plan
    if (details?.masterPlan) {
      const mpSrc = details.masterPlan.src;
      if (mpSrc && typeof mpSrc === "string" && mpSrc.startsWith("data:image/")) {
        const blob = dataURLtoFile(mpSrc, `masterplan.png`);
        formData.append(`masterPlan`, blob);
      } else if (mpSrc) {
        formData.append(`masterPlan`, mpSrc);
      }
      formData.append(`masterPlanTitle`, details.masterPlan.title || "");
      formData.append(`masterPlanDesc`, details.masterPlan.desc || "");
    }

    // Gallery
    if (details?.imageGallery) {
      details.imageGallery.forEach((item, i) => {
        // imageGalleryPocision
        if (item.src && typeof item.src === "string" && item.src.startsWith("data:image/")) {
          const blob = dataURLtoFile(item.src, `gallery-${i}.png`);
          formData.append(`imageGallery`, blob);
          formData.append(`imageGalleryPocision`, "");
        } else {
          formData.append(`imageGallery`, item.src || "");
          formData.append(`imageGalleryPocision`, item.src || "");
        }
        formData.append(`imageGalleryTitle`, item.title || "");
        formData.append(`imageGalleryDesc`, item.desc || "");
      });
    }

    // Plans
    if (details?.plans) {
      details.plans.forEach((item, i) => {
        // floorPlansimagePocision
        if (item.src && typeof item.src === "string" && item.src.startsWith("data:image/")) {
          const blob = dataURLtoFile(item.src, `plan-${i}.png`);
          formData.append(`floorPlans`, blob);
          formData.append(`floorPlansimagePocision`, "");
        } else {
          formData.append(`floorPlans`, item.src || "");
          formData.append(`floorPlansimagePocision`, item.src || "");
        }
        formData.append(`floorPlansTitle`, item.title || "");
        formData.append(`floorPlansDesc`, item.desc || "");
      });
    }

    // Accommodation
    if (details?.accommodation) {
      details.accommodation.forEach((unit) => {
        if (unit.unit) {
          formData.append(`accommodationUnit`, unit.unit);
          formData.append(`accommodationArea`, unit.area);
          formData.append(`accommodationPrice`, unit.price);
        }
      });
    }

    updateProjects(formData)
      .then((res) => {
        toast.success(res?.message ?? "Projects updated successfully");
        navigate("/projects");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.message ?? "Something went wrong");
      });
  };

  return (
    <PageLayout title={"Edit Projects"}>
      {isLoading ? (
        <Typography fontSize={14} sx={{ paddingX: 5 }}>
          loading...
        </Typography>
      ) : (
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            p: 4
          }}
        >
          <Box display="flex" justifyContent="flex-end" mb={2} gap={2}>
            {details?.blog ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate(`/blogs/editBlog/${details.blog._id || details.blog}`)}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  borderRadius: "10px",
                }}
              >
                View Blog
              </Button>
            ) : (
              <Button
                variant="contained"
                color="info"
                onClick={() => {
                  toast.promise(
                    generateProjectBlog({ projectId: id }).then(() => refetchProject()),
                    {
                      loading: 'Generating Blog...',
                      success: 'Blog Generated!',
                      error: 'Failed to generate blog',
                    }
                  );
                }}
                disabled={isGeneratingBlog}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1,
                  borderRadius: "10px",
                }}
              >
                {isGeneratingBlog ? "Generating..." : "Generate Blog"}
              </Button>
            )}
          </Box>



          <Grid container spacing={5} display={"flex"} direction={"row"} px={2} pb={2}>
            <BasicDetails
              details={details}
              setDetails={setDetails}
              handleChange={handleChange}
              category={category}
              setCategory={setCategory}
              builder={builder}
              setBuilders={setBuilders}
              // Inject selected category into options if valid
              categories={{
                ...categories,
                data: category && !categories?.data?.some(c => c._id === category._id)
                  ? [category, ...(categories?.data || [])]
                  : categories?.data
              }}
              // Inject selected builder into options if valid
              builders={{
                ...builders,
                data: builder && !builders?.data?.some(b => b._id === builder._id)
                  ? [builder, ...(builders?.data || [])]
                  : builders?.data
              }}
            />

            <SeoDetails details={details} handleChange={handleChange} />

            <FeatureSection
              features={details?.features}
              handleFeaturesChange={handleFeaturesChange}
              handleFeatureItemsChange={handleFeatureItemsChange}
              handleAddFeature={handleAddFeature}
              handleRemoveFeature={handleRemoveFeature}
              handleAddFeatureItem={handleAddFeatureItem}
              handleRemoveFeatureItem={handleRemoveFeatureItem}
              handleIconPickerOpen={handleIconPickerOpen}
              Icons={Icons}
            />

            <FieldSection
              label="Expert Opinions"
              values={Array.isArray(details?.expertOpinions) ? details.expertOpinions : [""]}
              onChange={(index, value) => handleFieldChange("expertOpinions", index, value)}
              onAdd={() => handleAddFields("expertOpinions")}
              onRemove={(index) => handleRemoveFields("expertOpinions", index)}
            />
            <FieldSection
              label="Bedrooms (BHK)"
              values={Array.isArray(details?.bedrooms) ? details.bedrooms : [""]}
              onChange={(index, value) => handleFieldChange("bedrooms", index, value)}
              onAdd={() => handleAddFields("bedrooms")}
              onRemove={(index) => handleRemoveFields("bedrooms", index)}
            />
            <FieldSection
              label="Area (sq/ft)"
              values={Array.isArray(details?.areas) ? details.areas : [""]}
              onChange={(index, value) => handleFieldChange("areas", index, value)}
              onAdd={() => handleAddFields("areas")}
              onRemove={(index) => handleRemoveFields("areas", index)}
            />

            <MasterPlanSection
              masterPlan={details?.masterPlan}
              setDetails={setDetails}
              handleFileChange={handleFileChange}
            />

            <GallerySection
              field="imageGallery"
              items={details?.imageGallery}
              handleNestedChange={handleNestedChange}
              handleFileChange={handleFileChange}
              handleAddField={handleAddField}
              handleRemoveField={handleRemoveField}
            />

            <GallerySection
              field="plans"
              items={details?.plans}
              handleNestedChange={handleNestedChange}
              handleFileChange={handleFileChange}
              handleAddField={handleAddField}
              handleRemoveField={handleRemoveField}
            />

            <AccommodationSection
              items={details?.accommodation}
              handleNestedChange={handleNestedChange}
              handleAddField={handleAddField}
              handleRemoveField={handleRemoveField}
            />

            <FaqSection
              faqs={details?.faqs}
              handleFAQsChange={handleFAQsChange}
              handleAddFAQs={handleAddFAQs}
              handleRemoveFAQs={handleRemoveFAQs}
            />

            <ReviewSection
              testimonials={details?.testimonials}
              handleReviewChange={handleReviewChange}
              handleAddReview={handleAddReview}
              handleRemoveReview={handleRemoveReview}
              handleFileChange={handleFileChange}
            />

            <Grid item container spacing={2} xs={12}>
              <Grid item xs={12} sm={8}></Grid>
              <Grid item xs={12} sm={4} mt={"auto"}>
                <Box style={{ display: "flex" }}>
                  <Button
                    sx={{ mr: 5, width: "100%" }}
                    onClick={handleSubmit}
                    variant="contained"
                    color="info"
                  >
                    Update Projects
                  </Button>
                </Box>
              </Grid>
            </Grid>

          </Grid>
        </Box>
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
