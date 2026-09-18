const DEFAULT_MEALS = [
  {
    "id": 1789733468050,
    "name": "Gyoza",
    "description": "pan-fried pork dumplings (5pieces)",
    "calories": 300,
    "protein_g": 10,
    "carbs_g": 30,
    "fat_g": 10,
    "low_fat": true,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [],
    "dietary_tags": []
  },
  {
    "id": 1789733359120,
    "name": "Katsudon",
    "description": "deep fried pork cutlet with egg rice bowl",
    "calories": 900,
    "protein_g": 35,
    "carbs_g": 110,
    "fat_g": 35,
    "low_fat": false,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [
      "egg"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789733191189,
    "name": "Gyudon",
    "description": "Beef with sweet soy sauce and onion with rice",
    "calories": 700,
    "protein_g": 26,
    "carbs_g": 90,
    "fat_g": 22,
    "low_fat": false,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "allergens": [
      "soy"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789733042574,
    "name": "Spring Rolls",
    "description": "Rice paper wrap with vegetables, shrimp and boiled pork (per roll)",
    "calories": 120,
    "protein_g": 6,
    "carbs_g": 10,
    "fat_g": 5,
    "low_fat": true,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "keywords": {
      "countries": [
        "Vietnamese"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [
      "shellfish"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789732595102,
    "name": "Deep-Fried Spring Rolls",
    "description": "crispy deep fried spring rolls filled with vegetables and minced pork with sauce (per roll)",
    "calories": 150,
    "protein_g": 2,
    "carbs_g": 15,
    "fat_g": 8,
    "low_fat": true,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    "keywords": {
      "countries": [
        "Vietnamese"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [],
    "dietary_tags": []
  },
  {
    "id": 1789732347971,
    "name": "Boat Noodles",
    "description": "Thai style noodles, rich broth contains pig blood",
    "calories": 450,
    "protein_g": 25,
    "carbs_g": 50,
    "fat_g": 14,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/6qWN9J5L/IMG-4148.webp",
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [],
    "dietary_tags": [
      "dairy-free"
    ]
  },
  {
    "id": 1789732240473,
    "name": "Kuay-Tiew",
    "description": "Thai style noodles soup",
    "calories": 350,
    "protein_g": 25,
    "carbs_g": 55,
    "fat_g": 10,
    "low_fat": true,
    "image_url": "https://i.postimg.cc/vT0wTqcV/IMG-4149.jpg",
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [],
    "dietary_tags": [
      "dairy-free"
    ]
  },
  {
    "id": 1789732071377,
    "name": "Goong Ob Woon Sen",
    "description": "Glass noodle with shrimp",
    "calories": 350,
    "protein_g": 18,
    "carbs_g": 55,
    "fat_g": 8,
    "low_fat": true,
    "image_url": "https://i.postimg.cc/Xqs6qHpr/IMG-4147.jpg",
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "allergens": [
      "shellfish"
    ],
    "dietary_tags": [
      "dairy-free"
    ]
  },
  {
    "id": 1789731957495,
    "name": "Khao Moo Daeng",
    "description": "Barbecued Pork with Sweet red sauce over rice and boiled egg",
    "calories": 650,
    "protein_g": 22,
    "carbs_g": 85,
    "fat_g": 15,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/4yfTJkNV/IMG-4145.jpg",
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [
      "egg"
    ],
    "dietary_tags": [
      "dairy-free"
    ]
  },
  {
    "id": 1789731867997,
    "name": "Khao Man Gai",
    "description": "Thai Hainanese Chicken Rice",
    "calories": 700,
    "protein_g": 26,
    "carbs_g": 75,
    "fat_g": 22,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/bryjzcNx/IMG-4144.jpg",
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "allergens": [],
    "dietary_tags": [
      "dairy-free"
    ]
  },
  {
    "id": 1789731689450,
    "name": "Tom Jued",
    "description": "clear broth with minced pork, tofu, and vegetables",
    "calories": 120,
    "protein_g": 14,
    "carbs_g": 6,
    "fat_g": 2,
    "low_fat": true,
    "image_url": "https://i.postimg.cc/yx1zV4Yh/IMG-4143.jpg",
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [
      "egg"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789717471156,
    "name": "Mixed Berry Chai Seed Pudding",
    "description": "chai seeds whisk with almond milk, fresh mixed fruits",
    "calories": 240,
    "protein_g": 6,
    "carbs_g": 29,
    "fat_g": 11,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/nhrbCXPj/IMG-4376.jpg",
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "nuts"
    ],
    "dietary_tags": [
      "halal",
      "gluten-free",
      "dairy-free",
      "kosher",
      "vegetarian"
    ]
  },
  {
    "id": 1789717271359,
    "name": "Peanut Butter Banana Oatmeal Pancakes",
    "description": "healthy pancake without white flour or refined sugar",
    "calories": 410,
    "protein_g": 16,
    "carbs_g": 48,
    "fat_g": 15,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/6pqJy8m7/IMG-4375.jpg",
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "nuts",
      "egg"
    ],
    "dietary_tags": [
      "vegetarian",
      "dairy-free",
      "kosher",
      "gluten-free",
      "halal"
    ]
  },
  {
    "id": 1789716966656,
    "name": "Greek Yogurt Parfait",
    "description": "greek yogurt with fresh fruits, almond, and honey",
    "calories": 240,
    "protein_g": 18,
    "carbs_g": 20,
    "fat_g": 7,
    "low_fat": true,
    "image_url": "https://i.postimg.cc/qvqVzN5z/IMG-4374.png",
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "nuts",
      "dairy"
    ],
    "dietary_tags": [
      "halal",
      "gluten-free",
      "dairy-free",
      "kosher",
      "vegetarian",
      "vegan"
    ]
  },
  {
    "id": 1789716830423,
    "name": "Avocado Toast with Egg",
    "description": "mashed avocado with poached egg on the toast",
    "calories": 300,
    "protein_g": 11,
    "carbs_g": 18,
    "fat_g": 18,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/Jz0VGs2h/IMG-4373.jpg",
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "egg"
    ],
    "dietary_tags": [
      "halal",
      "gluten-free",
      "kosher",
      "dairy-free",
      "vegetarian"
    ]
  },
  {
    "id": 1789716539458,
    "name": "Overnight Oats",
    "description": "oats with milk or yoghurt, chia seeds, and fruits.",
    "calories": 300,
    "protein_g": 11,
    "carbs_g": 49,
    "fat_g": 7,
    "low_fat": true,
    "image_url": "https://i.postimg.cc/3xN5dkc3/IMG-4372.jpg",
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "dairy"
    ],
    "dietary_tags": [
      "halal",
      "gluten-free",
      "dairy-free",
      "kosher",
      "vegetarian",
      "vegan"
    ]
  },
  {
    "id": 1789472940107,
    "name": "Pork&Poblano Enchiladas",
    "description": "with Pico de Gallo and crame",
    "calories": 800,
    "protein_g": 37,
    "carbs_g": 52,
    "fat_g": 47,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/kgwwSDKd/IMG-4124.jpg",
    "keywords": {
      "countries": [
        "Mexican"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [
      "soy",
      "dairy"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789472634113,
    "name": "Cheesy Beef Tostadas",
    "description": "with green pepper, tomatoes salsa, and hot sauce crema",
    "calories": 950,
    "protein_g": 42,
    "carbs_g": 52,
    "fat_g": 54,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/NjbbXLmc/IMG-4123.jpg",
    "keywords": {
      "countries": [
        "Mexican"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Beef"
      ]
    },
    "allergens": [
      "soy",
      "dairy"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789472443054,
    "name": "Masala-Spiced Chicken&Cucumber raita",
    "description": "with curry roasted cauliflower and carrots",
    "calories": 400,
    "protein_g": 37,
    "carbs_g": 26,
    "fat_g": 17,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/gcqhjQvp/IMG-4125.jpg",
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "allergens": [
      "dairy"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789472212331,
    "name": "Lentil Dal&Lamp Chops",
    "description": "with Spiced Butter Naan&Lemony Yoghurt Sauce",
    "calories": 1489,
    "protein_g": 89,
    "carbs_g": 114,
    "fat_g": 72,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/P5KKDNYn/IMG-4121.jpg",
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Pork"
      ]
    },
    "allergens": [
      "dairy"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789472067397,
    "name": "Indian-Style Butter Chicken&Rice",
    "description": "with dark Meat Chicken, rice and cheesy garlic naan",
    "calories": 960,
    "protein_g": 43,
    "carbs_g": 108,
    "fat_g": 36,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/Z5jjN0pk/IMG-4120.jpg",
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "allergens": [
      "dairy"
    ],
    "dietary_tags": []
  },
  {
    "id": 1789471874537,
    "name": "Sun-dried Tomato Spaghetti",
    "description": "with fresh herbs almonds and parmesan",
    "calories": 630,
    "protein_g": 19,
    "carbs_g": 86,
    "fat_g": 25,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/3x99GWpP/IMG-4119.jpg",
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Pasta"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "nuts",
      "dairy"
    ],
    "dietary_tags": [
      "vegetarian"
    ]
  },
  {
    "id": 1789471741780,
    "name": "Roasted Chickpea&Kale salad",
    "description": "with grape tomatoes and garlicky croutons",
    "calories": 980,
    "protein_g": 21,
    "carbs_g": 76,
    "fat_g": 65,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/Hk33Mj5F/IMG-4118.jpg",
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "soy",
      "egg",
      "dairy"
    ],
    "dietary_tags": [
      "vegetarian"
    ]
  },
  {
    "id": 1789471394294,
    "name": "Silky Sicilian Penne",
    "description": "tossed with zucchini mushrooms and tomatoes",
    "calories": 690,
    "protein_g": 20,
    "carbs_g": 85,
    "fat_g": 34,
    "low_fat": false,
    "image_url": "https://i.postimg.cc/BnNNFtDk/IMG-4117.jpg",
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Pasta"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "allergens": [
      "dairy"
    ],
    "dietary_tags": [
      "vegetarian"
    ]
  },
  {
    "id": 1,
    "name": "Pad Thai",
    "description": "Stir-fried rice noodles with egg, tofu, peanuts, lime and tamarind sauce.",
    "image_url": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&q=80",
    "calories": 486,
    "fat_g": 14,
    "protein_g": 22,
    "carbs_g": 65,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Egg",
        "Tofu"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "nuts",
      "egg",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 2,
    "name": "Tom Yum Goong",
    "description": "Spicy and sour Thai soup with shrimp, lemongrass, kaffir lime and chili.",
    "image_url": "https://i.postimg.cc/0ySVp0C4/istockphoto-888273922-1024x1024-(1).jpg",
    "calories": 220,
    "fat_g": 6,
    "protein_g": 24,
    "carbs_g": 12,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "shellfish"
    ],
    "low_fat": true
  },
  {
    "id": 3,
    "name": "Green Curry Chicken",
    "description": "Aromatic Thai green curry with chicken, eggplant and Thai basil in coconut milk.",
    "image_url": "https://i.postimg.cc/Ls6vrFpQ/gettyimages-1267610826-170667a.jpg",
    "calories": 420,
    "fat_g": 22,
    "protein_g": 28,
    "carbs_g": 28,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": false
  },
  {
    "id": 4,
    "name": "Som Tum (Papaya Salad)",
    "description": "Refreshing spicy green papaya salad with lime, chili, peanuts and fish sauce.",
    "image_url": "https://i.postimg.cc/mD13sb6S/gettyimages-845048460-170667a.jpg",
    "calories": 150,
    "fat_g": 4,
    "protein_g": 5,
    "carbs_g": 25,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "nuts",
      "shellfish"
    ],
    "low_fat": true
  },
  {
    "id": 5,
    "name": "Massaman Curry",
    "description": "Rich Thai-Muslim curry with beef, potato, peanuts and warm spices.",
    "image_url": "https://i.postimg.cc/hjmmY2fp/gettyimages-1502948890-170667a.jpg",
    "calories": 540,
    "fat_g": 30,
    "protein_g": 32,
    "carbs_g": 35,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "nuts"
    ],
    "low_fat": false
  },
  {
    "id": 6,
    "name": "Khao Soi",
    "description": "Northern Thai coconut curry noodle soup topped with crispy egg noodles.",
    "image_url": "https://i.postimg.cc/YSWj2hM4/gettyimages-2223515103-170667a.jpg",
    "calories": 520,
    "fat_g": 24,
    "protein_g": 26,
    "carbs_g": 52,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "gluten",
      "egg"
    ],
    "low_fat": false
  },
  {
    "id": 7,
    "name": "Pad Kra Pao Moo",
    "description": "Holy basil stir-fried minced pork served over hot jasmine rice with fried egg.",
    "image_url": "https://i.postimg.cc/Y9tkc9SP/gettyimages-1571122424-170667a.jpg",
    "calories": 560,
    "fat_g": 26,
    "protein_g": 34,
    "carbs_g": 48,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "egg",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 8,
    "name": "Panang Curry Pork",
    "description": "Thick, creamy red curry with tender pork slices and finely sliced kaffir lime leaves.",
    "image_url": "https://i.postimg.cc/nh7tC7jN/gettyimages-1319573579-170667a.jpg",
    "calories": 480,
    "fat_g": 28,
    "protein_g": 30,
    "carbs_g": 22,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free"
    ],
    "allergens": [
      "nuts"
    ],
    "low_fat": false
  },
  {
    "id": 9,
    "name": "Tom Kha Gai",
    "description": "Creamy coconut milk soup with chicken, galangal, lemongrass and mushrooms.",
    "image_url": "https://i.postimg.cc/0y7L8shx/gettyimages-496220769-170667a.jpg",
    "calories": 310,
    "fat_g": 18,
    "protein_g": 22,
    "carbs_g": 14,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": false
  },
  {
    "id": 10,
    "name": "Pad See Ew",
    "description": "Stir-fried wide flat rice noodles with Chinese broccoli, pork and sweet dark soy sauce.",
    "image_url": "https://i.postimg.cc/9fg3kBvS/gettyimages-2190521834-170667a.jpg",
    "calories": 510,
    "fat_g": 18,
    "protein_g": 28,
    "carbs_g": 62,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "gluten",
      "soy",
      "egg"
    ],
    "low_fat": false
  },
  {
    "id": 11,
    "name": "Thai Fried Rice (Khao Pad)",
    "description": "Jasmine fried rice with egg, spring onions, garlic and sliced chicken breast.",
    "image_url": "https://i.postimg.cc/RZPbCZXh/gettyimages-498162835-170667a.jpg",
    "calories": 470,
    "fat_g": 14,
    "protein_g": 25,
    "carbs_g": 62,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "egg",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 12,
    "name": "Mango Sticky Rice",
    "description": "Sweet coconut-infused glutinous rice served with ripe golden mango slices.",
    "image_url": "https://i.postimg.cc/76SVzHM7/gettyimages-1649233867-170667a.jpg",
    "calories": 390,
    "fat_g": 10,
    "protein_g": 4,
    "carbs_g": 72,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegetarian",
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "dairy"
    ],
    "low_fat": true
  },
  {
    "id": 13,
    "name": "Larb Gai (Minced Chicken Salad)",
    "description": "Zesty northeastern Thai salad with mint, shallots, toasted rice powder and lime.",
    "image_url": "https://i.postimg.cc/RVpcNJx5/gettyimages-1459886260-170667a.jpg",
    "calories": 240,
    "fat_g": 8,
    "protein_g": 32,
    "carbs_g": 10,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 14,
    "name": "Moo Ping (Grilled Pork Skewers)",
    "description": "Marinated garlic coriander coconut milk grilled pork skewers with sticky rice.",
    "image_url": "https://i.postimg.cc/FRhfPhXh/gettyimages-601183136-170667a.jpg",
    "calories": 360,
    "fat_g": 18,
    "protein_g": 24,
    "carbs_g": 24,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 15,
    "name": "Steamed Sea Bass with Lime Garlic",
    "description": "Whole sea bass steamed in a spicy sour broth of fresh lime juice, garlic and chilies.",
    "image_url": "https://i.postimg.cc/Vvpkc8ph/gettyimages-2288383946-170667a.jpg",
    "calories": 260,
    "fat_g": 6,
    "protein_g": 42,
    "carbs_g": 8,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "fish"
    ],
    "low_fat": true
  },
  {
    "id": 16,
    "name": "Tonkotsu Ramen",
    "description": "Rich pork bone broth ramen with chashu, soft egg, nori and fresh scallions.",
    "image_url": "https://i.postimg.cc/d02MdSzt/IMG-4141.jpg",
    "calories": 600,
    "fat_g": 26,
    "protein_g": 30,
    "carbs_g": 60,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [],
    "allergens": [
      "gluten",
      "egg",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 17,
    "name": "Salmon Sashimi Bowl",
    "description": "Fresh sliced Atlantic salmon over seasoned sushi rice with nori and sesame.",
    "image_url": "https://i.postimg.cc/gJw0tjBY/gettyimages-968952336-170667a.jpg",
    "calories": 410,
    "fat_g": 14,
    "protein_g": 32,
    "carbs_g": 38,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "soy",
      "fish",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 18,
    "name": "Chicken Teriyaki Don",
    "description": "Glazed grilled chicken breast with sweet mirin soy glaze served over steamed rice.",
    "image_url": "https://i.postimg.cc/GmJdXG31/gettyimages-1393536277-170667a.jpg",
    "calories": 450,
    "fat_g": 14,
    "protein_g": 35,
    "carbs_g": 45,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "soy",
      "gluten",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 19,
    "name": "Shrimp Tempura Udon",
    "description": "Crisp golden shrimp tempura over thick wheat udon noodles in rich dashi broth.",
    "image_url": "https://i.postimg.cc/vmrR9Sp8/IMG-4142.jpg",
    "calories": 480,
    "fat_g": 15,
    "protein_g": 22,
    "carbs_g": 64,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "gluten",
      "shellfish",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 20,
    "name": "Chicken Katsu Curry",
    "description": "Crispy panko-breaded fried chicken cutlet over rice with savory Japanese curry.",
    "image_url": "https://i.postimg.cc/hGYDmgPG/gettyimages-2222951429-170667a.jpg",
    "calories": 670,
    "fat_g": 26,
    "protein_g": 36,
    "carbs_g": 72,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "gluten",
      "egg",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 21,
    "name": "Unagi Kabayaki (Grilled Eel)",
    "description": "Tender grilled freshwater eel basted in rich caramelized soy tare over rice.",
    "image_url": "https://i.postimg.cc/BZT3S2D8/gettyimages-1338354017-170667a.jpg",
    "calories": 530,
    "fat_g": 20,
    "protein_g": 28,
    "carbs_g": 58,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "soy",
      "gluten",
      "fish"
    ],
    "low_fat": false
  },
  {
    "id": 22,
    "name": "Miso Salmon & Edamame",
    "description": "White miso marinated baked salmon fillet served with steamed edamame and brown rice.",
    "image_url": "https://i.postimg.cc/FHq8gKcj/gettyimages-2285032205-170667a.jpg",
    "calories": 420,
    "fat_g": 16,
    "protein_g": 36,
    "carbs_g": 32,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "soy",
      "fish"
    ],
    "low_fat": false
  },
  {
    "id": 23,
    "name": "Bibimbap",
    "description": "Korean sizzling rice bowl with seasoned vegetables, bulgogi beef, egg and gochujang.",
    "image_url": "https://i.postimg.cc/nchPymG3/gettyimages-2212194429-170667a.jpg",
    "calories": 490,
    "fat_g": 15,
    "protein_g": 24,
    "carbs_g": 60,
    "keywords": {
      "countries": [
        "Korean"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "egg",
      "soy",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 24,
    "name": "Korean BBQ Galbi",
    "description": "Sweet and savory soy-marinated beef short ribs grilled to smoky perfection.",
    "image_url": "https://i.postimg.cc/Y97XbLS4/gettyimages-689347570-170667a.jpg",
    "calories": 580,
    "fat_g": 32,
    "protein_g": 40,
    "carbs_g": 32,
    "keywords": {
      "countries": [
        "Korean"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "soy",
      "sesame",
      "gluten"
    ],
    "low_fat": false
  },
  {
    "id": 25,
    "name": "Kimchi Jjigae (Kimchi Stew)",
    "description": "Rich, spicy fermented kimchi stew with silken tofu, pork belly and scallions.",
    "image_url": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    "calories": 340,
    "fat_g": 16,
    "protein_g": 24,
    "carbs_g": 25,
    "keywords": {
      "countries": [
        "Korean"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork",
        "Tofu"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "soy",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 26,
    "name": "Korean Fried Chicken (Yangnyeom)",
    "description": "Ultra-crispy double-fried chicken tossed in sweet, tangy and spicy chili glaze.",
    "image_url": "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80",
    "calories": 620,
    "fat_g": 28,
    "protein_g": 38,
    "carbs_g": 54,
    "keywords": {
      "countries": [
        "Korean"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "gluten",
      "soy",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 27,
    "name": "Sundubu Jjigae (Soft Tofu Stew)",
    "description": "Hot and bubbling spicy soft tofu stew with shrimp, clams and egg.",
    "image_url": "https://i.postimg.cc/Dzk5w41w/gettyimages-1362797949-170667a.jpg",
    "calories": 280,
    "fat_g": 12,
    "protein_g": 22,
    "carbs_g": 18,
    "keywords": {
      "countries": [
        "Korean"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "soy",
      "shellfish",
      "egg",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 28,
    "name": "Kung Pao Chicken",
    "description": "Classic Szechuan stir-fry with diced chicken, crunchy peanuts, chili peppers and scallions.",
    "image_url": "https://i.postimg.cc/vBD1R3TK/gettyimages-175601232-170667a.jpg",
    "calories": 480,
    "fat_g": 22,
    "protein_g": 36,
    "carbs_g": 34,
    "keywords": {
      "countries": [
        "Chinese"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "nuts",
      "soy",
      "gluten"
    ],
    "low_fat": false
  },
  {
    "id": 29,
    "name": "Dim Sum Pork Shumai",
    "description": "Steamed open-topped dumplings filled with seasoned ground pork, shrimp and shiitake.",
    "image_url": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80",
    "calories": 320,
    "fat_g": 12,
    "protein_g": 20,
    "carbs_g": 30,
    "keywords": {
      "countries": [
        "Chinese"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Pork",
        "Seafood"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "gluten",
      "shellfish",
      "soy",
      "sesame"
    ],
    "low_fat": true
  },
  {
    "id": 30,
    "name": "Beef Chow Fun",
    "description": "Cantonese stir-fried wide flat rice noodles with tender flank steak, bean sprouts and scallions.",
    "image_url": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
    "calories": 540,
    "fat_g": 18,
    "protein_g": 32,
    "carbs_g": 62,
    "keywords": {
      "countries": [
        "Chinese"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "soy",
      "gluten"
    ],
    "low_fat": false
  },
  {
    "id": 31,
    "name": "Mapo Tofu",
    "description": "Silken tofu set in spicy and numbing chili bean paste with minced beef and Sichuan pepper.",
    "image_url": "https://i.postimg.cc/d02snPQk/IMG-4366.jpg",
    "calories": 380,
    "fat_g": 20,
    "protein_g": 24,
    "carbs_g": 26,
    "keywords": {
      "countries": [
        "Chinese"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "soy",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 32,
    "name": "Steamed Ginger Scallion Fish",
    "description": "Delicate white fish fillets steamed with fresh julienned ginger, scallions and hot sesame soy oil.",
    "image_url": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
    "calories": 250,
    "fat_g": 8,
    "protein_g": 36,
    "carbs_g": 6,
    "keywords": {
      "countries": [
        "Chinese"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "fish",
      "soy",
      "sesame"
    ],
    "low_fat": true
  },
  {
    "id": 33,
    "name": "Vietnamese Pho Bo (Beef Pho)",
    "description": "Fragrant 12-hour spiced beef bone broth with flat rice noodles, rare beef, herbs and lime.",
    "image_url": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    "calories": 420,
    "fat_g": 10,
    "protein_g": 30,
    "carbs_g": 52,
    "keywords": {
      "countries": [
        "Vietnamese"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 34,
    "name": "Vietnamese Banh Mi Pork",
    "description": "Crispy French baguette filled with seasoned roast pork, pickled daikon, pate, cucumber and cilantro.",
    "image_url": "https://i.postimg.cc/9Q05rDn2/IMG-4370.jpg",
    "calories": 490,
    "fat_g": 18,
    "protein_g": 26,
    "carbs_g": 56,
    "keywords": {
      "countries": [
        "Vietnamese"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "gluten",
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 35,
    "name": "Fresh Spring Rolls (Goi Cuon)",
    "description": "Translucent rice paper rolls filled with poached shrimp, fresh mint, lettuce and vermicelli.",
    "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    "calories": 210,
    "fat_g": 3,
    "protein_g": 16,
    "carbs_g": 30,
    "keywords": {
      "countries": [
        "Vietnamese"
      ],
      "cooking_methods": [
        "Steam"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "shellfish",
      "nuts"
    ],
    "low_fat": true
  },
  {
    "id": 36,
    "name": "Bun Cha Hanoi (Grilled Pork)",
    "description": "Caramelized grilled pork patties in tangy dipping broth served with rice vermicelli and greens.",
    "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    "calories": 460,
    "fat_g": 16,
    "protein_g": 28,
    "carbs_g": 50,
    "keywords": {
      "countries": [
        "Vietnamese"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Noodles"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free"
    ],
    "allergens": [],
    "low_fat": false
  },
  {
    "id": 37,
    "name": "Butter Chicken (Murgh Makhani)",
    "description": "Tender tandoori chicken simmered in a velvety spiced tomato, butter and cream gravy.",
    "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80",
    "calories": 540,
    "fat_g": 28,
    "protein_g": 36,
    "carbs_g": 34,
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "halal"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "low_fat": false
  },
  {
    "id": 38,
    "name": "Chicken Tikka Masala",
    "description": "Roasted marinated chicken pieces cooked in a creamy spiced curry with garlic naan.",
    "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80",
    "calories": 510,
    "fat_g": 22,
    "protein_g": 38,
    "carbs_g": 40,
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "low_fat": false
  },
  {
    "id": 39,
    "name": "Palak Paneer",
    "description": "Cottage cheese cubes bathed in smooth puréed spiced spinach gravy with cumin seeds.",
    "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "calories": 380,
    "fat_g": 24,
    "protein_g": 18,
    "carbs_g": 22,
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegetarian",
      "gluten-free",
      "halal",
      "kosher"
    ],
    "allergens": [
      "dairy"
    ],
    "low_fat": false
  },
  {
    "id": 40,
    "name": "Lamb Biryani",
    "description": "Fragrant basmati rice layered with slow-cooked spiced lamb shank, saffron and fried onions.",
    "image_url": "https://i.postimg.cc/c4Z8yS5b/IMG-4379.jpg",
    "calories": 640,
    "fat_g": 26,
    "protein_g": 38,
    "carbs_g": 62,
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "halal"
    ],
    "allergens": [
      "dairy",
      "nuts"
    ],
    "low_fat": false
  },
  {
    "id": 41,
    "name": "Chana Masala (Chickpea Curry)",
    "description": "Hearty chickpeas simmered in zesty tomato-onion masala infused with ginger and cilantro.",
    "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    "calories": 320,
    "fat_g": 8,
    "protein_g": 15,
    "carbs_g": 48,
    "keywords": {
      "countries": [
        "Indian"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "halal",
      "kosher",
      "dairy-free"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 42,
    "name": "Chicken Tacos Al Pastor",
    "description": "Warm corn tortillas with citrus-marinated grilled chicken, roasted pineapple, salsa and cilantro.",
    "image_url": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
    "calories": 380,
    "fat_g": 14,
    "protein_g": 26,
    "carbs_g": 38,
    "keywords": {
      "countries": [
        "Mexican"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 43,
    "name": "Beef Barbacoa Burrito Bowl",
    "description": "Slow-braised shredded Mexican beef with cilantro-lime rice, black beans, pico de gallo and guacamole.",
    "image_url": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=800&q=80",
    "calories": 520,
    "fat_g": 20,
    "protein_g": 38,
    "carbs_g": 48,
    "keywords": {
      "countries": [
        "Mexican"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": false
  },
  {
    "id": 44,
    "name": "Fish Tacos Baja Style",
    "description": "Crisp battered fish inside soft tortillas with shredded cabbage slaw and chipotle crema.",
    "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80",
    "calories": 420,
    "fat_g": 16,
    "protein_g": 24,
    "carbs_g": 44,
    "keywords": {
      "countries": [
        "Mexican"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "gluten",
      "fish",
      "dairy"
    ],
    "low_fat": true
  },
  {
    "id": 45,
    "name": "Chicken Fajitas",
    "description": "Sizzling seasoned chicken strips with charred bell peppers, onions, salsa and warm tortillas.",
    "image_url": "https://i.postimg.cc/tC5n9MLt/IMG-4378.jpg",
    "calories": 430,
    "fat_g": 14,
    "protein_g": 35,
    "carbs_g": 40,
    "keywords": {
      "countries": [
        "Mexican"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "gluten"
    ],
    "low_fat": false
  },
  {
    "id": 46,
    "name": "Classic Spaghetti Carbonara",
    "description": "Al dente spaghetti tossed with crispy guanciale, pecorino romano cheese and rich egg yolks.",
    "image_url": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
    "calories": 580,
    "fat_g": 24,
    "protein_g": 26,
    "carbs_g": 64,
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Pasta"
      ],
      "protein": [
        "Pork",
        "Egg"
      ]
    },
    "dietary_tags": [],
    "allergens": [
      "gluten",
      "dairy",
      "egg"
    ],
    "low_fat": false
  },
  {
    "id": 47,
    "name": "Margherita Wood-Fired Pizza",
    "description": "Neapolitan crust topped with sweet San Marzano tomato sauce, fresh buffalo mozzarella and basil.",
    "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    "calories": 620,
    "fat_g": 22,
    "protein_g": 24,
    "carbs_g": 80,
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegetarian",
      "kosher"
    ],
    "allergens": [
      "gluten",
      "dairy"
    ],
    "low_fat": false
  },
  {
    "id": 48,
    "name": "Penne all'Arrabbiata",
    "description": "Penne pasta in fiery spicy garlic and red chili tomato sauce with fresh Italian parsley.",
    "image_url": "https://i.postimg.cc/fbXwR3V0/IMG-4380.jpg",
    "calories": 380,
    "fat_g": 8,
    "protein_g": 12,
    "carbs_g": 66,
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Pasta"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "halal",
      "kosher"
    ],
    "allergens": [
      "gluten"
    ],
    "low_fat": true
  },
  {
    "id": 49,
    "name": "Creamy Mushroom Risotto",
    "description": "Slow-stirred arborio rice with porcini mushrooms, white wine, parmesan and fresh thyme.",
    "image_url": "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&q=80",
    "calories": 440,
    "fat_g": 16,
    "protein_g": 12,
    "carbs_g": 62,
    "keywords": {
      "countries": [
        "Italian"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegetarian",
      "gluten-free",
      "kosher"
    ],
    "allergens": [
      "dairy"
    ],
    "low_fat": false
  },
  {
    "id": 50,
    "name": "Grilled Salmon & Quinoa",
    "description": "Pan-seared Atlantic salmon fillet served over lemon herb quinoa with roasted asparagus.",
    "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80",
    "calories": 430,
    "fat_g": 16,
    "protein_g": 38,
    "carbs_g": 32,
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "fish"
    ],
    "low_fat": true
  },
  {
    "id": 51,
    "name": "Classic Cheeseburger",
    "description": "Grilled prime beef patty with cheddar cheese, crisp lettuce, tomato and pickles in brioche bun.",
    "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    "calories": 650,
    "fat_g": 34,
    "protein_g": 36,
    "carbs_g": 48,
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [],
    "allergens": [
      "gluten",
      "dairy",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 52,
    "name": "Grilled Lemon Herb Chicken Breast",
    "description": "Lean grilled chicken breast with garlic herb marinade served with steamed broccoli.",
    "image_url": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&q=80",
    "calories": 310,
    "fat_g": 7,
    "protein_g": 45,
    "carbs_g": 8,
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 53,
    "name": "BBQ Pulled Pork Sandwich",
    "description": "Slow-smoked tender pulled pork with smoky barbecue sauce and coleslaw in a toasted bun.",
    "image_url": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80",
    "calories": 590,
    "fat_g": 24,
    "protein_g": 38,
    "carbs_g": 52,
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Smoke"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [
      "gluten"
    ],
    "low_fat": false
  },
  {
    "id": 54,
    "name": "Caesar Salad with Grilled Chicken",
    "description": "Crisp romaine hearts, shaved parmesan, garlic croutons and grilled chicken breast.",
    "image_url": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
    "calories": 390,
    "fat_g": 18,
    "protein_g": 36,
    "carbs_g": 18,
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "dairy",
      "gluten",
      "fish",
      "egg"
    ],
    "low_fat": true
  },
  {
    "id": 55,
    "name": "Beef Bourguignon",
    "description": "Classic French beef stew braised in red wine with pearl onions, carrots and button mushrooms.",
    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    "calories": 530,
    "fat_g": 22,
    "protein_g": 42,
    "carbs_g": 32,
    "keywords": {
      "countries": [
        "French"
      ],
      "cooking_methods": [
        "Stew"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "dairy-free"
    ],
    "allergens": [],
    "low_fat": false
  },
  {
    "id": 56,
    "name": "Ratatouille",
    "description": "Provençal layered vegetable dish with zucchini, eggplant, bell peppers and aromatic herbes de Provence.",
    "image_url": "https://i.postimg.cc/RZh5NWDS/IMG-4371.jpg",
    "calories": 180,
    "fat_g": 8,
    "protein_g": 4,
    "carbs_g": 24,
    "keywords": {
      "countries": [
        "French"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free",
      "halal",
      "kosher"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 57,
    "name": "French Onion Soup",
    "description": "Caramelized onion soup in rich beef broth topped with toasted baguette and melted Gruyère cheese.",
    "image_url": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
    "calories": 360,
    "fat_g": 16,
    "protein_g": 14,
    "carbs_g": 38,
    "keywords": {
      "countries": [
        "French"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [],
    "allergens": [
      "dairy",
      "gluten"
    ],
    "low_fat": true
  },
  {
    "id": 58,
    "name": "Spanish Seafood Paella",
    "description": "Saffron-scented Spanish bomba rice cooked in a wide pan with shrimp, mussels, calamari and peppers.",
    "image_url": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=800&q=80",
    "calories": 510,
    "fat_g": 14,
    "protein_g": 32,
    "carbs_g": 62,
    "keywords": {
      "countries": [
        "Spanish"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "shellfish",
      "fish"
    ],
    "low_fat": true
  },
  {
    "id": 59,
    "name": "Gambas al Ajillo (Garlic Shrimp)",
    "description": "Juicy shrimp sizzling in olive oil infused with lots of garlic, smoked paprika and chili flakes.",
    "image_url": "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80",
    "calories": 320,
    "fat_g": 18,
    "protein_g": 26,
    "carbs_g": 8,
    "keywords": {
      "countries": [
        "Spanish"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Seafood"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "shellfish"
    ],
    "low_fat": false
  },
  {
    "id": 60,
    "name": "Lebanese Chicken Shawarma Bowl",
    "description": "Spiced rotisserie chicken with hummus, tabbouleh, garlic toum sauce and warm pita bread.",
    "image_url": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&q=80",
    "calories": 490,
    "fat_g": 18,
    "protein_g": 38,
    "carbs_g": 42,
    "keywords": {
      "countries": [
        "Lebanon"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal",
      "kosher"
    ],
    "allergens": [
      "gluten",
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 61,
    "name": "Falafel & Hummus Platter",
    "description": "Crispy golden chickpea falafel patties served with velvety tahini hummus and Mediterranean salad.",
    "image_url": "https://i.postimg.cc/52yd6XRV/IMG-4369.jpg",
    "calories": 420,
    "fat_g": 18,
    "protein_g": 16,
    "carbs_g": 50,
    "keywords": {
      "countries": [
        "Lebanon"
      ],
      "cooking_methods": [
        "Fry"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegan",
      "vegetarian",
      "dairy-free",
      "halal",
      "kosher"
    ],
    "allergens": [
      "sesame"
    ],
    "low_fat": false
  },
  {
    "id": 62,
    "name": "Lao Larb Moo (Spicy Minced Pork)",
    "description": "Traditional Laotian minced pork salad with fish sauce, lime juice, galangal, mint and toasted sticky rice powder.",
    "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
    "calories": 310,
    "fat_g": 16,
    "protein_g": 28,
    "carbs_g": 12,
    "keywords": {
      "countries": [
        "Laos"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free"
    ],
    "allergens": [],
    "low_fat": true
  },
  {
    "id": 63,
    "name": "German Bratwurst with Sauerkraut",
    "description": "Grilled German pork sausage served with tangy fermented sauerkraut and German mustard.",
    "image_url": "https://images.unsplash.com/photo-1585325701165-351af916e581?w=800&q=80",
    "calories": 470,
    "fat_g": 32,
    "protein_g": 22,
    "carbs_g": 16,
    "keywords": {
      "countries": [
        "German"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Pork"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "dairy-free"
    ],
    "allergens": [],
    "low_fat": false
  },
  {
    "id": 64,
    "name": "British Shepherd's Pie",
    "description": "Savory minced lamb and vegetables simmered in gravy topped with golden browned mashed potatoes.",
    "image_url": "https://i.postimg.cc/Z5ntCWMh/IMG-4368.jpg",
    "calories": 510,
    "fat_g": 24,
    "protein_g": 30,
    "carbs_g": 42,
    "keywords": {
      "countries": [
        "British"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Bread"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "halal"
    ],
    "allergens": [
      "dairy"
    ],
    "low_fat": false
  },
  {
    "id": 65,
    "name": "Nordic Baked Salmon with Dill",
    "description": "Scandinavian baked salmon fillet with fresh dill, lemon zest, baby potatoes and sour cream sauce.",
    "image_url": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    "calories": 440,
    "fat_g": 18,
    "protein_g": 36,
    "carbs_g": 28,
    "keywords": {
      "countries": [
        "American"
      ],
      "cooking_methods": [
        "Bake"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Fish"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "halal"
    ],
    "allergens": [
      "fish",
      "dairy"
    ],
    "low_fat": false
  },
  {
    "id": 66,
    "name": "Greek Chicken Souvlaki",
    "description": "Marinated skewered chicken breast grilled with oregano and lemon, served with tzatziki and Greek salad.",
    "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
    "calories": 410,
    "fat_g": 14,
    "protein_g": 40,
    "carbs_g": 24,
    "keywords": {
      "countries": [
        "Lebanon"
      ],
      "cooking_methods": [
        "Grill"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Chicken"
      ]
    },
    "dietary_tags": [
      "gluten-free",
      "halal"
    ],
    "allergens": [
      "dairy"
    ],
    "low_fat": false
  },
  {
    "id": 67,
    "name": "Thai Basil Beef (Pad Kra Pao Nua)",
    "description": "Sliced tender beef stir-fried with fragrant holy basil, garlic, and fiery bird's eye chilies.",
    "image_url": "https://i.postimg.cc/m2w1T503/IMG-4377.jpg",
    "calories": 490,
    "fat_g": 20,
    "protein_g": 38,
    "carbs_g": 35,
    "keywords": {
      "countries": [
        "Thai"
      ],
      "cooking_methods": [
        "Stir-Fry"
      ],
      "carbs": [
        "Rice"
      ],
      "protein": [
        "Beef"
      ]
    },
    "dietary_tags": [
      "dairy-free",
      "halal"
    ],
    "allergens": [
      "soy"
    ],
    "low_fat": false
  },
  {
    "id": 68,
    "name": "Matcha Chia Pudding & Berries",
    "description": "Japanese ceremonial matcha infused almond milk chia pudding topped with fresh blueberries and raspberries.",
    "image_url": "https://i.postimg.cc/8zcQj70N/IMG-4367.jpg",
    "calories": 240,
    "fat_g": 8,
    "protein_g": 8,
    "carbs_g": 32,
    "keywords": {
      "countries": [
        "Japanese"
      ],
      "cooking_methods": [
        "Boil"
      ],
      "carbs": [
        "Low-Carb"
      ],
      "protein": [
        "Tofu"
      ]
    },
    "dietary_tags": [
      "vegan",
      "vegetarian",
      "gluten-free",
      "dairy-free",
      "halal",
      "kosher"
    ],
    "allergens": [],
    "low_fat": true
  }
];

let INITIAL_MEALS = [...DEFAULT_MEALS];
