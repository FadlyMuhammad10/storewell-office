import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export const activateAccountSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    passwordConfirmation: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(3, "Password must be at least 3 characters long"),
});

export const checkoutSchema = z.object({
  email: z.email().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone_number: z.string().min(1),
  address: z.string().min(1),
  postal_code: z.string().min(1),
  cart_items: z.array(
    z.object({
      cart_id: z.number().positive(),
    }),
  ),
});

export const addCartSchema = z.object({
  product_id: z.number().positive(),
  quantity: z.number().positive(),
  product_variant_id: z.number().positive(),
});

export const createPaymentSchema = z.object({
  order_code: z.string().min(1),
});
