export interface Product {
  id: string;
  category: 'hotels' | 'honeymoon' | 'tours';
  titleKey: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  location: string;
  locationKey?: string;
  duration?: string;
  descriptionKey?: string;
  includes?: string[];
  itinerary?: { day: number; title: string; description: string; titleKey?: string; descriptionKey?: string }[];
  reviews?: { id: string; user: string; rating: number; comment: string; date: string }[];
  isFeatured?: boolean;
}

const GENERIC_REVIEWS = [
  { id: 'gr1', user: 'Michael Chen', rating: 5, comment: 'An absolute dream experience. Everything was perfectly organized!', date: '2024-03-15' },
  { id: 'gr2', user: 'Elena Rodriguez', rating: 5, comment: 'Breathtaking views and exceptional hospitality. Highly recommended!', date: '2024-04-02' },
  { id: 'gr3', user: 'David Smith', rating: 4, comment: 'Very well structured. The guide was knowledgeable and friendly.', date: '2024-04-10' }
];

const GENERIC_INCLUDES = ['Professional Guide', 'Entrance Fees', 'Mineral Water', 'Air-conditioned Transport', 'Taxes and Service charges'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'd-1',
    category: 'hotels',
    titleKey: 'products.dahab.resort',
    price: 450,
    rating: 5,
    image: '/images/hero/02-dahab.jpg',
    images: ['/images/hero/02-dahab.jpg', '/images/search/blue_hole_diving_1777028494365.png', '/images/hero/08-sinai.jpg'],
    location: 'Dahab, South Sinai',
    locationKey: 'dahab.name',
    duration: '1 Night',
    descriptionKey: 'products.dahab.resort.desc',
    includes: ['Breakfast included', 'Beach access', 'Free WiFi', 'Pool access', 'Gym equipment'],
    itinerary: [
      { day: 1, title: 'Arrival & Relaxation', description: 'Check-in and enjoy the private beach and resort facilities.' },
      { day: 2, title: 'Breakfast & Wellness', description: 'Start your day with a healthy buffet followed by a spa session.' }
    ],
    reviews: [
      { id: 'r1', user: 'Ahmed Ali', rating: 5, comment: 'Amazing resort with great service!', date: '2024-05-01' },
      ...GENERIC_REVIEWS
    ],
    isFeatured: true
  },
  {
    id: 'd-2',
    category: 'tours',
    titleKey: 'products.dahab.diving',
    price: 120,
    rating: 5,
    image: '/images/search/blue_hole_diving_1777028494365.png',
    images: ['/images/search/blue_hole_diving_1777028494365.png', '/images/hero/02-dahab.jpg', '/images/search/honeymoon_dinner_1777028513572.png'],
    location: 'Blue Hole, Dahab',
    locationKey: 'dahab.name',
    duration: 'Full Day',
    descriptionKey: 'products.dahab.diving.desc',
    includes: ['Diving gear', 'Lunch', 'Professional instructor', 'Transportation', 'Underwater Photos'],
    itinerary: [
      { day: 1, title: 'Safety Briefing', description: 'Quick orientation and gear fitting with our master divers.' },
      { day: 2, title: 'The Deep Dive', description: 'Experience the world-famous Blue Hole with professional guides.' }
    ],
    reviews: GENERIC_REVIEWS
  },
  {
    id: 's-1',
    category: 'honeymoon',
    titleKey: 'products.sharm.honeymoon',
    price: 1200,
    rating: 5,
    image: '/images/search/honeymoon_dinner_1777028513572.png',
    images: ['/images/search/honeymoon_dinner_1777028513572.png', '/images/hero/04-sharm.jpg', '/images/search/luxury_yacht_red_sea_2_1777028530927.png'],
    location: 'Naama Bay, Sharm',
    locationKey: 'sharm.name',
    duration: '3 Nights',
    descriptionKey: 'products.sharm.honeymoon.desc',
    includes: ['Luxury suite', 'Romantic dinner', 'Spa treatment', 'Airport transfer', 'Breakfast in Bed'],
    itinerary: [
      { day: 1, title: 'Arrival & Welcome', description: 'Romantic welcome with flowers and champagne in your suite.' },
      { day: 2, title: 'Spa & Sunset Dinner', description: 'Full day of spa treatments followed by a private dinner on the beach.' },
      { day: 3, title: 'Island Escape', description: 'Private boat trip to Tiran Island for snorkeling and relaxation.' }
    ],
    reviews: [
      { id: 'r1', user: 'Elena Rodriguez', rating: 5, comment: 'Perfect honeymoon!', date: '2024-04-02' },
      ...GENERIC_REVIEWS
    ],
    isFeatured: true
  },
  {
    id: 'la-1',
    category: 'tours',
    titleKey: 'products.luxor.valley',
    price: 150,
    rating: 5,
    image: '/images/hero/05-luxor.jpg',
    images: ['/images/hero/05-luxor.jpg', '/images/hero/07-nile.jpg', '/images/hero/01-giza.jpg'],
    location: 'West Bank, Luxor',
    locationKey: 'luxor.name',
    duration: 'Full Day',
    descriptionKey: 'products.luxor.valley.desc',
    includes: ['Entry tickets', 'Licensed Egyptologist', 'Private AC vehicle', 'Bottled water', 'Lunch included'],
    itinerary: [
      { day: 1, title: 'Ancient Wonders', description: 'Visit the Valley of the Kings, Hatshepsut Temple, and Colossi of Memnon.' },
      { day: 2, title: 'East Bank Discovery', description: 'Explore Karnak Temple and Luxor Temple under the sunset.' }
    ],
    reviews: GENERIC_REVIEWS
  },
  {
    id: 'c-1',
    category: 'tours',
    titleKey: 'products.cairo.pyramids',
    price: 90,
    rating: 5,
    image: '/images/hero/01-giza.jpg',
    images: ['/images/hero/01-giza.jpg', '/images/hero/05-luxor.jpg', '/images/hero/06-alexandria.jpg'],
    location: 'Giza Plateau, Cairo',
    locationKey: 'cairo.name',
    duration: 'Full Day',
    descriptionKey: 'products.cairo.pyramids.desc',
    includes: ['Pyramid entry', 'Camel ride', 'Sphinx visit', 'Lunch', 'Expert Guide'],
    itinerary: [
      { day: 1, title: 'The Great Pyramids', description: 'Explore the Great Pyramids of Giza, the Sphinx, and the Valley Temple.' },
      { day: 2, title: 'Egyptian Museum', description: 'Discover the treasures of King Tutankhamun and the Royal Mummies.' }
    ],
    reviews: GENERIC_REVIEWS
  }
];
