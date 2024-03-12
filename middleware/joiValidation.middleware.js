const Joi = require("joi");
const { ObjectId } = require("mongodb");

const isValidObjId = (value, helpers) => {
  if (!ObjectId.isValid(value)) return helpers.error("any.invalid");
  return value;
};

// ---------- Schemas ---------

const storeQueriesSchema = Joi.object({
  page: Joi.number().min(1),
  pageSize: Joi.number().min(1),
});

const cartItemSchema = Joi.object({
  item: {
    id: Joi.string()
      .custom(isValidObjId, "Mongodb objectId validation")
      .required(),
    quantity: Joi.number().min(0).required(),
  },
}).required();

const userSchema = Joi.object({
  user: {
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .required(),
  },
}).required();

const loginSchema = Joi.object({
  user: {
    email: Joi.string().email().required(),

    password: Joi.string().min(5).required(),
    cart: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      )
      .required(),
  },
}).required();

const cartSchema = Joi.object({
  cartItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .min(1)
    .required(),
});

const validator = (schema) => {
  return async (req, res, next) => {
    await schema.validateAsync(req.body);
    next();
  };
};
const queryValidator = (schema) => {
  return async (req, res, next) => {
    await schema.validateAsync(req.query);
    next();
  };
};

module.exports = {
  validator,
  queryValidator,
  cartSchema,
  cartItemSchema,
  loginSchema,
  userSchema,
  storeQueriesSchema,
};
