const mongoose = require("mongoose");
const uuid = require('uuid')
const featureFlagSchema = new mongoose.Schema(
    {

        login: {
            type: Boolean,
            default: true,
        },
        signup: {
            type: Boolean,
            default: true,
        },
        profile: {
            type: Boolean,
            default: true,
        },
        ai_recommendation: {
            type: Boolean,
            default: true,
        },
        box_office: {
            type: Boolean,
            default: true,
        },
        ott_search: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const FeatureFlags = mongoose.model("wh_Feature_flags", featureFlagSchema);

module.exports = FeatureFlags;