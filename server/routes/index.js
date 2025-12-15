const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const projectsRoutes = require('./projectsRoutes');
const buildersRoutes = require('./buildersRoutes');
const categoryRoutes = require('./categoryRoutes');
const addressRoutes = require('./addressRoutes');
const bannerRoutes = require('./bannerRoutes');
const blogRoutes = require('./blogRoutes');
const reviewRoutes = require('./reviewRoutes')
const contactRoutes = require('./contactRoutes')
const projectEnquiryRoute = require('./projectEnquiryRoute')
const sectionRoutes = require('./sectionRoutes');
const tagRoutes = require('./tagRoutes');


const router = express.Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/category', categoryRoutes);
router.use('/v1/projects', projectsRoutes);
router.use('/v1/builders', buildersRoutes);
router.use('/v1/address', addressRoutes);
router.use('/v1/banners', bannerRoutes);
router.use('/v1/blogs', blogRoutes);
router.use('/v1/reviews', reviewRoutes);
router.use('/v1/contact', contactRoutes);
router.use('/v1/projectEnquiry', projectEnquiryRoute);
router.use('/v1/section', sectionRoutes);
router.use('/v1/tags', tagRoutes);
router.use('/v1/ai', require('./aiRoute'));
router.use('/v1/analytics', require('./analyticsRoute'));


module.exports = router;
