// backend/routes/categoryRouter.js

import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Category from '../models/categoryModel.js';
import { isAdmin, isAuth } from '../utils.js';

const categoryRouter = express.Router();

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.send(categories);
  })
);

categoryRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = new Category({
      name: req.body.name,
    });
    const createdCategory = await category.save();
    res.send({ message: 'Category Created', category: createdCategory });
  })
);

export default categoryRouter;
