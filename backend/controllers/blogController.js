import { supabase } from '../config/database.js';

/**
 * Get all blog posts (published only for non-authenticated users)
 */
export const getBlogPosts = async (req, res) => {
  try {
    const { published, category } = req.query;
    const userId = req.user?.id;

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // If user is not authenticated, only show published posts
    if (!userId) {
      query = query.eq('published', true);
    } else if (published !== undefined) {
      query = query.eq('published', published === 'true');
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: data?.length || 0,
      posts: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error.message
    });
  }
};

/**
 * Get single blog post by ID
 */
export const getBlogPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    // If user is not authenticated, only show published posts
    if (!userId) {
      query = query.eq('published', true);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      post: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post',
      error: error.message
    });
  }
};

/**
 * Create new blog post
 */
export const createBlogPost = async (req, res) => {
  try {
    const { title, category, readTime, image, summary, content, published } = req.body;

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          title,
          category,
          read_time: readTime,
          image,
          summary,
          content,
          published: published || false
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
};

/**
 * Update blog post
 */
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, readTime, image, summary, content, published } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (readTime !== undefined) updateData.read_time = readTime;
    if (image !== undefined) updateData.image = image;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      post: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
};

/**
 * Delete blog post
 */
export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
};

