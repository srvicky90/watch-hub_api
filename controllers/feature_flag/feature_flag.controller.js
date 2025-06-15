const { func } = require("joi");
const errorFunction = require("../../utils/error_function");
const FeatureFlags = require("../../models/feature_flag");


const featureFlag = async (req, res, next) => {
    try {
        const featureFlags = await FeatureFlags.findOne({})
        if (!featureFlags) {
            console.log("featureFlags not found");
            res.status(404);
            return res.json(errorFunction(true, "Feature flags not found"));
        }
        console.log("featureFlags", featureFlags);
        res.status(201);
        return res.json(
            errorFunction(false, "Feature Flag", featureFlags)
        );
    } catch (error) {
        console.log("error", error);
        res.status(403);
        return res.json(errorFunction(true, "Unable to fetch feature flags"));
    }
}
module.exports = {
    featureFlag
};