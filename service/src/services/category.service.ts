// src/services/category.service.ts
// src/services/category.service.ts

// import Category from '../client/commercetoolsClient';
import apiRoot from '../client/commercetoolsClient';
import { Category } from '@commercetools/platform-sdk';

export const getAllCategories = async () => {
  const response = await apiRoot
    .categories()
    .get()
    .execute();

  return response.body.results;
};

export const getRootCategories = async () => {
  const categories = await getAllCategories();
  return categories.filter(category => !category.parent);
};


export const buildCategoryTree = (categories: Category[]) => {
  const categoryMap = new Map();
  categories.forEach(category => categoryMap.set(category.id, { ...category, children: [] }));

  const rootCategories: Category[] = [];

  categories.forEach(category => {
    if (category.parent) {
      const parentCategory = categoryMap.get(category.parent.id);
      if (parentCategory) {
        parentCategory.children.push(categoryMap.get(category.id));
      }
    } else {
      rootCategories.push(categoryMap.get(category.id));
    }
  });

  return rootCategories;
};
