const Projects = require('../models/projects');
const Category = require('../models/category')


const getAdminprojects = async (req, res) => {
  try {
    const { page = 1, perPage = 10, sortBy = 'createdAt', order = 'desc', search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(perPage, 10),
      sort: { [sortBy]: order === 'desc' ? -1 : 1 }
    };   

    const projects = await Projects.paginate(query, options);
  

    res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};


const getprojectsById = async (req, res) => {
  try {
    const data = await Projects.findOne({ _id: req.params.id }).populate('category')
    res.status(200).json({ data, message: 'projects found successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
}   


const addprojects = async (req, res) => {
  try {
    const { name, subheading, category, location, description, BuilderDescription, ExpertOpinions, ongoing, upcoming, completed,
      configuration, configurationDetails, questions, answer, unitType, configurationSize, Specifications, SpecificationsDetails,
      reviewsName, reviewsRating, reviewsReview, configurationIcon, unitIcon, SpecificationsIcon,price, href,
      ApartmentText, ApartmentHelpertext, ApartmentIcon, LocationText, LocationHelpertext, LocationIcon ,
      masterPlanTitle,masterPlanDesc,imageGalleryTitle,imageGalleryDesc,floorPlansTitle,floorPlansDesc,accommodationUnit,accommodationArea,accommodationPrice} = req?.body;


    let configurationValue = [];
    if (configuration) {
      const configurationArray = Array.isArray(configuration) ? configuration : [configuration];
      const DetailsArray = Array.isArray(configurationDetails) ? configurationDetails : [configurationDetails];
      const iconsArray = Array.isArray(configurationIcon) ? configurationIcon : [configurationIcon];
      const configurationInside = configurationArray.map((configuration, index) => ({
        configuration,
        details: DetailsArray[index],
        icon: iconsArray[index]
      }));
      configurationValue = configurationInside[0]?.configuration ? configurationInside : undefined;
    }

    let ApartmentValue = [];
    if (ApartmentText) {
      const ApartmentArray = Array.isArray(ApartmentText) ? ApartmentText : [ApartmentText];
      const DetailsArray = Array.isArray(ApartmentHelpertext) ? ApartmentHelpertext : [ApartmentHelpertext];
      const iconsArray = Array.isArray(ApartmentIcon) ? ApartmentIcon : [ApartmentIcon];
      const ApartmentInside = ApartmentArray.map((text, index) => ({
        text,
        helpertext: DetailsArray[index],
        icon: iconsArray[index]
      }));
      ApartmentValue = ApartmentInside[0]?.text ? ApartmentInside : undefined;
    }


    let LocationValue = [];
    if (LocationText) {
      const LocationArray = Array.isArray(LocationText) ? LocationText : [LocationText];
      const DetailsArray = Array.isArray(LocationHelpertext) ? LocationHelpertext : [LocationHelpertext];
      const iconsArray = Array.isArray(LocationIcon) ? LocationIcon : [LocationIcon];
      const LocationInside = LocationArray.map((text, index) => ({
        text,
        helpertext: DetailsArray[index],
        icon: iconsArray[index]
      }));
      LocationValue = LocationInside[0]?.text ? LocationInside : undefined;
    }


    let faqsValue = [];
    if (questions) {
      const questionsArray = Array.isArray(questions) ? questions : [questions];
      const answerArray = Array.isArray(answer) ? answer : [answer];
      const faqsInside = questionsArray.map((questions, index) => ({
        questions,
        answer: answerArray[index]
      }));
      faqsValue = faqsInside[0]?.questions ? faqsInside : undefined;
    }


    let unitValue = [];
    if (unitType) {
      const unitTypeArray = Array.isArray(unitType) ? unitType : [unitType];
      const configurationSizeArray = Array.isArray(configurationSize) ? configurationSize : [configurationSize];
      const iconsArray = Array.isArray(unitIcon) ? unitIcon : [unitIcon];
      const configurationInside = unitTypeArray.map((unitType, index) => ({
        unitType,
        configurationSize: configurationSizeArray[index],
        icon: iconsArray[index]
      }));
      unitValue = configurationInside[0]?.unitType ? configurationInside : undefined;
    }
    let spacunitValue = [];
    if (Specifications) {
      const SpecificationsArray = Array.isArray(Specifications) ? Specifications : [Specifications];
      const SpecificationsDetailsArray = Array.isArray(SpecificationsDetails) ? SpecificationsDetails : [SpecificationsDetails];
      const iconsArray = Array.isArray(SpecificationsIcon) ? SpecificationsIcon : [SpecificationsIcon];
      const configurationInside = SpecificationsArray.map((Specifications, index) => ({
        Specifications,
        SpecificationsDetails: SpecificationsDetailsArray[index],
        icon: iconsArray[index]
      }));
      spacunitValue = configurationInside[0]?.Specifications ? configurationInside : undefined;
    }
    let reviewValue = [];
    if (reviewsName) {
      const reviewsNameArray = Array.isArray(reviewsName) ? reviewsName : [reviewsName];
      const reviewsRatingArray = Array.isArray(reviewsRating) ? reviewsRating : [reviewsRating];
      const reviewsReviewArray = Array.isArray(reviewsReview) ? reviewsReview : [reviewsReview];
      const configurationInside = reviewsNameArray.map((name, index) => ({
        name,
        rating: reviewsRatingArray[index],
        review: reviewsReviewArray[index],
      }));

      reviewValue = configurationInside[0]?.name ? configurationInside : undefined;
    }  

    const masterPlan = {
      title: masterPlanTitle,
      desc: masterPlanDesc,
      src: req.files.masterPlan && req.files.masterPlan[0].filename,
    };
    const imageGallery = Array.isArray(imageGalleryTitle)?( imageGalleryTitle.map((item, i) => ({
      title: item,
      desc: imageGalleryDesc[i],
      src: req.files.imageGallery && req.files.imageGallery[i].filename ,
    }))) :
    ({
      title: imageGalleryTitle,
      desc: imageGalleryDesc,
      src: req.files.imageGallery && req.files.imageGallery[0].filename ,
    })

    const floorPlans =  Array.isArray(floorPlansTitle)?( floorPlansTitle.map((item, i) => ({
      title: item,
      desc: floorPlansDesc[i],
      src: req.files.floorPlans && req.files.floorPlans[i].filename ,
    }))):
    ({
      title: floorPlansTitle,
      desc: floorPlansDesc,
      src: req.files.floorPlans && req.files.floorPlans[0].filename,
    });
    const accommodation =Array.isArray(accommodationUnit)?( accommodationUnit.map((item, i) => ({
      unit: item,
      area: accommodationArea[i],
      price:accommodationPrice[i]
    }))):
    ({
      unit: accommodationUnit,
      area: accommodationArea,
      price:accommodationPrice
    }); 
    if (req.files.length != 0) {
      const projects = new Projects({
        name, subheading, category, description, BuilderDescription, ExpertOpinions, ongoing, upcoming, completed, location,
        configurations: configurationValue, faqs: faqsValue, unit: unitValue, Spec: spacunitValue, reviews: reviewValue,
        ApartmentAmenities:ApartmentValue, LocationAdvantages:LocationValue,image: req.files.images.map((x) => x.filename),
        price,href,masterPlan:masterPlanTitle && masterPlan,imageGallery: imageGalleryTitle && imageGallery,floorPlans: floorPlansTitle && floorPlans ,
        accommodation: accommodationUnit && accommodation
      }); 
      await projects.save();

      if (projects) {
        await Category.updateOne({ _id: category }, { $push: { projects: projects._id } })
        res.status(200).json({ message: "Projects added successfully !" });

      } else {
        res.status(400).json({ message: "Something went wrong !" });
      }
    } else {
      res.status(400).json({ message: "failed only jpg ,jpeg, webp & png file supported !" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
};

const updateprojects = async (req, res) => {
  try {
    const { _id, image, isAvailable, name, subheading, location, description, BuilderDescription, ExpertOpinions, ongoing, upcoming, completed,
      configuration, configurationDetails, questions, answer, unitType, configurationSize, Specifications, SpecificationsDetails,
      reviewsName, reviewsRating, reviewsReview, configurationIcon, unitIcon, SpecificationsIcon, ApartmentText,
      ApartmentHelpertext, ApartmentIcon, LocationText, LocationHelpertext, LocationIcon } = req?.body

      let configurationValue = [];
      if (configuration) {
        const configurationArray = Array.isArray(configuration) ? configuration : [configuration];
        const DetailsArray = Array.isArray(configurationDetails) ? configurationDetails : [configurationDetails];
        const iconsArray = Array.isArray(configurationIcon) ? configurationIcon : [configurationIcon];
        const configurationInside = configurationArray.map((configuration, index) => ({
          configuration,
          details: DetailsArray[index],
          icon: iconsArray[index]
        }));
        configurationValue = configurationInside[0]?.configuration ? configurationInside : undefined;
      }
  
      let ApartmentValue = [];
      if (ApartmentText) {
        const ApartmentArray = Array.isArray(ApartmentText) ? ApartmentText : [ApartmentText];
        const DetailsArray = Array.isArray(ApartmentHelpertext) ? ApartmentHelpertext : [ApartmentHelpertext];
        const iconsArray = Array.isArray(ApartmentIcon) ? ApartmentIcon : [ApartmentIcon];
        const ApartmentInside = ApartmentArray.map((text, index) => ({
          text,
          helpertext: DetailsArray[index],
          icon: iconsArray[index]
        }));
        ApartmentValue = ApartmentInside[0]?.text ? ApartmentInside : undefined;
      }
  
  
      let LocationValue = [];
      if (LocationText) {
        const LocationArray = Array.isArray(LocationText) ? LocationText : [LocationText];
        const DetailsArray = Array.isArray(LocationHelpertext) ? LocationHelpertext : [LocationHelpertext];
        const iconsArray = Array.isArray(LocationIcon) ? LocationIcon : [LocationIcon];
        const LocationInside = LocationArray.map((text, index) => ({
          text,
          helpertext: DetailsArray[index],
          icon: iconsArray[index]
        }));
        LocationValue = LocationInside[0]?.text ? LocationInside : undefined;
      }


    let faqsValue = [];
    if (questions) {
      const questionsArray = Array.isArray(questions) ? questions : [questions];
      const answerArray = Array.isArray(answer) ? answer : [answer];
      const faqsInside = questionsArray.map((questions, index) => ({
        questions,
        answer: answerArray[index]
      }));
      faqsValue = faqsInside[0]?.questions ? faqsInside : undefined;
    }


    let unitValue = [];
    if (unitType) {
      const unitTypeArray = Array.isArray(unitType) ? unitType : [unitType];
      const configurationSizeArray = Array.isArray(configurationSize) ? configurationSize : [configurationSize];
      const iconsArray = Array.isArray(unitIcon) ? unitIcon : [unitIcon];
      const configurationInside = unitTypeArray.map((unitType, index) => ({
        unitType,
        configurationSize: configurationSizeArray[index],
        icon: iconsArray[index]
      }));
      unitValue = configurationInside[0]?.unitType ? configurationInside : undefined;
    }
    let spacunitValue = [];
    if (Specifications) {
      const SpecificationsArray = Array.isArray(Specifications) ? Specifications : [Specifications];
      const SpecificationsDetailsArray = Array.isArray(SpecificationsDetails) ? SpecificationsDetails : [SpecificationsDetails];
      const iconsArray = Array.isArray(SpecificationsIcon) ? SpecificationsIcon : [SpecificationsIcon];
      const configurationInside = SpecificationsArray.map((Specifications, index) => ({
        Specifications,
        SpecificationsDetails: SpecificationsDetailsArray[index],
        icon: iconsArray[index]
      }));
      spacunitValue = configurationInside[0]?.Specifications ? configurationInside : undefined;
    }
    let reviewValue = [];
    if (reviewsName) {
      const reviewsNameArray = Array.isArray(reviewsName) ? reviewsName : [reviewsName];
      const reviewsRatingArray = Array.isArray(reviewsRating) ? reviewsRating : [reviewsRating];
      const reviewsReviewArray = Array.isArray(reviewsReview) ? reviewsReview : [reviewsReview];
      const configurationInside = reviewsNameArray.map((name, index) => ({
        name,
        rating: reviewsRatingArray[index],
        review: reviewsReviewArray[index],
      }));
      reviewValue = configurationInside[0]?.name ? configurationInside : undefined;

    }

    const images = JSON.parse(image) ?? []
    if (req?.files?.length != 0) {
      req?.files?.map((x) => images.push(x.filename))
    }

    await Projects.updateOne({ _id }, {
      $set: {
        isAvailable, image: images, name, subheading, description, BuilderDescription, ExpertOpinions, ongoing, upcoming, completed, location,
        configurations: configurationValue, faqs: faqsValue, unit: unitValue, Spec: spacunitValue, reviews: reviewValue,
        ApartmentAmenities:ApartmentValue, LocationAdvantages:LocationValue,
      }
    })

    res.status(200).json({ message: "projects updated successfully !" });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
}

const deleteprojects = async (req, res) => {
  try {
    await Projects.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: 'projects deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error?.message ?? "Something went wrong !" });
  }
}

const getSelectprojects = async (req, res) => {
  try {
    const data = await Projects.find({ isAvailable: true })
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  addprojects,
  getprojectsById,
  updateprojects,
  deleteprojects,
  getAdminprojects,
  getSelectprojects,
}  