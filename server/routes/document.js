const express = require('express');
const Document = require('../models/document')
const documentRouter = express.Router();
const auth = require('../middleware/auth');

// document create route
documentRouter.post('/doc/create', auth, async(req, res) => {
    try {
        const { createdAt } = req.body;
        let document = new Document({
            uid: req.user,
            title: 'Untitled',
            createdAt,
        });

        document = await document.save();
        res.json(document);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// getting user document
documentRouter.get('/docs/me', auth, async (req, res) => {
    try {
        let document = await Document.find({uid: req.user});
        res.json(document);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// updating document title route
documentRouter.post("/doc/title", auth, async (req, res) => {
  try {
    const { id, title } = req.body;
    const document = await Document.findByIdAndUpdate(id, { title });

    res.json(document);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// we are passing the document id in the url of the route itself, because we dont have access to req.bodu over here
documentRouter.get("/doc/:id", auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = documentRouter;