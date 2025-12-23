import { supabase } from '../config/database.js';

/**
 * Get all products with optional filtering
 */
export const getProducts = async (req, res) => {
  try {
    const { category, skinType, search, sort } = req.query;
    
    let query = supabase
      .from('products')
      .select('*');

    // Apply filters
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (skinType && skinType !== 'All') {
      query = query.eq('skin_type', skinType);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    // Apply sorting
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Transform snake_case to camelCase for frontend compatibility
    const products = data.map(product => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      category: product.category,
      skinType: product.skin_type,
      image: product.image,
      description: product.description,
      stock: product.stock,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }

    // Transform to camelCase
    const product = {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price),
      category: data.category,
      skinType: data.skin_type,
      image: data.image,
      description: data.description,
      stock: data.stock,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * Create new product
 */
export const createProduct = async (req, res) => {
  try {
    const { name, price, category, skinType, image, description, stock } = req.body;

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          category,
          skin_type: skinType,
          image,
          description,
          stock: stock || 0
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform to camelCase
    const product = {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price),
      category: data.category,
      skinType: data.skin_type,
      image: data.image,
      description: data.description,
      stock: data.stock,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * Update product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, skinType, image, description, stock } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (skinType !== undefined) updateData.skin_type = skinType;
    if (image !== undefined) updateData.image = image;
    if (description !== undefined) updateData.description = description;
    if (stock !== undefined) updateData.stock = stock;

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }

    // Transform to camelCase
    const product = {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price),
      category: data.category,
      skinType: data.skin_type,
      image: data.image,
      description: data.description,
      stock: data.stock,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

