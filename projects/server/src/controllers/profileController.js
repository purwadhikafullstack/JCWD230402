const { check, validationResult } = require('express-validator');
const model = require('../models')
const { createToken } = require('../helpers/jwt')
const { sequelize } = require('../models')
const { v4: uuidv4 } = require('uuid')
const transporter = require("../helpers/nodemailer")
const bcrypt = require('bcrypt')

let salt = bcrypt.genSaltSync(10);

module.exports ={
    editProfile: async(req,res,next) => {
        try {
            console.log("Decript token:", req.decript);
            const { name, gender, phone, address } = req.body;
            if(name || gender || phone || address){
              await model.customer.update(
                req.body ,
                {
                  where: {
                    id: req.decrypt.id,
                  },
                }
                );
                return res.status(200).send({
                  success: true,
                  message: "Edit profile success ",
                });
              } else {
                res.status(400).send({
                  success: false,
                  message: "Cannot change data",
                });
              }
          } catch (error) {
            console.log(error);
            next(error);
          }
    },
}