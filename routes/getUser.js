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
    content: `TERMS AND CONDITIONS

1. Introduction
Welcome to Factory Se Ghar ("Factory Se Ghar," "we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website, mobile applications, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms, which constitute a legal agreement between you and Factory Se Ghar. If you do not agree to these Terms, please refrain from using our Services.

2. Account Registration
2.1 Eligibility: You must be at least 18 years old and a resident of [Country Name] to register for an account with Factory Se Ghar and use our Services.
2.2 Account Information: You agree to provide accurate, current, and complete information during the registration process and to keep your account information updated.
2.3 Security: You are responsible for safeguarding your account credentials and for all activities that occur under your account. Notify us immediately if you suspect any unauthorized use of your account.

3. Order Processing and Fulfillment
3.1 Order Placement: When placing an order, you agree to provide accurate shipping and contact information.
3.2 Order Confirmation: Orders are confirmed only upon receipt of full payment and verification of details.
3.3 Order Cancellation: Once an order is placed, cancellations may not be allowed, except as per our cancellation policy.

4. Pricing and Payments
4.1 Pricing: Prices of products listed on our platform are subject to change without prior notice. Any changes will not affect orders that have already been placed and confirmed.
4.2 Payment Methods: Payments must be made through our accepted payment methods as displayed at checkout.
4.3 Transaction Security: We take reasonable precautions to secure payment transactions, but we are not liable for any unauthorized transactions or security breaches beyond our control.

5. Shipping and Delivery
5.1 Shipping Policy: Delivery times may vary based on location and availability of products. Estimated delivery dates will be provided at checkout.
5.2 Delays and Issues: Factory Se Ghar is not responsible for delays caused by third-party logistics providers, weather conditions, or other unforeseen circumstances.
5.3 Address Accuracy: You are responsible for providing an accurate delivery address. We are not responsible for failed deliveries due to incorrect information.

6. Returns and Refunds
6.1 Return Policy: Returns will be accepted only if the product is defective or not as described. Customers must initiate a return request within [X] days of receiving the product.
6.2 Refund Process: Refunds, if applicable, will be processed within [X] business days after verification of the returned item.
6.3 Non-Refundable Items: Certain items, such as customized or perishable goods, may not be eligible for returns or refunds.

7. User Conduct
7.1 Prohibited Activities: You agree not to use the Services for any illegal or unauthorized purpose. You also agree not to engage in activities that interfere with or disrupt the Services.
7.2 Responsibility for Content: You are solely responsible for any content you upload, post, or otherwise make available through the Services. Factory Se Ghar does not endorse any user content and is not responsible for its accuracy or legality.

8. Intellectual Property
8.1 Ownership: Factory Se Ghar retains all rights, title, and interest in and to the Services, including all intellectual property rights.
8.2 Limited License: Factory Se Ghar grants you a limited, non-exclusive, non-transferable license to access and use the Services in accordance with these Terms.

9. Limitation of Liability
9.1 Limitation: To the fullest extent permitted by law, Factory Se Ghar shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Services.
9.2 Maximum Liability: Factory Se Ghar’s total liability to you for any claim arising out of or in connection with these Terms shall not exceed the amount paid by you to Factory Se Ghar in the 12 months preceding the event giving rise to the claim.

10. Indemnification
You agree to indemnify, defend, and hold harmless Factory Se Ghar, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your use of the Services or your violation of these Terms.

11. Termination
11.1 Termination by You: You may terminate your account at any time by contacting Factory Se Ghar support.
11.2 Termination by Factory Se Ghar: Factory Se Ghar may suspend or terminate your access to the Services at any time, without notice, if we believe you have violated these Terms or any applicable laws.

12. Governing Law
These Terms are governed by and construed in accordance with the laws of [Country Name]. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of [Country Name].

13. Amendments
Factory Se Ghar reserves the right to modify these Terms at any time. We will notify you of any significant changes by posting the new Terms on our website and, if necessary, by sending you an email notification.

14. Contact Information
If you have any questions about these Terms, please contact us at:

Email: support@factoryseghar.comAddress: Factory Se Ghar, [Building No./Flat No.: HOUSE NO 258
Road/Street: SEC 13
Nearby Landmark: NEAR POLICE STATION
Locality/Sub Locality: PRASHANT VIHAR ROHINI
City/Town/Village: New Delhi

District: North West Delhi

State: Delhi

PIN Code: 110085

Period of Validity Type of Registration Particulars of Approving Signature
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
