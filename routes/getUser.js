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
    content:
      "LoremLorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies, odio at sollicitudin sollicitudin, sapien orci efficitur ipsum, at varius est enim ac dolor. Integer sodales, justo ac gravida tincidunt, magna neque accumsan nisl, et fermentum nulla urna ac velit. Vivamus dignissim, eros id dictum porttitor, neque velit porttitor erat, eget elementum urna ex ac justo. Donec suscipit, metus nec pulvinar pretium, sem quam porttitor risus, vel sagittis ligula dolor nec nisl. Mauris et purus eget arcu consectetur vehicula in vel arcu. Aliquam tincidunt risus nec libero tincidunt posuere. Donec nec sem eget neque aliquam sollicitudin non ut arcu. Sed eu tortor sapien. Phasellus varius nisl in sapien dapibus, at mollis magna fermentum. Nam interdum purus sed interdum vehicula.",
  },
  {
    pagename: "policy",
    Title: "Privacy Policy",
    content:
      "LoremLorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies, odio at sollicitudin sollicitudin, sapien orci efficitur ipsum, at varius est enim ac dolor. Integer sodales, justo ac gravida tincidunt, magna neque accumsan nisl, et fermentum nulla urna ac velit. Vivamus dignissim, eros id dictum porttitor, neque velit porttitor erat, eget elementum urna ex ac justo. Donec suscipit, metus nec pulvinar pretium, sem quam porttitor risus, vel sagittis ligula dolor nec nisl. Mauris et purus eget arcu consectetur vehicula in vel arcu. Aliquam tincidunt risus nec libero tincidunt posuere. Donec nec sem eget neque aliquam sollicitudin non ut arcu. Sed eu tortor sapien. Phasellus varius nisl in sapien dapibus, at mollis magna fermentum. Nam interdum purus sed interdum vehicula.",
  },
  {
    pagename: "about",
    Title: "About Page",
    content:
      "LoremLorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ultricies, odio at sollicitudin sollicitudin, sapien orci efficitur ipsum, at varius est enim ac dolor. Integer sodales, justo ac gravida tincidunt, magna neque accumsan nisl, et fermentum nulla urna ac velit. Vivamus dignissim, eros id dictum porttitor, neque velit porttitor erat, eget elementum urna ex ac justo. Donec suscipit, metus nec pulvinar pretium, sem quam porttitor risus, vel sagittis ligula dolor nec nisl. Mauris et purus eget arcu consectetur vehicula in vel arcu. Aliquam tincidunt risus nec libero tincidunt posuere. Donec nec sem eget neque aliquam sollicitudin non ut arcu. Sed eu tortor sapien. Phasellus varius nisl in sapien dapibus, at mollis magna fermentum. Nam interdum purus sed interdum vehicula.",
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
