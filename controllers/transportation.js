const Transportation = require("../model/transportation");
const ErrorResponse = require("../utils/errorResponse");

// posting the transportation object
exports.postTransportation = async (req, res, next) => {
    const { startPoint,  destination, goodsDimension, goodsState, transporter } = req.body

    try {
        const transportation = await Transportation.create({ startPoint,  destination, goodsDimension, goodsState, transporter })

        res.status(200).json({
            success: true,
            data: transportation
        })

    } catch (error) {
        next(error)
    }
}

// getting a ll stransportation objects
exports.getAllTransportation = async (req, res, next) => {
    try {
        const transports = await Transportation
            .find()
            // .populate("transporter")
            .populate({ path: "transporter"})
            .populate({ path: "vehicle", sort: { createdAt: -1} })

        res.status(200).json({
            success: true,
            data: transports
        })
    } catch (error) {
        next(error)
    }
}