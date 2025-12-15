import React, { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import PageLayout from "layouts/PageLayout";
import Box from "components/Box";
import { useGetCategory, useAddProjects, useGetSelectBuilders } from "queries/ProductQuery";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
import AiGeneratorModal from "./components/AiGeneratorModal";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const AddProjects = () => {
  const navigate = useNavigate();
  const storageKey = "addProjectData";

  const initialDetails = {
    status: "Pre Launch",
    expertOpinions: [""],
    bedrooms: [""],
    areas: [""],
    faqs: [{ questions: "", answer: "" }],
    testimonials: [{ name: "", rating: 0, review: "", src: "" }],
    masterPlan: { title: "", desc: "", src: "" },
    imageGallery: [{ title: "", desc: "", src: "" }],
    plans: [{ title: "", desc: "", src: "" }],
    accommodation: [{ unit: "", area: "", price: "" }],
    features: [{ title: "", items: [{ text: "", helpertext: "", icon: "" }] }],
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  };

  const [details, setDetails] = useState(() => {
    const savedData = localStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData) : initialDetails;
  });

  const [builder, setBuilders] = useState(null);
  const [category, setCategory] = useState(null);
  const [disable, setDisable] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedIconField, setSelectedIconField] = useState({});
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const { data: categories, refetch: refetchCategories } = useGetCategory({ pageNo: 1, pageCount: 100 });
  const { mutateAsync: AddProjects, isLoading: loading } = useAddProjects();
  const { data: builders, refetch: refetchBuilders } = useGetSelectBuilders({ pageNo: 1, pageCount: 100 });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(details));
  }, [details]);

  const handleClear = () => {
    localStorage.removeItem(storageKey);
    setDetails(initialDetails);
  };

  const handleChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAiData = (data) => {
    // 1. Set Basic Details
    setDetails(prev => ({
      ...prev,
      ...data.data, // Merges all basic fields like title, desc, meta, etc.
      // Explicitly handle array overrides if needed or rely on spread merge
      features: data.data.features || prev.features,
      faqs: data.data.faqs || prev.faqs,
      accommodation: data.data.accommodation || prev.accommodation,
      testimonials: data.data.expertOpinions ?
        // NOTE: AI returns expertOpinions as strings, testimonials are objects. 
        // AI data mapping: expertOpinions maps to expertOpinions state.
        // testimonials maps to testimonials state.
        prev.testimonials : prev.testimonials,

      // Map images if present
      masterPlan: data.data.masterPlan || prev.masterPlan,
      imageGallery: data.data.imageGallery || prev.imageGallery,
      plans: data.data.plans || prev.plans,

    }));

    // 2. Set Category
    if (data.categoryData) {
      console.log("Setting Category:", data.categoryData);
      refetchCategories().then(() => {
        setCategory(data.categoryData);
      });
    }

    // 3. Set Builder
    if (data.builderData) {
      console.log("Setting Builder:", data.builderData);
      refetchBuilders().then(() => {
        setBuilders(data.builderData);
      });
    }
  };

  const handleFieldChange = (field, index, value) => {
    setDetails((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [""];
      const updated = [...currentArray];
      updated[index] = value;
      return { ...prevData, [field]: updated };
    });
  };

  const handleAddFields = (field) => {
    setDetails((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [""];
      return { ...prevData, [field]: [...currentArray, ""] };
    });
  };

  const handleRemoveFields = (field, index) => {
    setDetails((prevData) => {
      const currentArray = Array.isArray(prevData[field]) ? prevData[field] : [""];
      const updated = currentArray.filter((_, i) => i !== index);
      return { ...prevData, [field]: updated.length ? updated : [""] };
    });
  };

  // Feature Handlers
  const handleFeaturesChange = (index, key, value) => {
    setDetails((prev) => {
      const currentFeatures = prev.features || [{ title: "", items: [{ text: "", helpertext: "", icon: "" }] }];
      const updatedFeatures = [...currentFeatures];
      if (!updatedFeatures[index]) updatedFeatures[index] = { title: "", items: [{ text: "", helpertext: "", icon: "" }] };
      updatedFeatures[index] = { ...updatedFeatures[index], [key]: value };
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleFeatureItemsChange = (featureIndex, itemIndex, key, value) => {
    setDetails((prev) => {
      const currentFeatures = prev.features || [];
      const updatedFeatures = JSON.parse(JSON.stringify(currentFeatures)); // deep copy
      if (!updatedFeatures[featureIndex].items[itemIndex]) updatedFeatures[featureIndex].items[itemIndex] = { text: "", helpertext: "", icon: "" };
      updatedFeatures[featureIndex].items[itemIndex][key] = value;
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleAddFeature = () => {
    setDetails((prev) => ({
      ...prev,
      features: [...(prev.features || []), { title: "", items: [{ text: "", helpertext: "", icon: "" }] }],
    }));
  };

  const handleRemoveFeature = (index) => {
    setDetails((prev) => {
      const updatedFeatures = (prev.features || []).filter((_, i) => i !== index);
      return { ...prev, features: updatedFeatures.length ? updatedFeatures : initialDetails.features };
    });
  };

  const handleAddFeatureItem = (featureIndex) => {
    setDetails((prev) => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[featureIndex].items.push({ text: "", helpertext: "", icon: "" });
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleRemoveFeatureItem = (featureIndex, itemIndex) => {
    setDetails((prev) => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[featureIndex].items = updatedFeatures[featureIndex].items.filter((_, i) => i !== itemIndex);
      return { ...prev, features: updatedFeatures };
    });
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
    newFAQs[index][field] = value;
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
    newReviews[index][field] = value;
    setDetails((prev) => ({ ...prev, testimonials: newReviews }));
  };
  const handleRemoveReview = (index) => {
    setDetails((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));
  };

  // File & Nested Handlers
  const handleNestedChange = (field, index, subField, value) => {
    if (field === "masterPlan") {
      setDetails((prev) => ({ ...prev, masterPlan: { ...prev.masterPlan, [subField]: value } }));
    } else {
      setDetails((prev) => {
        const updatedArray = [...prev[field]];
        updatedArray[index][subField] = value;
        return { ...prev, [field]: updatedArray };
      });
    }
  };

  const handleFileChange = async (field, index, e) => {
    let file = e?.target?.files?.[0];
    if (!file) {
      if (typeof e === 'string') { // checking if it is avatar url
        const response = await fetch(e);
        const blob = await response.blob();
        file = new File([blob], "avatar.png", { type: blob.type });
      }
    }
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        // Review special case: field "testimonials"
        if (field === "testimonials") {
          const newReviews = [...details.testimonials];
          newReviews[index].src = base64String;
          setDetails((prev) => ({ ...prev, testimonials: newReviews }));
        }
        // Masterplan special case
        else if (field === "masterPlan") {
          setDetails(prev => ({ ...prev, masterPlan: { ...prev.masterPlan, src: base64String } }));
        }
        // General arrays (imageGallery, plans)
        else {
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
    setDetails((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
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
    // Validation logic (simplified for brevity, original logic preserved in essence)
    if (!details?.title) return toast.error("title is required");
    if (!category?._id) return toast.error("category is required");
    if (!builder?._id) return toast.error("builder is required");

    setDisable(true);
    const formData = new FormData();

    // Append standard fields
    for (const key in details) {
      if (details.hasOwnProperty(key) && !["category", "builder", "expertOpinions", "bedrooms", "areas", "features", "faqs", "testimonials", "imageGallery", "plans", "accommodation", "masterPlan"].includes(key)) {
        formData.append(key, details[key]);
      }
    }
    if (category?._id) formData.append("category", category._id);
    if (builder?._id) formData.append("builder", builder._id);

    // Append Complex Fields
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

    if (details?.testimonials) {
      details.testimonials.forEach((testimonial, i) => {
        if (testimonial.name) {
          formData.append(`reviewsName`, testimonial.name);
          formData.append(`reviewsRating`, testimonial.rating);
          formData.append(`reviewsReview`, testimonial.review);
          if (testimonial.src && typeof testimonial.src === "string" && testimonial.src.startsWith("data:image/")) {
            const blob = dataURLtoFile(testimonial.src, `file-${i}.png`);
            formData.append(`reviews`, blob);
          }
        }
      });
    }

    if (details?.masterPlan?.title && details?.masterPlan?.src) {
      if (details.masterPlan.src.startsWith("data:image/")) {
        const blob = dataURLtoFile(details.masterPlan.src, `file-0.png`);
        formData.append(`masterPlan`, blob);
      }
      formData.append(`masterPlanTitle`, details.masterPlan.title);
      formData.append(`masterPlanDesc`, details.masterPlan.desc);
    }

    ["imageGallery", "plans"].forEach(field => {
      if (details[field]) {
        details[field].forEach((item, i) => {
          if (item.title && item.src) {
            if (item.src.startsWith("data:image/")) {
              const blob = dataURLtoFile(item.src, `file-${i}.png`);
              formData.append(field, blob);
            }
            formData.append(`${field}Title`, item.title);
            formData.append(`${field}Desc`, item.desc);
          }
        });
      }
    });

    if (details?.accommodation) {
      details.accommodation.forEach((unit) => {
        if (unit.unit) {
          formData.append(`accommodationUnit`, unit.unit);
          formData.append(`accommodationArea`, unit.area);
          formData.append(`accommodationPrice`, unit.price);
        }
      });
    }

    AddProjects(formData)
      .then((res) => {
        toast.success(res?.message ?? "Projects added");
        setDisable(false);
        localStorage.removeItem(storageKey);
        navigate("/projects");
      })
      .catch((err) => {
        toast.error(err?.message ?? "Something went wrong");
        setDisable(false);
      });
  };

  return (
    <PageLayout title={"Add Projects"}>
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
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="info"
            onClick={() => setAiModalOpen(true)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(17, 205, 239, 0.25)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(17, 205, 239, 0.35)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            ✨ AI Auto-Fill
          </Button>
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
                  disabled={disable}
                  variant="contained"
                  color="info"
                >
                  Add Projects
                </Button>
                <Button sx={{ mr: 0, width: "100%" }} onClick={handleClear} variant="contained" color="secondary">
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>

        </Grid>
      </Box>
      <IconPickerPopup
        open={iconPickerOpen}
        onClose={handleIconPickerClose}
        onSelectIcon={handleIconSelect}
      />

      <AiGeneratorModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onGenerate={handleAiData}
      />
    </PageLayout>
  );
};

export default AddProjects;
