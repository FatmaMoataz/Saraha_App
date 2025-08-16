import joi from "joi"
import { Types } from "mongoose"
import { asyncHandler } from "../utils/response.js"
import { genderEnum } from "../DB/models/User.model.js"

export const generalFields = {
      fullName:joi.string().min(2).max(20).required().messages({
        "string.min":"min name length is 2 char",
        "any.required":"fullName is mandatory"
      }),
        email: joi.string().email({minDomainSegments:2, maxDomainSegments:3, tlds:{allow:['net','com']}}).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
      confirmPassword: joi.string().valid(joi.ref("password")).required(),
        phone: joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)).required(),
        otp:joi.string().pattern(new RegExp(/^\d{6}$/)),
        gender:joi.string().valid(...Object.values(genderEnum)),
        id: joi.string().custom((value, helper) => {
            return Types.ObjectId.isValid(value) || helper.message("Invalid ObjectId")
        }).length(24).required(),
          file: {
                  fieldname: joi.string().required(),
                  originalname: joi.string().required(),
                  encoding: joi.string().required(),
                  mimetype: joi
                    .string()
                    .required(),
                  finalPath: joi.string().required(),
                  destination: joi.string().required(),
                  filename: joi.string().required(),
                  path: joi.string().required(),
                  size: joi.number().positive().required(),
            },

}

export const validation =(schema) => {
    return asyncHandler(
        async(req, res, next) => {
            const validationError=[]
            for(const key of Object.keys(schema)) {

const validationResult = schema[key].validate(req[key] , {abortEarly:false})
if(validationResult.error) {
    validationError.push({key, details:validationResult.error.details.map(ele => {
        return {message:ele.message, path: ele.path[0]}
    })})
}

            }
            if(validationError.length) {
                return res.status(400).json({error_message:"Validation error", validationError})
            }
                    return next()
        }

    )
}
