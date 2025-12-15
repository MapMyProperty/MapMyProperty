const Projects = require("../models/projects");
const { deleteFromR2 } = require('../utils/r2Utils');
const Category = require("../models/category");
const Builders = require("../models/builders");
const Tags = require("../models/tags");

const getAdminProjects = async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = "createdAt",
      order = "desc",
      search = "",
    } = req.query;
    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: order === "desc" ? -1 : 1 },
    };

    const projects = await Projects.paginate(query, options);

    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong !" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const data = await Projects.findOne({ _id: req.params.id })
      .populate("category")
      .populate("builder");
    res.status(200).json({ data, message: "projects found successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong !" });
  }
};

const getProjectByUrl = async (req, res) => {
  try {
    const data = await Projects.findOne({ href: req.params.url })
      .populate("category")
      .populate("builder");
    res.status(200).json({ data, message: "projects found successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong !" });
  }
};

const addProject = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      location,
      description,
      expertOpinions,
      questions,
      answer,
      builder,
      bedrooms,
      areas,
      reviewsName,
      reviewsRating,
      reviewsReview,
      minPrice,
      maxPrice,
      status,
      href,
      masterPlanTitle,
      masterPlanDesc,
      features,
      imageGalleryTitle,
      imageGalleryDesc,
      plansTitle,
      plansDesc,
      accommodationUnit,
      accommodationArea,
      accommodationPrice,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req?.body;

    let featuresArray;
    if (features) {
      featuresArray = Object.entries(features).map(([title, items]) => {
        const parsedItems = items.map((item) => {
          const parsedItem = JSON.parse(item);
          return {
            text: parsedItem.text || "",
            helpertext: parsedItem.helpertext || "",
            icon: parsedItem.icon || "",
          };
        });

        return {
          title,
          items: parsedItems.filter(
            (item) => item.text || item.helpertext || item.icon
          ),
        };
      });
    }

    let faqsValue = [];
    if (questions) {
      const questionsArray = Array.isArray(questions) ? questions : [questions];
      const answerArray = Array.isArray(answer) ? answer : [answer];
      const faqsInside = questionsArray.map((questions, index) => ({
        questions,
        answer: answerArray[index],
      }));
      faqsValue = faqsInside[0]?.questions ? faqsInside : undefined;
    }

    let testimonialValue = [];
    if (reviewsName) {
      const reviewsNameArray = Array.isArray(reviewsName)
        ? reviewsName
        : [reviewsName];
      const reviewsRatingArray = Array.isArray(reviewsRating)
        ? reviewsRating
        : [reviewsRating];
      const reviewsReviewArray = Array.isArray(reviewsReview)
        ? reviewsReview
        : [reviewsReview];
      const configurationInside = reviewsNameArray.map((name, index) => ({
        name,
        rating: reviewsRatingArray[index],
        review: reviewsReviewArray[index],
        image: req.files.reviews && (req.files.reviews[index]?.key || req.files.reviews[index]?.filename),
      }));

      testimonialValue = configurationInside[0]?.name
        ? configurationInside
        : undefined;
    }

    const masterPlan = {
      title: masterPlanTitle,
      desc: masterPlanDesc,
      src: req.files.masterPlan && (req.files.masterPlan[0]?.key || req.files.masterPlan[0]?.filename),
    };
    const imageGallery = Array.isArray(imageGalleryTitle)
      ? imageGalleryTitle.map((item, i) => ({
        title: item,
        desc: imageGalleryDesc[i],
        src: req.files.imageGallery && (req.files.imageGallery[i]?.key || req.files.imageGallery[i]?.filename),
      }))
      : {
        title: imageGalleryTitle,
        desc: imageGalleryDesc,
        src: req.files.imageGallery && (req.files.imageGallery[0]?.key || req.files.imageGallery[0]?.filename),
      };

    const plans = Array.isArray(plansTitle)
      ? plansTitle.map((item, i) => ({
        title: item,
        desc: plansDesc[i],
        src: req.files.plans && (req.files.plans[i]?.key || req.files.plans[i]?.filename),
      }))
      : {
        title: plansTitle,
        desc: plansDesc,
        src: req.files.plans && (req.files.plans[0]?.key || req.files.plans[0]?.filename),
      };
    const accommodation = Array.isArray(accommodationUnit)
      ? accommodationUnit.map((item, i) => ({
        unit: item,
        area: accommodationArea[i],
        price: accommodationPrice[i],
      }))
      : {
        unit: accommodationUnit,
        area: accommodationArea,
        price: accommodationPrice,
      };

    const projects = new Projects({
      title,
      subtitle,
      category,
      builder,
      description,
      expertOpinions,
      location,
      testimonials: testimonialValue,
      bedrooms,
      areas,
      faqs: faqsValue,
      minPrice,
      maxPrice,
      status,
      href,
      masterPlan: masterPlanTitle && masterPlan,
      imageGallery: imageGalleryTitle && imageGallery,
      plans: plansTitle && plans,
      accommodation: accommodationUnit && accommodation,
      features: featuresArray,
      metaTitle,
      metaDescription,
      metaKeywords,
    });
    await projects.save();

    if (projects) {
      await Category.updateOne(
        { _id: category },
        { $push: { projects: projects._id } }
      );
      await Builders.updateOne(
        { _id: builder },
        { $push: { projects: projects._id } }
      );
      res.status(200).json({ message: "Projects added successfully !" });
    } else {
      res.status(400).json({ message: "Something went wrong !" });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong !" });
  }
};

