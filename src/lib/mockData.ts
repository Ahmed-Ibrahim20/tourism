export interface Product {
  id: string;
  category: 'hotels' | 'honeymoon' | 'tours';
  titleKey: string;
  price: number;
  rating: number;
  image: string;
  images?: string[];
  location: string;
  duration?: string;
  description?: string;
  includes?: string[];
  itinerary?: { day: number; title: string; description: string }[];
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    category: 'hotels',
    titleKey: 'dahab.name',
    price: 450,
    rating: 5,
    image: '/images/search/luxury_dahab_resort_1777028476460.png',
    images: [
      '/images/search/luxury_dahab_resort_1777028476460.png',
      '/images/search/blue_hole_diving_1777028494365.png',
      '/images/search/honeymoon_dinner_1777028513572.png'
    ],
    location: 'Dahab, South Sinai',
    description: 'Experience unparalleled luxury at our Dahab resort. Nestled between the majestic mountains and the crystal-clear waters of the Red Sea, this oasis offers world-class amenities, private beaches, and breathtaking sunset views.',
    includes: ['Private Beach Access', 'All-Inclusive Dining', 'Spa & Wellness Center', 'Diving Center Access', 'VIP Airport Transfer'],
  },
  {
    id: '2',
    category: 'tours',
    titleKey: 'experience.scubaDiving',
    price: 120,
    rating: 4,
    image: '/images/search/blue_hole_diving_1777028494365.png',
    location: 'Blue Hole, Dahab',
    duration: '1 Day',
    description: 'Dive into the world-famous Blue Hole. This extraordinary dive site is a must-see for any diving enthusiast. Our professional guides will ensure a safe and awe-inspiring experience among vibrant coral reefs and exotic marine life.',
    includes: ['Professional Diving Instructor', 'High-End Equipment', 'Lunch & Drinks', 'Photography Package'],
    itinerary: [
      { day: 1, title: 'Morning Briefing', description: 'Meet at the dive center for safety briefing and equipment fitting.' },
      { day: 1, title: 'The First Dive', description: 'Explore the outer walls of the Blue Hole.' },
      { day: 1, title: 'Canyon Dive', description: 'Navigate the stunning underwater canyons nearby.' }
    ]
  },
  {
    id: '3',
    category: 'honeymoon',
    titleKey: 'tab.honeymoon',
    price: 1500,
    rating: 5,
    image: '/images/search/honeymoon_dinner_1777028513572.png',
    location: 'Private Beach, Sharm',
    duration: '3 Nights',
    description: 'Create memories that last a lifetime with our ultimate honeymoon package. Enjoy a private beach dinner under the stars, luxury suite accommodations, and personalized romantic experiences tailored just for you.',
    includes: ['Private Beach Dinner', 'Suite with Sea View', 'Couple Massage', 'Sunset Yacht Cruise', 'Personal Concierge'],
  },
  {
    id: '4',
    category: 'tours',
    titleKey: 'experience.yachtCruise',
    price: 800,
    rating: 5,
    image: '/images/search/luxury_yacht_red_sea_2_1777028530927.png',
    location: 'Red Sea, Hurghada',
    duration: 'Full Day',
    description: 'Sail the Red Sea in style on our private luxury yacht. Perfect for families or groups looking for an exclusive day of swimming, snorkeling, and sunbathing away from the crowds.',
    includes: ['Private Yacht Rental', 'Professional Crew', 'Gourmet Lunch', 'Snorkeling Gear', 'Open Bar'],
  }
];
