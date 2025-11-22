import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(1, "Name is required"),
  lastName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
  confirmPassword: z
    .string()
    .min(3, "Password must be at least 3 characters long"),
});
export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const checkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  postalcode: z.string().min(1, "Destination postal code is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const addCartSchema = z.object({
  product_id: z.number().positive(),
  quantity: z.number().positive(),
  variant_value_ids: z.array(z.number()).optional(),
});
