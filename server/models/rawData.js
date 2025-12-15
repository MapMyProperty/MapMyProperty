const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const rawDataSchema = new mongoose.Schema(
    {
        projectName: {
            type: String,
            required: true,
        },
        aiResponse: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        status: {
            type: String,
            enum: ["success", "failed"],
            default: "success",
        },
    },
    {
        timestamps: true,
    }
);

rawDataSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("RawData", rawDataSchema);
