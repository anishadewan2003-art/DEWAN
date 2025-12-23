import { supabase, supabaseAdmin } from '../config/database.js';

/**
 * Submit quiz results
 */
export const submitQuizResults = async (req, res) => {
  try {
    const { answers, recommendations } = req.body;
    const userId = req.user?.id || null;

    const { data, error } = await supabaseAdmin
      .from('quiz_results')
      .insert([
        {
          user_id: userId,
          answers,
          recommendations
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Quiz results saved successfully',
      quizResult: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to save quiz results',
      error: error.message
    });
  }
};

/**
 * Get quiz results for a specific user
 */
export const getUserQuizResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.user?.id;

    // Users can only access their own quiz results
    if (authenticatedUserId && userId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access these quiz results'
      });
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: data?.length || 0,
      quizResults: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results',
      error: error.message
    });
  }
};

/**
 * Get all quiz results (for authenticated user - their own)
 */
export const getQuizResults = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: data?.length || 0,
      quizResults: data || []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results',
      error: error.message
    });
  }
};

