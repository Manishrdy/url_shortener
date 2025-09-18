// controllers/redirectController.js
const asyncHandler = require('express-async-handler');
const Url = require('../models/Url');

// Public redirect handler
const redirectByShortId = asyncHandler(async (req, res) => {
  const key = req.params.key; // could be shortId or customAlias

  // Try customAlias first (so custom aliases take precedence)
  let urlDoc = await Url.findOne({ customAlias: key });

  // If no customAlias match, try shortId
  if (!urlDoc) {
    urlDoc = await Url.findOne({ shortId: key });
  }

  if (!urlDoc) {
    // Not found — return 404 JSON or a simple HTML page
    res.status(404).json({ message: 'Short URL not found' });
    return;
  }

  // Make sure originalUrl looks ok (should already be normalized on creation)
  const destination = urlDoc.originalUrl;
  // 302 Found (temporary). Use 301 if you want permanent redirect.
  res.redirect(302, destination);
});

module.exports = { redirectByShortId };
