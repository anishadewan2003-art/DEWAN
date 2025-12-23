import { supabase, supabaseAdmin } from '../config/database.js';

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GC-${timestamp}-${random}`;
};

/**
 * Get all orders (for authenticated users - their own orders)
 */
export const getOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    // If user is authenticated, filter by user_id
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: data?.length || 0,
      orders: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

/**
 * Get single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    // Check if user is authorized to view this order
    if (userId && data.user_id && data.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    res.json({
      success: true,
      order: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

/**
 * Create new order
 */
export const createOrder = async (req, res) => {
  try {
    const {
      fullName,
      email,
      address,
      city,
      state,
      zip,
      paymentMethod,
      items
    } = req.body;

    const userId = req.user?.id || null;
    const orderNumber = generateOrderNumber();

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * parseInt(item.quantity));
    }, 0);
    
    const shipping = subtotal > 0 ? 6.5 : 0;
    const total = subtotal + shipping;

    // Create order using admin client to bypass RLS if needed
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: userId,
          order_number: orderNumber,
          full_name: fullName,
          email,
          address,
          city,
          state,
          zip,
          payment_method: paymentMethod,
          subtotal,
          shipping,
          total,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName || item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity),
      subtotal: parseFloat(item.price) * parseInt(item.quantity)
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items fail
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      throw itemsError;
    }

    // Fetch complete order with items
    const { data: completeOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', order.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: completeOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

