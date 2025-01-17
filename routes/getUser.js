const express = require("express");
const router = express.Router();
const authSchema = require("../models/Auth");
router.post("/getProfile", async (req, res) => {
  const { mobile } = req.body;
  try {
    const profile = await authSchema.find({ mobile });
    res.status(200).json({
      message: "User profile fetched successfully",
      data: profile,
    });
  } catch (err) {
    console.error("Error in userProfile:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err.message });
  }
});
const pages = [
  {
    pagename: "term",
    Title: "Terms and Conditions",
    content: `Terms & Conditions
Welcome to Factory Se Ghar! By using our app, you agree to the following terms:

Services:

We deliver high-quality products directly from factories to your home at up to 50% discounted rates.
Delivery is guaranteed within 48 hours of placing your order.
Referral Program:

Users can earn money by referring products and our app to others.
Referral earnings will be credited to your account once the referred user completes their first purchase.
Payments:

All payments must be made online via secure payment methods available in the app.
No refunds are provided for used or damaged products unless proven defective upon delivery.
User Responsibilities:

Ensure accurate shipping information to avoid delivery delays.
Users are responsible for maintaining the confidentiality of their account credentials.
Liability:

Factory Se Ghar is not responsible for delays caused by natural disasters or external circumstances.
Changes to Terms:

We reserve the right to modify these terms at any time. Changes will be updated in the app, and continued usage constitutes agreement to the revised terms.
`,
  },
  {
    pagename: "policy",
    Title: "Privacy Policy",
    content: `Privacy & Policy
At Factory Se Ghar, your privacy is our top priority. Here’s how we protect and use your information:

Information Collection:

We collect your name, email, phone number, and address to process your orders and provide personalized services.
Use of Information:

Your data is used for order fulfillment, customer support, and app improvements.
We may send promotional offers, which you can opt-out of anytime.
Data Security:

All personal information is encrypted and stored securely.
Payment details are processed through secure third-party gateways and are never stored on our servers.
Sharing of Data:

We do not share your data with third parties without your consent, except for delivery and legal purposes.
User Rights:

You can request data deletion or updates by contacting our support team.
Policy Updates:

Our privacy policy may change over time. Any updates will be communicated via the app.
Thank you for choosing Factory Se Ghar! Shop, save, and earn with confidence.`,
  },
  {
    pagename: "about",
    Title: "About Page",
    content: `About Us
Welcome to Factory Se Ghar – Your one-stop solution for premium-quality products delivered directly from factories to your doorstep!

Save Big: Enjoy up to 50% off on all products.
Fast Delivery: Get your orders delivered within 48 hours.
Earn with Us: Join our referral program and start earning with every successful referral.
Our mission is to connect customers with top-quality products at factory prices while providing a seamless shopping experience. Shop smarter, save more, and earn with Factory Se Ghar!`,
  },
];
router.get("/pages", (req, res) => {
  const { pagename } = req.query;
  console.log(pagename);

  if (!pagename) {
    return res.status(400).json({ error: "Missing pagename parameter" });
  }

  const filteredPages = pages.filter(
    (page) => page.pagename.toLowerCase() === pagename.toLowerCase()
  );

  if (filteredPages.length > 0) {
    res.json(filteredPages);
  } else {
    res.status(404).json({ error: "No matching pages found" });
  }
});
router.get("/contact-us", (req, res) => {
  try {
    const response = {
      address: "this is a sample address",
      email: "factoryseghar@gmail.com",
      contactUs: "987654321",
    };
    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      err: err.message,
    });
  }
});
module.exports = router;
