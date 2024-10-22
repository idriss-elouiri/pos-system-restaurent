import { formatZodError } from "../utils/helpers.js";

export const validateZod = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    res.json({ errors: formatZodError(error) });
    return next();
  }
};