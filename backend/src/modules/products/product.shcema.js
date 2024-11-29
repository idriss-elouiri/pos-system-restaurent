import { z } from "zod";

export const productShcema = z.object({
  productName: z.string({ required_error: "name is required" }),
  productCode: z
    .string({ required_error: "productCode is required" }),
  productImage: z
    .string({ required_error: "productImage is required" }),
    productPrice: z.string({ required_error: "productPrice is required" }),
    productDescription: z.string({ required_error: "productDescription is required" }),
    productQty: z.string({ required_error: "productQty is required" }),

});
