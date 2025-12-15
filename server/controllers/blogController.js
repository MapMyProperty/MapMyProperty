const Blog = require("../models/blogs");
const { deleteFromR2 } = require('../utils/r2Utils');

const getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (req?.query?.banner) {
      filter.banner = req?.query?.banner;
    }
    if (req?.query?.isImportant) {
      filter.isImportant = req?.query?.isImportant;
    }
    if (!req?.query?.isAdmin) {
      filter.status = true;
    }
    const data = await Blog.find(filter);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

const addBlog = async (req, res) => {
  try {
    const { title, subtitle, url, description, status, type } = req?.body;
    const image = req?.file?.key || req?.file?.filename;
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    const existingBanner = await Blog.findOne({ banner: true });
    const banner = !existingBanner;

    const data = new Blog({
      title,
      subtitle,
      url,
      image,
      description,
      status,
      type,
      banner,
    });
    await data.save();
    res.status(201).json({ data, message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ data: blog });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

const getBlogByUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findOne({ url: id });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ data: blog });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

const updateBlog = async (req, res) => {
  const { _id, title, subtitle, url, description, status, isImportant, type } =
    req.body;
  const image = req?.file?.key || req?.file?.filename;
  try {
    const data = await Blog.findById(_id);
    if (!data) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (image) {
      await deleteFromR2(data?.image);
    }
    await Blog.updateOne(
      { _id },
      {
        $set: {
          title,
          subtitle,
          url,
          description,
          status,
          isImportant,
          type,
          ...(image && { image }),
        },
      }
    );
    res.status(200).json({ data, message: "Blog updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Blog.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (data?.image) {
      await deleteFromR2(data?.image);
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error?.message ?? "Something went wrong" });
  }
};

const updateBlogBanner = async (req, res) => {
  const { id } = req.params;
  const { banner } = req.body;

  try {
    if (banner) {
      await Blog.updateMany({ banner: true }, { $set: { banner: false } });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { banner },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res
      .status(200)
      .json({ message: "Banner updated successfully", data: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

module.exports = {
  getBlogs,
  addBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogBanner,
  getBlogByUrl,
};
