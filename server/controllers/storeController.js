const Section = require('../models/sections');
const { deleteFromR2 } = require('../utils/r2Utils');

const getSections = async (req, res) => {
   try {
      const data = await Section.find()
      res.status(200).json({ data })
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

const getStoreSections = async (req, res) => {
   try {
      const data = await Section.find({ status: true })
         .populate({
            path: 'projects',
            populate: { path: 'category' },
            populate: { path: 'builder' },
         });
      res.status(200).json({ data })
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

const addSection = async (req, res) => {
   try {
      const { title, subtitle, projects, description, status } = req?.body
      const image = req?.file?.key || req?.file?.filename
      if (!image) {
         return res.status(404).json({ message: 'Image not found' });
      }
      const data = new Section({ title, subtitle, projects, image, description, status })
      await data.save()
      res.status(201).json({ data, message: 'Section created successfully' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
}

const getSectionById = async (req, res) => {
   const { id } = req.params;
   try {
      const section = await Section.findById(id).populate('projects')
      if (!section) {
         return res.status(404).json({ message: 'Section not found' });
      }
      res.status(200).json({ data: section });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
}

const updateSection = async (req, res) => {
   const { _id, title, projects, subtitle, description, status } = req.body;
   const image = req?.file?.key || req?.file?.filename;
   try {
      const data = await Section.findById(_id);
      if (!data) {
         return res.status(404).json({ message: 'Section not found' });
      }
      if (image) {
         if (data?.image) { // Check if there's an old image to delete
            await deleteFromR2(data?.image);
         }
      }
      await Section.updateOne({ _id }, {
         $set: { title, subtitle, projects, description, status, ...(image && { image }) }
      })
      res.status(200).json({ data, message: 'Section updated successfully' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

const deleteSection = async (req, res) => {
   const { id } = req.params;
   try {
      const data = await Section.findByIdAndDelete(id);
      if (!data) {
         return res.status(404).json({ message: 'Section not found' });
      }
      if (data?.image) {
         await deleteFromR2(data?.image);
      }
      res.status(200).json({ message: 'Section deleted successfully' });
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error?.message ?? 'Something went wrong' })
   }
};

module.exports = {
   getSections,
   getStoreSections,
   addSection,
   getSectionById,
   updateSection,
   deleteSection
}