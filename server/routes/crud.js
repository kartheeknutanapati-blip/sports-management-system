const express = require('express');

// Builds the 5 REST endpoints for any Mongoose model
module.exports = function crudRouter(Model, populate = '') {
  const router = express.Router();

  // READ all
  router.get('/', async (req, res, next) => {
    try { res.json(await Model.find().populate(populate).sort({ createdAt: -1 })); }
    catch (err) { next(err); }
  });

  // READ one
  router.get('/:id', async (req, res, next) => {
    try {
      const item = await Model.findById(req.params.id).populate(populate);
      if (!item) return res.status(404).json({ message: 'Not found' });
      res.json(item);
    } catch (err) { next(err); }
  });

  // CREATE
  router.post('/', async (req, res, next) => {
    try { res.status(201).json(await Model.create(req.body)); }
    catch (err) { next(err); }
  });

  // UPDATE
  router.put('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      doc.set(req.body);
      await doc.save();               // runs validation
      res.json(doc);
    } catch (err) { next(err); }
  });

  // DELETE
  router.delete('/:id', async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (err) { next(err); }
  });

  return router;
};
