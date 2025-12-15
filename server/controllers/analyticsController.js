const Projects = require("../models/projects");
const Builders = require("../models/builders");
const ProjectEnquiry = require("../models/projectEnquiry");
const User = require("../models/user");
const Category = require("../models/category");

const getDashboardStats = async (req, res) => {
    try {
        const totalProjects = await Projects.countDocuments();
        const totalBuilders = await Builders.countDocuments();
        const totalEnquiries = await ProjectEnquiry.countDocuments();
        const totalUsers = await User.countDocuments();

        // Projects by Status
        const projectsByStatus = await Projects.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Enquiries Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const enquiriesTrend = await ProjectEnquiry.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
        ]);

        // Projects by Category
        const categoryDistribution = await Projects.aggregate([
            {
                $lookup: {
                    from: "categories", // Ensure this matches your collection name in Mongo
                    localField: "category",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: "$categoryDetails",
            },
            {
                $group: {
                    _id: "$categoryDetails.name",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                counts: {
                    projects: totalProjects,
                    builders: totalBuilders,
                    enquiries: totalEnquiries,
                    users: totalUsers,
                },
                charts: {
                    projectsByStatus,
                    enquiriesTrend,
                    categoryDistribution,
                },
            },
        });
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch analytics data", error: error.message });
    }
};

module.exports = {
    getDashboardStats,
};
