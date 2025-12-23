/**
 * Database seeding script
 * Run with: node scripts/seed.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const products = [
  {
    name: "Radiant Dew Hydrating Mist",
    price: 28,
    category: "Skincare",
    skin_type: "Dry",
    image: "https://images.unsplash.com/photo-1612810806546-1ce834a6f7d6?auto=format&fit=crop&w=600&q=80",
    description: "Aloe + rosewater spritz that calms and hydrates dry skin.",
    stock: 50
  },
  {
    name: "Velvet Glow Soft Matte Foundation",
    price: 34,
    category: "Makeup",
    skin_type: "Oily",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    description: "Oil-control pigments keep shine away for 12h.",
    stock: 30
  },
  {
    name: "Bloom Serum Vitamin C",
    price: 42,
    category: "Skincare",
    skin_type: "Combination",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    description: "Brightens dull spots while staying gentle.",
    stock: 25
  },
  {
    name: "Fluffy Cloud Cream Cleanser",
    price: 24,
    category: "Skincare",
    skin_type: "Sensitive",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    description: "PH-balanced cleanser with oat milk foam.",
    stock: 40
  },
  {
    name: "Petal Kiss Lip Tint Trio",
    price: 19,
    category: "Makeup",
    skin_type: "All",
    image: "https://images.unsplash.com/photo-1522335789209-be64301f7344?auto=format&fit=crop&w=600&q=80",
    description: "Buildable lip color set in rose, nude, berry.",
    stock: 60
  },
  {
    name: "Calm Barrier Ceramide Moisturizer",
    price: 36,
    category: "Skincare",
    skin_type: "Sensitive",
    image: "https://images.unsplash.com/photo-1522337094841-45867d528bc0?auto=format&fit=crop&w=600&q=80",
    description: "Strengthens barrier with ceramides + centella.",
    stock: 35
  },
  {
    name: "Airbrush Veil Setting Powder",
    price: 27,
    category: "Makeup",
    skin_type: "Oily",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    description: "Featherlight translucent powder for poreless finish.",
    stock: 45
  },
  {
    name: "GlowGuard SPF 50 Serum",
    price: 31,
    category: "Skincare",
    skin_type: "Combination",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    description: "Hybrid sunscreen with niacinamide boosts radiance.",
    stock: 55
  },
  {
    name: "Dreamy Nights Retinol Sleeping Oil",
    price: 45,
    category: "Skincare",
    skin_type: "Normal",
    image: "https://images.unsplash.com/photo-1522335789209-be64301f7344?auto=format&fit=crop&w=600&q=80",
    description: "Light retinol oil to refine texture overnight.",
    stock: 20
  }
];

const blogPosts = [
  {
    title: "Layering Skincare 101",
    category: "Skincare Guides",
    read_time: "5 min read",
    image: "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=600&q=80",
    summary: "Learn the correct order to apply toner, serums, and creams.",
    content: "Full article content here...",
    published: true
  },
  {
    title: "Choosing Foundation for Humid Weather",
    category: "Makeup Tips",
    read_time: "4 min read",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    summary: "Mattifying vs glow finishes and how to keep base transfer-proof.",
    content: "Full article content here...",
    published: true
  },
  {
    title: "Barrier Repair Routine",
    category: "Derm Diaries",
    read_time: "6 min read",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    summary: "Sensitive skin safe ingredients that stop redness fast.",
    content: "Full article content here...",
    published: true
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed products
    console.log('📦 Seeding products...');
    const { data: insertedProducts, error: productsError } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (productsError) {
      console.error('❌ Error seeding products:', productsError);
    } else {
      console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
    }

    // Seed blog posts
    console.log('📝 Seeding blog posts...');
    const { data: insertedBlogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .insert(blogPosts)
      .select();

    if (blogError) {
      console.error('❌ Error seeding blog posts:', blogError);
    } else {
      console.log(`✅ Successfully seeded ${insertedBlogPosts.length} blog posts`);
    }

    console.log('🎉 Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

seed();

