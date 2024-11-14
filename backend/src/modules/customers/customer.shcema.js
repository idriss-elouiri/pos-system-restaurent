import { z } from "zod";

export const registerCustomerShcema = z.object({
  nameCustomer: z.string({ required_error: "name is required" }),
  emailCustomer: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email" }),
  passwordCustomer: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password should be at least 6" }),
    phoneNumberCustomer: z.string({ required_error: "number is required" }),
    isCustomer: z.boolean({ required_error: "isCustomer is required" }),

});

export const loginCustomerShcema = z.object({
  emailCustomer: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email" }),
    passwordCustomer: z
    .string({ required_error: "password is required" })
    .min(6, { message: "password should be at least 6" }),
});