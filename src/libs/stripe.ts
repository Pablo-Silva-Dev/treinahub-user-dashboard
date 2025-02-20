import Stripe from "stripe";

const VITE_STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY
const VITE_API_BASEURL = import.meta.env.VITE_API_BASEURL

console.log("stripeKey", VITE_STRIPE_SECRET_KEY)
console.log("VITE_API_BASEURL", VITE_API_BASEURL)

const stripe = new Stripe(VITE_STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export default stripe;
