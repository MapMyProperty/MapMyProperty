const Banner = require('../models/banner');
const { deleteFromR2 } = require('../utils/r2Utils');

const getBanners = async (req, res) => {
  try {
    const data = await Banner.find()
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const getStoreBanners = async (req, res) => {
  try {
    const data = await Banner.find({ status: true })
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const addBanner = async (req, res) => {
  try {
    const { title, subtitle, url, description, type, src, status } = req?.body
    const image = req?.file?.key || req?.file?.filename
    if (!image && !src) {
      return res.status(404).json({ message: 'Image/video not found' });
    }
    const data = new Banner({ title, subtitle, url, type, src, ...(image && { src: image }), description, status })
    await data.save()
    res.status(201).json({ data, message: 'Banner created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const getBannerById = async (req, res) => {
  const { id } = req.params;
  try {
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json({ data: banner });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
}

const updateBanner = async (req, res) => {
  const { _id, title, subtitle, url, description, type, src, status } = req.body;
  const image = req?.file?.key || req?.file?.filename;
  try {
    const data = await Banner.findById(_id);
    if (!data) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    if (image && data?.type === "image") {
      await deleteFromR2(data?.src);
    }
    await Banner.updateOne({ _id }, {
      $set: { title, subtitle, url, type, src, ...(image && { src: image }), description, status }
    })
    res.status(200).json({ data, message: 'Banner updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Banner.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    if (data?.src && data?.type === "image") {
      await deleteFromR2(data?.src);
    }
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
  }
};

module.exports = {
  getBanners,
  getBannerById,
  getStoreBanners,
  addBanner,
  updateBanner,
  deleteBanner
}