const updateProject = async (req, res) => {
  try {
    const {
      _id,
      isAvailable,
      title,
      subtitle,
      location,
      description,
      expertOpinions,
      questions,
      features,
      category_id,
      builder,
      reviewsName,
      reviewsRating,
      reviewsReview,
      minPrice,
      maxPrice,
      status,
      href,
      masterPlanTitle,
      masterPlanDesc,
      answer,
      bedrooms,
      areas,
      imageGalleryTitle,
      imageGalleryDesc,
      floorPlansTitle,
      floorPlansDesc,
      accommodationUnit,
      accommodationArea,
      accommodationPrice,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = req?.body;

    let featuresArray;
    if (features) {
      featuresArray = Object.entries(features).map(([title, items]) => {
        const parsedItems = items.map((item) => {
          const parsedItem = JSON.parse(item);
          return {
            text: parsedItem.text || "",
            helpertext: parsedItem.helpertext || "",
            icon: parsedItem.icon || "",
          };
        });

        return {
          title,
          items: parsedItems.filter(
            (item) => item.text || item.helpertext || item.icon
          ),
        };
      });
    }

    let faqsValue = [];
    if (questions) {
      const questionsArray = Array.isArray(questions) ? questions : [questions];
      const answerArray = Array.isArray(answer) ? answer : [answer];
      const faqsInside = questionsArray.map((questions, index) => ({
        questions,
        answer: answerArray[index],
      }));
      faqsValue = faqsInside[0]?.questions ? faqsInside : undefined;
    }

    let testimonialValue = [];
    let k = 0;
    if (reviewsName) {
      const reviewsNameArray = Array.isArray(reviewsName)
        ? reviewsName
        : [reviewsName];
      const reviewsRatingArray = Array.isArray(reviewsRating)
        ? reviewsRating
        : [reviewsRating];
      const reviewsReviewArray = Array.isArray(reviewsReview)
        ? reviewsReview
        : [reviewsReview];
      const configurationInside = reviewsNameArray.map((name, index) => ({
        name,
        rating: reviewsRatingArray[index],
        review: reviewsReviewArray[index],
        image: Array.isArray(req?.body?.reviewsImagePocision)
          ? req?.body?.reviewsImagePocision[index] === ""
            ? (k++, (req.files.reviews[k - 1]?.key || req.files.reviews[k - 1]?.filename))
            : req?.body?.reviewsImagePocision[index]
          : req?.body?.reviewsImagePocision === ""
            ? (req.files.reviews[0]?.key || req.files.reviews[0]?.filename)
            : req?.body?.reviewsImagePocision,
      }));

      testimonialValue = configurationInside[0]?.name
        ? configurationInside
        : undefined;
    }

    const masterPlan = {
      title: masterPlanTitle,
      desc: masterPlanDesc,
      src: req.files.masterPlan ?? req.body.masterPlan,
    };

    const existingProject = await Projects.findById(_id);

    if (req?.files?.masterPlan?.length > 0) {
      if (existingProject?.masterPlan?.src) {
        await deleteFromR2(existingProject.masterPlan.src);
      }
      masterPlan.src = req.files.masterPlan[0].key || req.files.masterPlan[0].filename;
    }
    let m = 0;
    const imageGallery = Array.isArray(imageGalleryTitle)
      ? imageGalleryTitle.map((item, i) => ({
        title: item,
        desc: imageGalleryDesc[i],
        src:
          req?.body?.imageGalleryPocision[i] === ""
            ? (m++, (req.files.imageGallery[m - 1]?.key || req.files.imageGallery[m - 1]?.filename))
            : req?.body?.imageGalleryPocision[i],
      }))
      : {
        title: imageGalleryTitle,
        desc: imageGalleryDesc,
        src: req.files.imageGallery
          ? (req.files.imageGallery[0]?.key || req.files.imageGallery[0]?.filename)
          : req?.body?.imageGalleryPocision,
      };
    let s = 0;
    const floorPlans = Array.isArray(floorPlansTitle)
      ? floorPlansTitle.map((item, i) => ({
        title: item,
        desc: floorPlansDesc[i],
        src:
          req?.body?.floorPlansimagePocision[i] === ""
            ? (s++, (req.files.floorPlans[s - 1]?.key || req.files.floorPlans[s - 1]?.filename))
            : req?.body?.floorPlansimagePocision[i],
      }))
      : {
        title: floorPlansTitle,
        desc: floorPlansDesc,
        src: req.files.floorPlans
          ? (req.files.floorPlans[0]?.key || req.files.floorPlans[0]?.filename)
          : req?.body?.floorPlansimagePocision,
      };
    const accommodation = Array.isArray(accommodationUnit)
      ? accommodationUnit.map((item, i) => ({
        unit: item,
        area: accommodationArea[i],
        price: accommodationPrice[i],
      }))
      : {
        unit: accommodationUnit,
        area: accommodationArea,
        price: accommodationPrice,
      };

    const projectUpdateResult = await Projects.updateOne(
      { _id },
      {
        $set: {
          isAvailable,
          title,
          subtitle,
          description,
          category: category_id,
          expertOpinions,
          location,
          faqs: faqsValue,
          bedrooms,
          areas,
          minPrice,
          maxPrice,
          status,
          href,
          masterPlan: masterPlanTitle && masterPlan,
          features: featuresArray,
          builder,
          imageGallery: imageGalleryTitle && imageGallery,
          plans: floorPlansTitle && floorPlans,
          testimonials: testimonialValue,
          accommodation: accommodationUnit && accommodation,
          metaTitle,
          metaDescription,
          metaKeywords,
        },
      }
    );

    if (projectUpdateResult.modifiedCount > 0 && builder) {
      await Builders.updateOne(
        { projects: { $in: [_id] } },
        { $pull: { projects: _id } }
      );
      await Builders.updateOne({ _id: builder }, { $push: { projects: _id } });
    }
    if (category_id) {
      await Category.updateOne(
        { projects: { $in: [_id] } },
        { $pull: { projects: _id } }
      );
      await Category.updateOne(
        { _id: category_id },
        { $push: { projects: _id } }
      );
    }

    res.status(200).json({ message: "projects updated successfully !" });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong !" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const data = await Projects.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete Master Plan
    if (data.masterPlan?.src) {
      await deleteFromR2(data.masterPlan.src);
    }

    // Delete Image Gallery
    if (data.imageGallery && Array.isArray(data.imageGallery)) {
      for (const img of data.imageGallery) {
        if (img.src) await deleteFromR2(img.src);
      }
    } else if (data.imageGallery?.src) {
      await deleteFromR2(data.imageGallery.src);
    }

    // Delete Floor Plans
    if (data.plans && Array.isArray(data.plans)) {
      for (const plan of data.plans) {
        if (plan.src) await deleteFromR2(plan.src);
      }
    } else if (data.plans?.src) {
      await deleteFromR2(data.plans.src);
    }

    // Delete Testimonials
    if (data.testimonials && Array.isArray(data.testimonials)) {
      for (const testimonial of data.testimonials) {
        if (testimonial.image) await deleteFromR2(testimonial.image);
      }
    }

    await Projects.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "projects deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong !" });
  }
};

