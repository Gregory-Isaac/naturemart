import { useState, useEffect } from 'react';
import API from '../api/client';

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/get_products');
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      return data;
    } catch (error) {
      console.error('Error fetching products', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, fetchProducts };
}
