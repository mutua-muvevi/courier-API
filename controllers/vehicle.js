const Vehicle = require("../model/vehicle");
const ErrorResponse = require("../utils/errorResponse");

// posting vehicles
exports.postvehicles = async (req, res, next) => {
    
    try {
        const { type, maxload, IDNumber, range } = req.body
        
        const vehicleExist = await Vehicle.findOne({IDNumber})

        if(vehicleExist){
            return next(new ErrorResponse("This vehicle already exist", 400))
        }

        const vehicle = await Vehicle.create({ type, maxload, IDNumber, range })

        res.status(200).json({
            success: true,
            data: vehicle
        })
    } catch (error) {
        next(error)
    }
}