const getSelectProjects = async (req, res) => {
  try {
    const data = await Projects.find({ isAvailable: true });
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
  }
};

const getFilteredProjects = async (req, res) => {
  console.log("getFilteredProjects");

  try {
    const {
      page = 1,
      perPage = 10,
      search = "",
      area,
      price,
      bedroom,
      resident_type,
      location,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};
    query.isAvailable = true;
    const andConditions = [];

    if (search) {
      const matchingCategories = await Category.find(
        { name: { $regex: search, $options: "i" }, isAvailable: true },
        "_id"
      ).lean();
      const matchingCategoryIds = matchingCategories.map((cat) => cat._id);
      const matchingBuilders = await Builders.find(
        { title: { $regex: search, $options: "i" }, isAvailable: true },
        "_id"
      ).lean();
      const matchingBuilderIds = matchingBuilders.map((builder) => builder._id);
      let tagProductIds = [];
      const matchingTags = await Tags.find(
        { title: { $regex: search, $options: "i" }, status: true },
        "projects"
      ).lean();
      matchingTags.forEach((tagItem) => {
        tagProductIds = [
          ...tagProductIds,
          ...tagItem.projects.map((prod) => prod._id),
        ];
      });

      andConditions.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $in: matchingCategoryIds } },
          { _id: { $in: tagProductIds } },
          { builder: { $in: matchingBuilderIds } },
          { status: { $regex: search, $options: "i" } },
        ],
      });
    }

    if (price) {
      const { min = 0, max = Number.MAX_SAFE_INTEGER } = JSON.parse(price);
      andConditions.push({
        $or: [
          { minPrice: { $gte: min, $lte: max } },
          { maxPrice: { $gte: min, $lte: max } },
        ],
      });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    if (area) {
      const { min = 0, max = Number.MAX_SAFE_INTEGER } = JSON.parse(area);
      query.areas = {
        $elemMatch: { $gte: parseFloat(min), $lte: parseFloat(max) },
      };
    }

    if (bedroom) {
      query.bedrooms = bedroom;
    }

    if (resident_type) {
      const category = await Category.findOne({
        name: { $regex: resident_type, $options: "i" },
      });
      if (category) {
        query.category = category._id;
      } else {
        return res.status(404).json({ message: "Resident type not found" });
      }
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: order === "desc" ? -1 : 1 },
      populate: [{ path: "category" }, { path: "builder" }],
    };

    const projects = await Projects.paginate(query, options);
    if (projects.docs.length > 0) {
      res.status(200).json({
        data: projects,
        message: `Showing 1 - ${projects.docs.length < 10 ? projects.docs.length : 10
          } of ${projects.totalDocs} ${projects.totalDocs === 1 ? "property" : "properties"
          }`,
      });
    } else {
      const suggestedProjects = await Projects.paginate(
        { isAvailable: true },
        options
      );
      res.status(200).json({
        data: suggestedProjects,
        message: `Oops! No results found, Showing Map My Property's suggested properties`,
      });
    }
  } catch (error) {
    console.error(error.message);
    res
      .status(400)
      .json({ message: error?.message ?? "Something went wrong!" });
  }
};

module.exports = {
  addProject,
  getProjectById,
  updateProject,
  deleteProject,
  getAdminProjects,
  getSelectProjects,
  getFilteredProjects,
  getProjectByUrl,
};
