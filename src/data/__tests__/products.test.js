import { products } from '../products';

describe('products data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('every product has required fields', () => {
    products.forEach((p) => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('name');
      expect(p).toHaveProperty('price');
      expect(p).toHaveProperty('category');
      expect(p).toHaveProperty('description');
    });
  });

  it('all IDs are unique', () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all prices are positive numbers', () => {
    products.forEach((p) => {
      expect(typeof p.price).toBe('number');
      expect(p.price).toBeGreaterThan(0);
    });
  });

  it('categories are limited to known values', () => {
    const allowed = ['Skincare', 'Wellness', 'Lifestyle'];
    products.forEach((p) => {
      expect(allowed).toContain(p.category);
    });
  });

  it('contains products from each category', () => {
    const categories = new Set(products.map((p) => p.category));
    expect(categories.has('Skincare')).toBe(true);
    expect(categories.has('Wellness')).toBe(true);
    expect(categories.has('Lifestyle')).toBe(true);
  });
});
