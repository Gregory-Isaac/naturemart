import { getImageUrl, getImageFallback, handleImageFallback } from '../imageUrl';

jest.mock('../../images/aloe_vera_gel.png', () => 'aloe-stub', { virtual: true });
jest.mock('../../images/bamboo_toothbrush.png', () => 'bamboo-stub', { virtual: true });
jest.mock('../../images/lavender_oil.png', () => 'lavender-stub', { virtual: true });

describe('getImageUrl', () => {
  it('returns fallback for falsy input', () => {
    expect(getImageUrl(null)).toBe('/images/bottle.png');
    expect(getImageUrl(undefined)).toBe('/images/bottle.png');
    expect(getImageUrl('')).toBe('/images/bottle.png');
  });

  it('returns absolute HTTP URLs unchanged', () => {
    const url = 'https://example.com/photo.jpg';
    expect(getImageUrl(url)).toBe(url);
  });

  it('returns absolute paths starting with / unchanged', () => {
    expect(getImageUrl('/images/matcha.png')).toBe('/images/matcha.png');
  });

  it('prepends API origin for relative paths', () => {
    expect(getImageUrl('static/Images/product.png')).toBe(
      'http://127.0.0.1:5001/static/Images/product.png'
    );
  });

  it('normalises backslashes in relative paths', () => {
    expect(getImageUrl('static\\Images\\product.png')).toBe(
      'http://127.0.0.1:5001/static/Images/product.png'
    );
  });
});

describe('getImageFallback', () => {
  it('returns a string for a valid product', () => {
    const product = { id: 1, name: 'Aloe', category: 'Skincare', image: 'img.png' };
    const result = getImageFallback(product);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('is deterministic for the same product', () => {
    const product = { id: 5, name: 'Matcha', category: 'Wellness' };
    expect(getImageFallback(product, 0)).toBe(getImageFallback(product, 0));
  });

  it('handles missing product gracefully', () => {
    expect(typeof getImageFallback(null)).toBe('string');
    expect(typeof getImageFallback(undefined)).toBe('string');
  });
});

describe('handleImageFallback', () => {
  it('returns a function', () => {
    const handler = handleImageFallback({ id: 1, name: 'Test' });
    expect(typeof handler).toBe('function');
  });

  it('sets src and marks fallback on first call', () => {
    const handler = handleImageFallback({ id: 1, name: 'Test' });
    const event = { currentTarget: { dataset: {}, src: '' } };
    handler(event);
    expect(event.currentTarget.dataset.fallbackApplied).toBe('true');
    expect(event.currentTarget.src).toBeTruthy();
  });

  it('does not overwrite on second call', () => {
    const handler = handleImageFallback({ id: 1, name: 'Test' });
    const event = { currentTarget: { dataset: { fallbackApplied: 'true' }, src: 'already-set' } };
    handler(event);
    expect(event.currentTarget.src).toBe('already-set');
  });
});
