// Central data store for GlowCart
const products = [
  {
    id: 1,
    name: "Radiant Dew Hydrating Mist",
    price: 28,
    category: "Skincare",
    skinType: "Dry",
    image:
      "https://images.unsplash.com/photo-1612810806546-1ce834a6f7d6?auto=format&fit=crop&w=600&q=80",
    description: "Aloe + rosewater spritz that calms and hydrates dry skin."
  },
  {
    id: 2,
    name: "Velvet Glow Soft Matte Foundation",
    price: 34,
    category: "Makeup",
    skinType: "Oily",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    description: "Oil-control pigments keep shine away for 12h."
  },
  {
    id: 3,
    name: "Bloom Serum Vitamin C",
    price: 42,
    category: "Skincare",
    skinType: "Combination",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    description: "Brightens dull spots while staying gentle."
  },
  {
    id: 4,
    name: "Fluffy Cloud Cream Cleanser",
    price: 24,
    category: "Skincare",
    skinType: "Sensitive",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    description: "PH-balanced cleanser with oat milk foam."
  },
  {
    id: 5,
    name: "Petal Kiss Lip Tint Trio",
    price: 19,
    category: "Makeup",
    skinType: "All",
    image:
      "https://images.unsplash.com/photo-1522335789209-be64301f7344?auto=format&fit=crop&w=600&q=80",
    description: "Buildable lip color set in rose, nude, berry."
  },
  {
    id: 6,
    name: "Calm Barrier Ceramide Moisturizer",
    price: 36,
    category: "Skincare",
    skinType: "Sensitive",
    image:
      "https://images.unsplash.com/photo-1522337094841-45867d528bc0?auto=format&fit=crop&w=600&q=80",
    description: "Strengthens barrier with ceramides + centella."
  },
  {
    id: 7,
    name: "Airbrush Veil Setting Powder",
    price: 27,
    category: "Makeup",
    skinType: "Oily",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    description: "Featherlight translucent powder for poreless finish."
  },
  {
    id: 8,
    name: "GlowGuard SPF 50 Serum",
    price: 31,
    category: "Skincare",
    skinType: "Combination",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
    description: "Hybrid sunscreen with niacinamide boosts radiance."
  },
  {
    id: 9,
    name: "Dreamy Nights Retinol Sleeping Oil",
    price: 45,
    category: "Skincare",
    skinType: "Normal",
    image:
      "https://images.unsplash.com/photo-1522335789209-be64301f7344?auto=format&fit=crop&w=600&q=80",
    description: "Light retinol oil to refine texture overnight."
  }
];

const blogPosts = [
  {
    title: "Layering Skincare 101",
    category: "Skincare Guides",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=600&q=80",
    summary: "Learn the correct order to apply toner, serums, and creams.",
    link: "#"
  },
  {
    title: "Choosing Foundation for Humid Weather",
    category: "Makeup Tips",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    summary: "Mattifying vs glow finishes and how to keep base transfer-proof.",
    link: "#"
  },
  {
    title: "Barrier Repair Routine",
    category: "Derm Diaries",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    summary: "Sensitive skin safe ingredients that stop redness fast.",
    link: "#"
  }
];

const quizQuestions = [
  {
    id: "skinGoal",
    question: "What is your #1 skin goal?",
    answers: [
      { value: "hydration", label: "Deep hydration" },
      { value: "oilControl", label: "Oil control" },
      { value: "brightening", label: "Brighter complexion" },
      { value: "calm", label: "Soothe sensitivity" }
    ]
  },
  {
    id: "skinType",
    question: "How would you describe your skin type?",
    answers: [
      { value: "Dry", label: "Dry / tight" },
      { value: "Oily", label: "Oily / shiny" },
      { value: "Combination", label: "Combination" },
      { value: "Sensitive", label: "Sensitive / reactive" }
    ]
  },
  {
    id: "routine",
    question: "How many steps do you prefer in your routine?",
    answers: [
      { value: "minimal", label: "Just essentials" },
      { value: "classic", label: "3-4 steps" },
      { value: "max", label: "As many as it takes!" }
    ]
  },
  {
    id: "makeupFinish",
    question: "Makeup base finish you love?",
    answers: [
      { value: "glowy", label: "Glowy & dewy" },
      { value: "matte", label: "Soft matte" },
      { value: "skinlike", label: "Skin-like natural" }
    ]
  },
  {
    id: "sensitivities",
    question: "Do you have ingredient sensitivities?",
    answers: [
      { value: "fragranceFree", label: "Prefer fragrance-free" },
      { value: "activesOk", label: "Actives are okay" },
      { value: "unsure", label: "Not sure" }
    ]
  }
];

