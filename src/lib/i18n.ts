import { create } from 'zustand';

export type Lang = 'en' | 'de' | 'fr' | 'ar';

// ── Translation Database ─────────────────────────────────────────────────────
const translations: Record<Lang, Record<string, string>> = {
  en: {
    // ── Navigation ─────────────────────────────────────────────────────
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.destinations': 'Destinations',
    'nav.experiences': 'Experiences',
    'nav.honeymoon': 'Honeymoon',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cta': 'Plan Your Trip',
    'nav.planTrip': 'Plan Your Trip',
    'nav.language': 'Language',
    'brand.name': 'Dahab Dream Tour',

    // ── Hero ───────────────────────────────────────────────────────────
    'hero.tagline': 'Luxury Egyptian Travel Experiences',
    'hero.headline': 'Discover Egypt Like Never Before',
    'hero.subheadline':
      'From the golden shores of Dahab to the vibrant reefs of the Red Sea — curated luxury journeys tailored to your dreams.',
    'hero.subheadline.giza':
      'Stand before the timeless Great Pyramids of Giza — where ancient pharaohs built monuments that have endured for over 4,500 years.',
    'hero.subheadline.dahab':
      'Dive into the crystal-clear waters of the Blue Hole, where desert mountains meet the most vibrant coral reefs in the world.',
    'hero.subheadline.hurghada':
      'Experience the ultimate Red Sea paradise — luxury resorts, pristine beaches, and world-class diving await you.',
    'hero.subheadline.sharm':
      'Discover Sharm El Sheikh, where the Sinai mountains meet turquoise waters — a playground for divers and luxury seekers.',
    'hero.subheadline.luxor':
      'Walk through the Valley of the Kings and ancient temples of Luxor — where the glory of pharaohs comes alive.',
    'hero.subheadline.alexandria':
      'Explore the Mediterranean jewel of Alexandria — where ancient history and modern elegance meet at the sea.',
    'hero.subheadline.nile':
      'Sail the legendary Nile River at sunset — a timeless journey through the heart of ancient Egyptian civilization.',
    'hero.subheadline.sinai':
      'Ascend the sacred peaks of Mount Sinai — where breathtaking sunrises and spiritual serenity await.',
    'hero.cta': 'Plan My Trip',
    'hero.secondaryCta': 'Explore Destinations',
    'hero.rating': 'Rated 4.7/5 by travelers',
    'hero.travelers': '5,000+ Happy Travelers',

    // ── Destinations ───────────────────────────────────────────────────
    'destinations.title': 'Explore Our Destinations',
    'destinations.subtitle':
      'Handpicked locations for unforgettable experiences',
    'destinations.cta': 'View Details',
    'destinations.bookNow': 'Book Now',
    'dahab.name': 'Dahab',
    'dahab.tagline': 'Where the desert meets the sea',
    'hurghada.name': 'Hurghada',
    'hurghada.tagline': 'Gateway to the Red Sea',
    'sharm.name': 'Sharm El Sheikh',
    'sharm.tagline': 'Pearl of the Sinai',
    'aswan.name': 'Aswan',
    'aswan.tagline': 'Nubian soul of the Nile',
    'luxor.name': 'Luxor',
    'luxor.tagline': 'The world\'s greatest open-air museum',
    'alexandria.name': 'Alexandria',
    'alexandria.tagline': 'Mediterranean jewel of Egypt',
    'nile.name': 'Nile River',
    'nile.tagline': 'Timeless journey of pharaohs',
    'sinai.name': 'Mount Sinai',
    'sinai.tagline': 'Sacred peaks & sunrises',

    // ── Modal Tabs ─────────────────────────────────────────────────────
    'tab.honeymoon': 'Honeymoon',
    'tab.hotels': 'Hotels',
    'tab.experiences': 'Experiences',
    'tab.trips': 'Trips',
    'trips.subtitle': 'Unforgettable journeys and daily excursions.',

    // ── Modal Items ────────────────────────────────────────────────────
    'from': 'from',
    'perNight': 'per night',
    'perPerson': 'per person',
    'perCouple': 'per couple',
    'bookNow': 'Book Now',

    // ── Map ────────────────────────────────────────────────────────────
    'map.title': 'Find Your Paradise',
    'map.subtitle': 'Interactive map of our exclusive destinations',
    'map.dahabInfo':
      'A serene coastal town renowned for its world-class windsurfing, vibrant coral reefs, and laid-back bohemian charm.',
    'map.hurghadaInfo':
      'A bustling resort city on the Red Sea coast, famous for its crystal-clear waters, marine life, and year-round sunshine.',
    'map.sharmInfo':
      'A premium resort destination nestled between the Sinai mountains and the Red Sea, offering world-class diving and luxury resorts.',
    'map.gizaInfo': 'Home to the magnificent Great Pyramids and the timeless Sphinx. Step back 4,500 years and witness the pinnacle of ancient architectural mastery.',
    'map.alexandriaInfo': 'The majestic Pearl of the Mediterranean. Founded by Alexander the Great, blending Greco-Roman heritage with profound seaside elegance.',
    'map.luxorInfo': 'Often called the world\'s greatest open-air museum, filled with astonishing temples, the Valley of the Kings, and pharaonic tombs.',
    'map.nileInfo': 'Experience the lifeblood of Egypt from the deck of a luxury cruise, drifting past ancient temples and lush riverbanks at sunset.',
    'map.sinaiInfo': 'A deeply spiritual and rugged paradise. Ascend Mount Sinai for an iconic sunrise, followed by visits to historic desert monasteries.',

    // ── Trip Builder ───────────────────────────────────────────────────
    'tripBuilder.title': 'Build Your Dream Trip',
    'tripBuilder.subtitle':
      'Customize your perfect Egyptian getaway',
    'tripBuilder.budget': 'Budget',
    'tripBuilder.days': 'Duration',
    'tripBuilder.daysLabel': 'days',
    'tripBuilder.type': 'Trip Type',
    'tripBuilder.typeAdventure': 'Adventure',
    'tripBuilder.typeRelaxation': 'Relaxation',
    'tripBuilder.typeCultural': 'Cultural',
    'tripBuilder.typeHoneymoon': 'Honeymoon',
    'tripBuilder.typeFamily': 'Family',
    'tripBuilder.buildBtn': 'Build My Trip',
    'tripBuilder.suggestedPlan': 'Your Suggested Plan',
    'tripBuilder.includes': 'Includes',
    'tripBuilder.totalPrice': 'Total Estimated Price',
    'tripBuilder.inquire': 'Inquire Now',

    // ── Experiences ────────────────────────────────────────────────────
    'experiences.title': 'Unforgettable Experiences',
    'experiences.subtitle':
      'Curated activities for every type of traveler',
    'experiences.learnMore': 'Learn More',
    'experience.scubaDiving': 'Scuba Diving',
    'experience.desertSafari': 'Desert Safari',
    'experience.yachtCruise': 'Yacht Cruise',
    'experience.culturalTours': 'Cultural Tours',
    'experience.snorkeling': 'Snorkeling',
    'experience.spaWellness': 'Spa & Wellness',
    'experiences.viewMore': 'View More',

    // ── Honeymoon ──────────────────────────────────────────────────────
    'honeymoon.title': 'Begin Your Forever in Paradise',
    'honeymoon.subtitle':
      'Romantic getaways crafted with elegance — private beaches, sunset dinners, and unforgettable moments together.',
    'honeymoon.cta': 'Plan Your Honeymoon',
    'honeymoon.feature1': 'Private Beach Dinners',
    'honeymoon.feature2': 'Luxury Couples Spa',
    'honeymoon.feature3': 'Sunset Yacht Cruises',
    'honeymoon.feature4': 'Personalized Itinerary',

    // ── Why Us ─────────────────────────────────────────────────────────
    'whyUs.title': 'Why Choose Dahab Dream Tour?',
    'whyUs.subtitle':
      'We combine local expertise with world-class service to deliver journeys that exceed your expectations.',
    'whyUs.reason1Title': 'Expert Local Guides',
    'whyUs.reason1Desc':
      'Our passionate guides bring Egypt\'s history and culture to life with insider knowledge and personal stories.',
    'whyUs.reason2Title': 'Tailor-Made Itineraries',
    'whyUs.reason2Desc':
      'Every trip is uniquely crafted to match your interests, pace, and travel style — no cookie-cutter packages.',
    'whyUs.reason3Title': 'Premium Accommodations',
    'whyUs.reason3Desc':
      'We partner exclusively with 4- and 5-star hotels and boutique resorts that meet our exacting quality standards.',
    'whyUs.reason4Title': '24/7 Concierge Support',
    'whyUs.reason4Desc':
      'From the moment you book until you return home, our dedicated team is available around the clock to assist you.',

    // ── Stats ──────────────────────────────────────────────────────────
    'stat.travelers': '5,000+',
    'stat.travelersLabel': 'Happy Travelers',
    'stat.rating': '4.7',
    'stat.ratingLabel': 'Average Rating',
    'stat.destinations': '50+',
    'stat.destinationsLabel': 'Experiences',
    'stat.years': '10+',
    'stat.yearsLabel': 'Years of Excellence',

    // ── Testimonials ───────────────────────────────────────────────────
    'testimonials.title': 'What Our Travelers Say',
    'testimonials.subtitle':
      'Real stories from real adventurers who trusted us with their dream vacation.',

    // ── Urgency ────────────────────────────────────────────────────────
    'urgency.title': 'Limited Availability',
    'urgency.subtitle':
      "Don't miss out on our exclusive seasonal packages",
    'urgency.cta': 'Reserve Your Spot Now',
    'urgency.spotsLeft': 'Only {spots} spots left for {month}',

    // ── Contact ────────────────────────────────────────────────────────
    'contact.title': 'Start Planning Your Dream Trip',
    'contact.subtitle':
      'Fill out the form and our travel experts will create your perfect itinerary',
    'contact.name': 'Your Name',
    'contact.email': 'Email Address',
    'contact.message': 'Your Message',
    'contact.submit': 'Send Message',

    // ── Footer ─────────────────────────────────────────────────────────
    'footer.description':
      'Dahab Dream Tour is your premier partner for luxury travel experiences across Egypt. We craft unforgettable journeys through the most beautiful destinations the country has to offer.',
    'footer.quickLinks': 'Quick Links',
    'footer.destinations': 'Destinations',
    'footer.experiences': 'Experiences',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',

    // ── WhatsApp ───────────────────────────────────────────────────────
    'whatsapp.tooltip': 'Chat with us on WhatsApp',

    // ── Search & Filter ────────────────────────────────────────────────
    'in': 'in',
    'search.title': 'Curated Escapes',
    'search.subtitle': 'Find your next adventure with our curated selection of tours, hotels, and honeymoons.',
    'search.filter': 'Filter Results',
    'search.priceRange': 'Price Range',
    'search.starRating': 'Star Rating',
    'search.categories': 'Categories',
    'search.resultsFound': '{count} experiences found',
    'search.sortBy': 'Sort By',
    'search.noResults': 'No experiences match your criteria.',
    'category.all': 'All Packages',
    'category.hotels': 'Luxury Hotels',
    'category.honeymoon': 'Honeymoon',
    'category.tours': 'Private Tours',
    'filter.apply': 'Apply Filters',
    'filter.reset': 'Reset',
  },

  ar: {
    // ── Navigation ─────────────────────────────────────────────────────
    'nav.home': 'الرئيسية',
    'nav.search': 'البحث',
    'nav.destinations': 'الوجهات',
    'nav.experiences': 'التجارب',
    'nav.honeymoon': 'شهر العسل',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.cta': 'خطّط رحلتك',
    'nav.planTrip': 'خطّط رحلتك',
    'nav.language': 'اللغة',
    'brand.name': 'داهاب دريم تور',

    // ── Hero ───────────────────────────────────────────────────────────
    'hero.tagline': 'تجارب سفر فاخرة في قلب مصر',
    'hero.headline': 'اكتشف مصر كما لم تعرفها من قبل',
    'hero.subheadline':
      'من الشواطئ الذهبية في دهب إلى الشعاب المرجانية الزاهية في البحر الأحمر — رحلات فاخرة مُصمَّمة خصيصاً لتحقيق أحلامك.',
    'hero.subheadline.giza':
      'قف أمام أعظم عجائب الدنيا — الأهرامات الخالدة التي شيّدها الفراعنة منذ أكثر من 4500 عام في انتظارك.',
    'hero.subheadline.dahab':
      'اغطس في مياه الثقب الأزرق الكريستالية الشفافة، حيث تلتقي الجبال الصحراوية بأكثر الشعاب المرجانية حيوية وجمالاً في العالم.',
    'hero.subheadline.hurghada':
      'عش جنة البحر الأحمر الحقيقية — منتجعات فاخرة، شواطئ بكر، وغوص احترافي لا مثيل له.',
    'hero.subheadline.sharm':
      'اكتشف شرم الشيخ، حيث تلتقي جبال سيناء بالمياه الفيروزية — وجهة الغوص والرفاهية الأولى في العالم.',
    'hero.subheadline.luxor':
      'تجوّل في وادي الملوك ومعابد الأقصر العريقة — حيث يعيش مجد الفراعنة حياةً جديدة بين أروقة التاريخ.',
    'hero.subheadline.alexandria':
      'استكشف جوهرة البحر المتوسط — الإسكندرية، حيث يتقاطع التاريخ العريق مع الأناقة المعاصرة على شط البحر.',
    'hero.subheadline.nile':
      'أبحر في قلب الحضارة على متن رحلة نيلية ساحرة عند الغروب — رحلة عبر الزمن لن تُنسى أبداً.',
    'hero.subheadline.sinai':
      'اصعد إلى قمم سيناء المقدسة — حيث يستقبلك شروق شمس يغير الحياة وسكينة روحية لا توصف.',
    'hero.cta': 'خطّط رحلتي الآن',
    'hero.secondaryCta': 'استكشف الوجهات',
    'hero.rating': 'تقييم 4.9/5 من المسافرين',
    'hero.travelers': '+5,000 مسافر سعيد',

    // ── Destinations ───────────────────────────────────────────────────
    'destinations.title': 'استكشف وجهاتنا الساحرة',
    'destinations.subtitle':
      'وجهات مختارة بعناية لتمنحك تجارب لا تُنسى طوال حياتك',
    'destinations.cta': 'عرض التفاصيل',
    'destinations.bookNow': 'احجز الآن',
    'dahab.name': 'دهب',
    'dahab.tagline': 'حيث تلتقي الصحراء بالبحر',
    'hurghada.name': 'الغردقة',
    'hurghada.tagline': 'بوابة البحر الأحمر الذهبية',
    'sharm.name': 'شرم الشيخ',
    'sharm.tagline': 'لؤلؤة سيناء الخالدة',
    'aswan.name': 'أسوان',
    'aswan.tagline': 'روح النوبة على ضفاف النيل',
    'luxor.name': 'الأقصر',
    'luxor.tagline': 'أعظم متحف مفتوح في العالم',
    'alexandria.name': 'الإسكندرية',
    'alexandria.tagline': 'جوهرة المتوسط الأبدية',
    'nile.name': 'نهر النيل',
    'nile.tagline': 'رحلة عبر عمق الحضارة',
    'sinai.name': 'جبل سيناء',
    'sinai.tagline': 'قمم مقدسة وشروق يغير القلوب',

    // ── Modal Tabs ─────────────────────────────────────────────────────
    'tab.honeymoon': 'شهر العسل',
    'tab.hotels': 'الفنادق',
    'tab.experiences': 'التجارب',
    'tab.trips': 'الرحلات',
    'trips.subtitle': 'رحلات لا تُنسى وجولات يومية مثيرة.',

    // ── Modal Items ────────────────────────────────────────────────────
    'from': 'يبدأ من',
    'perNight': 'لكل ليلة',
    'perPerson': 'للشخص',
    'perCouple': 'للزوجين',
    'bookNow': 'احجز الآن',

    // ── Map ────────────────────────────────────────────────────────────
    'map.title': 'اعثر على جنتك',
    'map.subtitle': 'خريطة تفاعلية لاستكشاف وجهاتنا الحصرية',
    'map.dahabInfo':
      'بلدة ساحلية هادئة تشتهر بالغوص الاحترافي وأجمل الشعاب المرجانية في العالم، مع أجواء بوهيمية لا تُقاوم.',
    'map.hurghadaInfo':
      'مدينة منتجعات نابضة بالحياة على ساحل البحر الأحمر، تتميز بمياهها الشفافة وثرواتها البحرية الخلّابة.',
    'map.sharmInfo':
      'وجهة فاخرة تنسدل بين جبال سيناء والبحر الأحمر، توفر تجارب غوص استثنائية ومنتجعات بـ 5 نجوم.',
    'map.gizaInfo': 'موطن الأهرامات العظيمة وأبو الهول الخالد. تجوّل عبر 4500 عام من عمق الحضارة الإنسانية.',
    'map.alexandriaInfo': 'لؤلؤة البحر المتوسط الراقية. أسسها الإسكندر الأكبر وتجمع التراث اليوناني الروماني بأناقة البحر.',
    'map.luxorInfo': 'أعظم متحف مفتوح في العالم، يزخر بوادي الملوك ومعابد الكرنك والمقابر الفرعونية المذهلة.',
    'map.nileInfo': 'عش تجربة النيل الأسطورية على متن رحلة فاخرة تمر بمعابد عريقة والضفاف الخضراء عند المغيب.',
    'map.sinaiInfo': 'جنة روحية وطبيعية خلّابة. اصعد جبل سيناء لتشهد شروقاً لا ينسى، ثم زُر أقدم الأديرة التاريخية.',

    // ── Trip Builder ───────────────────────────────────────────────────
    'tripBuilder.title': 'صمّم رحلة أحلامك',
    'tripBuilder.subtitle':
      'خصّص تجربتك المثالية في مصر بكل تفاصيلها',
    'tripBuilder.budget': 'الميزانية',
    'tripBuilder.days': 'المدة',
    'tripBuilder.daysLabel': 'أيام',
    'tripBuilder.type': 'نوع الرحلة',
    'tripBuilder.typeAdventure': 'مغامرة',
    'tripBuilder.typeRelaxation': 'استرخاء',
    'tripBuilder.typeCultural': 'ثقافية',
    'tripBuilder.typeHoneymoon': 'شهر عسل',
    'tripBuilder.typeFamily': 'عائلية',
    'tripBuilder.buildBtn': 'صمّم رحلتي',
    'tripBuilder.suggestedPlan': 'برنامجك المقترح',
    'tripBuilder.includes': 'يشمل',
    'tripBuilder.totalPrice': 'إجمالي السعر التقديري',
    'tripBuilder.inquire': 'استفسر الآن',

    // ── Experiences ────────────────────────────────────────────────────
    'experiences.title': 'تجارب لا تُنسى أبداً',
    'experiences.subtitle':
      'أنشطة مُختارة بدقة لكل نوع من المسافرين',
    'experiences.learnMore': 'اعرف المزيد',
    'experience.scubaDiving': 'الغوص بالأكسجين',
    'experience.desertSafari': 'سفاري الصحراء',
    'experience.yachtCruise': 'رحلة يخت فاخرة',
    'experience.culturalTours': 'جولات ثقافية',
    'experience.snorkeling': 'الغطس والعوم',
    'experience.spaWellness': 'سبا ورفاهية',
    'experiences.viewMore': 'عرض المزيد',

    // ── Honeymoon ──────────────────────────────────────────────────────
    'honeymoon.title': 'ابدأ إلى الأبد في الجنة',
    'honeymoon.subtitle':
      'رحلات رومانسية مصممة بأرقى التفاصيل — شواطئ خاصة، عشاء على ضوء القمر، ولحظات لن تُنسى معًا.',
    'honeymoon.cta': 'خطّط شهر عسلكما',
    'honeymoon.feature1': 'عشاء على الشاطئ الخاص',
    'honeymoon.feature2': 'سبا فاخر للأزواج',
    'honeymoon.feature3': 'رحلات يخت عند الغروب',
    'honeymoon.feature4': 'برنامج مُصمَّم خصيصاً لكما',

    // ── Why Us ─────────────────────────────────────────────────────────
    'whyUs.title': 'لماذا تختار داهاب دريم تور؟',
    'whyUs.subtitle':
      'نجمع بين الخبرة المحلية العميقة والخدمة الراقية عالمياً لنقدم لك رحلات تفوق كل توقعاتك.',
    'whyUs.reason1Title': 'مرشدون محليون خبراء',
    'whyUs.reason1Desc':
      'مرشدونا المتحمسون يُحيون تاريخ مصر وثقافتها بقصص شخصية ومعرفة من الداخل لا تجدها في أي مكان آخر.',
    'whyUs.reason2Title': 'برامج مُصمَّمة حسب طلبك',
    'whyUs.reason2Desc':
      'كل رحلة تُصنع خصيصاً لك — تتناسب مع اهتماماتك وإيقاعك وأسلوبك في السفر. لا قوالب جاهزة هنا.',
    'whyUs.reason3Title': 'إقامة فندقية فاخرة',
    'whyUs.reason3Desc':
      'نتعاون حصرياً مع فنادق 4 و5 نجوم ومنتجعات بوتيك تلبي أعلى معايير الجودة والراحة.',
    'whyUs.reason4Title': 'دعم كونسيرج 24/7',
    'whyUs.reason4Desc':
      'من لحظة حجزك حتى عودتك، فريقنا المتفاني بجانبك على مدار الساعة لضمان تجربة سفر لا عوائق فيها.',

    // ── Stats ──────────────────────────────────────────────────────────
    'stat.travelers': '+5,000',
    'stat.travelersLabel': 'مسافر سعيد',
    'stat.rating': '4.9',
    'stat.ratingLabel': 'متوسط التقييم',
    'stat.destinations': '+50',
    'stat.destinationsLabel': 'تجربة فريدة',
    'stat.years': '+10',
    'stat.yearsLabel': 'سنوات من التميز',

    // ── Testimonials ───────────────────────────────────────────────────
    'testimonials.title': 'ماذا يقول مسافرونا؟',
    'testimonials.subtitle':
      'قصص حقيقية من مسافرين حقيقيين أسندوا إلينا رحلة أحلامهم فلم يندموا.',

    // ── Urgency ────────────────────────────────────────────────────────
    'urgency.title': 'أماكن محدودة',
    'urgency.subtitle':
      'لا تفوّت عروضنا الموسمية الحصرية — الأماكن تنفد بسرعة!',
    'urgency.cta': 'احجز مكانك الآن',
    'urgency.spotsLeft': 'تبقّى فقط {spots} أماكن لشهر {month}',

    // ── Contact ────────────────────────────────────────────────────────
    'contact.title': 'ابدأ تخطيط رحلة أحلامك',
    'contact.subtitle':
      'أرسل لنا تفاصيلك وسيتواصل معك خبراؤنا لتصميم برنامجك المثالي',
    'contact.name': 'اسمك الكريم',
    'contact.email': 'البريد الإلكتروني',
    'contact.message': 'رسالتك',
    'contact.submit': 'أرسل الرسالة',

    // ── Footer ─────────────────────────────────────────────────────────
    'footer.description':
      'داهاب دريم تور هي شريكك المثالي لتجارب السفر الفاخرة في مصر. نصنع لك رحلات لا تُنسى عبر أجمل الوجهات السياحية في البلاد.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.destinations': 'الوجهات',
    'footer.experiences': 'التجارب',
    'footer.support': 'الدعم',
    'footer.legal': 'قانوني',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الاستخدام',
    'footer.cookies': 'سياسة ملفات تعريف الارتباط',

    // ── WhatsApp ───────────────────────────────────────────────────────
    'whatsapp.tooltip': 'تحدث معنا على واتساب',

    // ── Search & Filter ────────────────────────────────────────────────
    'in': 'في',
    'search.title': 'تجارب مختارة',
    'search.subtitle': 'اعثر على مغامرتك القادمة من خلال مجموعتنا المختارة من الرحلات والفنادق وباقات شهر العسل.',
    'search.filter': 'تصفية النتائج',
    'search.priceRange': 'نطاق السعر',
    'search.starRating': 'تقييم النجوم',
    'search.categories': 'الفئات',
    'search.resultsFound': 'تم العثور على {count} تجربة',
    'search.sortBy': 'ترتيب حسب',
    'search.noResults': 'لا توجد تجارب تطابق معاييرك.',
    'category.all': 'كل الباقات',
    'category.hotels': 'فنادق فاخرة',
    'category.honeymoon': 'شهر العسل',
    'category.tours': 'رحلات خاصة',
    'filter.apply': 'تطبيق الفلتر',
    'filter.reset': 'إعادة تعيين',
  },

  de: {
    // ── Navigation ─────────────────────────────────────────────────────
    'nav.home': 'Startseite',
    'nav.destinations': 'Reiseziele',
    'nav.experiences': 'Erlebnisse',
    'nav.honeymoon': 'Flitterwochen',
    'nav.about': 'Über uns',
    'nav.contact': 'Kontakt',
    'nav.cta': 'Ihre Reise planen',
    'nav.planTrip': 'Reise Planen',
    'nav.language': 'Sprache',
    'brand.name': 'Dahab Dream Tour',

    // ── Hero ───────────────────────────────────────────────────────────
    'hero.tagline': 'Luxus-Reiseerlebnisse in Ägypten',
    'hero.headline': 'Entdecken Sie Ägypten wie nie zuvor',
    'hero.subheadline':
      'Von den goldenen Küsten Dahabs bis zu den lebendigen Riffen des Roten Meeres — kuratierte Luxusreisen, die auf Ihre Träume zugeschnitten sind.',
    'hero.subheadline.giza':
      'Treten Sie vor die zeitlosen großen Pyramiden von Gizeh — wo alte Pharaonen Monumente errichteten, die über 4.500 Jahre bestehen.',
    'hero.subheadline.dahab':
      'Tauchen Sie in die kristallklaren Gewässer des Blue Hole, wo Wüstenberge auf die lebendigsten Korallenriffe der Welt treffen.',
    'hero.subheadline.hurghada':
      'Erleben Sie das ultimative Paradies am Roten Meer — Luxusresorts, makellose Strände und erstklassiges Tauchen erwarten Sie.',
    'hero.subheadline.sharm':
      'Entdecken Sie Sharm El Sheikh, wo Sinai-Berge auf türkisfarbene Wasser treffen — ein Spielfeld für Taucher und Luxusreisende.',
    'hero.subheadline.luxor':
      'Spazieren Sie durch das Tal der Könige und die antiken Tempel von Luxor — wo der Glanz der Pharaonen lebendig wird.',
    'hero.subheadline.alexandria':
      'Erkunden Sie das Mittelmeer-Juwel Alexandrias — wo alte Geschichte und moderne Eleganz am Meer aufeinandertreffen.',
    'hero.subheadline.nile':
      'Segeln Sie den legendären Nil bei Sonnenuntergang — eine zeitlose Reise durch das Herz der alten ägyptischen Zivilisation.',
    'hero.subheadline.sinai':
      'Besteigen Sie die heiligen Gipfel des Berges Sinai — wo atemberaubende Sonnenaufgänge und spirituelle Ruhe warten.',
    'hero.cta': 'Meine Reise planen',
    'hero.secondaryCta': 'Reiseziele entdecken',
    'hero.rating': 'Mit 4,7/5 von Reisenden bewertet',
    'hero.travelers': '5.000+ zufriedene Reisende',

    // ── Destinations ───────────────────────────────────────────────────
    'destinations.title': 'Entdecken Sie unsere Reiseziele',
    'destinations.subtitle':
      'Sorgfältig ausgewählte Orte für unvergessliche Erlebnisse',
    'destinations.cta': 'Details ansehen',
    'destinations.bookNow': 'Jetzt buchen',
    'dahab.name': 'Dahab',
    'dahab.tagline': 'Wo die Wüste auf das Meer trifft',
    'hurghada.name': 'Hurghada',
    'hurghada.tagline': 'Tor zum Roten Meer',
    'sharm.name': 'Sharm El Sheikh',
    'sharm.tagline': 'Die Perle des Sinai',
    'aswan.name': 'Assuan',
    'aswan.tagline': 'Nubische Seele des Nils',
    'luxor.name': 'Luxor',
    'luxor.tagline': 'Das größte Freilichtmuseum der Welt',
    'alexandria.name': 'Alexandria',
    'alexandria.tagline': 'Mittelmeer-Juwel Ägyptens',
    'nile.name': 'Nilfluss',
    'nile.tagline': 'Zeitlose Reise der Pharaonen',
    'sinai.name': 'Berg Sinai',
    'sinai.tagline': 'Heilige Gipfel & Sonnenaufgänge',

    // ── Modal Tabs ─────────────────────────────────────────────────────
    'tab.honeymoon': 'Flitterwochen',
    'tab.hotels': 'Hotels',
    'tab.experiences': 'Erlebnisse',
    'tab.trips': 'Ausflüge',
    'trips.subtitle': 'Unvergessliche Ausflüge und Tagestouren.',

    // ── Modal Items ────────────────────────────────────────────────────
    'from': 'ab',
    'perNight': 'pro Nacht',
    'perPerson': 'pro Person',
    'perCouple': 'pro Paar',
    'bookNow': 'Jetzt buchen',

    // ── Map ────────────────────────────────────────────────────────────
    'map.title': 'Finden Sie Ihr Paradies',
    'map.subtitle': 'Interaktive Karte unserer exklusiven Reiseziele',
    'map.dahabInfo':
      'Eine beschauliche Küstenstadt, berühmt für ihr erstklassiges Windsurfen, lebendige Korallenriffe und ihren entspannten, bohemischen Charme.',
    'map.hurghadaInfo':
      'Eine pulsierende Urlaubstadt an der Küste des Roten Meeres, bekannt für ihre kristallklaren Gewässer, die reiche Meeresfauna und ganzjährig Sonnenschein.',
    'map.sharmInfo':
      'Ein erstklassiges Ferienziel zwischen den Sinai-Bergen und dem Roten Meer, das erstklassiges Tauchen und Luxusresorts bietet.',
    'map.gizaInfo': 'Heimat der prächtigen großen Pyramiden und der zeitlosen Sphinx. Treten Sie 4.500 Jahre zurück und erleben Sie die alte Architektur.',
    'map.alexandriaInfo': 'Die majestätische Perle des Mittelmeers. Gegründet von Alexander dem Großen, vereint sie griechisch-römisches Erbe mit eleganter Meeresatmosphäre.',
    'map.luxorInfo': 'Oft als das größte Freilichtmuseum der Welt bezeichnet, mit erstaunlichen Tempeln und dem Tal der Könige.',
    'map.nileInfo': 'Erleben Sie das Lebenselixier Ägyptens auf einer Luxuskreuzfahrt, vorbei an alten Tempeln und üppigen Flussufern bei Sonnenuntergang.',
    'map.sinaiInfo': 'Ein zutiefst spirituelles Paradies. Besteigen Sie den Berg Sinai für einen ikonischen Sonnenaufgang.',

    // ── Trip Builder ───────────────────────────────────────────────────
    'tripBuilder.title': 'Stellen Sie Ihre Traumreise zusammen',
    'tripBuilder.subtitle':
      'Passen Sie Ihren perfekten Ägyptenurlaub individuell an',
    'tripBuilder.budget': 'Budget',
    'tripBuilder.days': 'Reisedauer',
    'tripBuilder.daysLabel': 'Tage',
    'tripBuilder.type': 'Reiseart',
    'tripBuilder.typeAdventure': 'Abenteuer',
    'tripBuilder.typeRelaxation': 'Entspannung',
    'tripBuilder.typeCultural': 'Kultur',
    'tripBuilder.typeHoneymoon': 'Flitterwochen',
    'tripBuilder.typeFamily': 'Familie',
    'tripBuilder.buildBtn': 'Meine Reise zusammenstellen',
    'tripBuilder.suggestedPlan': 'Ihr Reisevorschlag',
    'tripBuilder.includes': 'Enthält',
    'tripBuilder.totalPrice': 'Geschätzter Gesamtpreis',
    'tripBuilder.inquire': 'Jetzt anfragen',

    // ── Experiences ────────────────────────────────────────────────────
    'experiences.title': 'Unvergessliche Erlebnisse',
    'experiences.subtitle':
      'Kuratierte Aktivitäten für jeden Reisertyp',
    'experiences.learnMore': 'Mehr erfahren',
    'experience.scubaDiving': 'Tauchen',
    'experience.desertSafari': 'Wüstensafari',
    'experience.yachtCruise': 'Yachtkreuzfahrt',
    'experience.culturalTours': 'Kulturreisen',
    'experience.snorkeling': 'Schnorcheln',
    'experience.spaWellness': 'Spa & Wellness',
    'experiences.viewMore': 'Mehr anzeigen',

    // ── Honeymoon ──────────────────────────────────────────────────────
    'honeymoon.title': 'Beginnen Sie Ihre Ewigkeit im Paradies',
    'honeymoon.subtitle':
      'Romantische Ausflüge voller Eleganz — private Strände, Sonnenuntergangs-Dinner und unvergessliche gemeinsame Momente.',
    'honeymoon.cta': 'Ihre Flitterwochen planen',
    'honeymoon.feature1': 'Private Strand-Dinner',
    'honeymoon.feature2': 'Luxus-Couples-Spa',
    'honeymoon.feature3': 'Yachtkreuzfahrten bei Sonnenuntergang',
    'honeymoon.feature4': 'Individuelle Reiseplanung',

    // ── Why Us ─────────────────────────────────────────────────────────
    'whyUs.title': 'Warum Dahab Dream Tour?',
    'whyUs.subtitle':
      'Wir verbinden lokale Expertise mit erstklassigem Service, um Reisen zu gestalten, die Ihre Erwartungen übertreffen.',
    'whyUs.reason1Title': 'Erfahrene einheimische Reiseleiter',
    'whyUs.reason1Desc':
      'Unsere leidenschaftlichen Reiseleiter erwecken Ägyptens Geschichte und Kultur mit Insiderwissen und persönlichen Geschichten zum Leben.',
    'whyUs.reason2Title': 'Maßgeschneiderte Reisepläne',
    'whyUs.reason2Desc':
      'Jede Reise wird individuell auf Ihre Interessen, Ihr Tempo und Ihren Reise Stil zugeschnitten — keine Standardpakete.',
    'whyUs.reason3Title': 'Premium-Unterkünfte',
    'whyUs.reason3Desc':
      'Wir arbeiten ausschließlich mit 4- und 5-Sterne-Hotels sowie Boutique-Resorts zusammen, die unseren strengen Qualitätsstandards entsprechen.',
    'whyUs.reason4Title': '24/7 Concierge-Support',
    'whyUs.reason4Desc':
      'Von der Buchung bis zur Rückkehr ist unser engagiertes Team rund um die Uhr für Sie da.',

    // ── Stats ──────────────────────────────────────────────────────────
    'stat.travelers': '5.000+',
    'stat.travelersLabel': 'Zufriedene Reisende',
    'stat.rating': '4,7',
    'stat.ratingLabel': 'Durchschnittsbewertung',
    'stat.destinations': '50+',
    'stat.destinationsLabel': 'Erlebnisse',
    'stat.years': '10+',
    'stat.yearsLabel': 'Jahre Exzellenz',

    // ── Testimonials ───────────────────────────────────────────────────
    'testimonials.title': 'Was unsere Reisende sagen',
    'testimonials.subtitle':
      'Echte Geschichten von echten Abenteurern, die uns ihren Traumurlaub anvertraut haben.',

    // ── Urgency ────────────────────────────────────────────────────────
    'urgency.title': 'Begrenztes Platzangebot',
    'urgency.subtitle':
      'Verpassen Sie nicht unsere exklusiven Saisonangebote',
    'urgency.cta': 'Jetzt Ihren Platz sichern',
    'urgency.spotsLeft': 'Nur noch {spots} Plätze für {month}',

    // ── Contact ────────────────────────────────────────────────────────
    'contact.title': 'Planen Sie Ihre Traumreise',
    'contact.subtitle':
      'Füllen Sie das Formular aus und unsere Reiseexperten erstellen Ihre perfekte Reiseroute',
    'contact.name': 'Ihr Name',
    'contact.email': 'E-Mail-Adresse',
    'contact.message': 'Ihre Nachricht',
    'contact.submit': 'Nachricht senden',

    // ── Footer ─────────────────────────────────────────────────────────
    'footer.description':
      'Dahab Dream Tour ist Ihr erstklassiger Partner für Luxus-Reiseerlebnisse in ganz Ägypten. Wir gestalten unvergessliche Reisen zu den schönsten Reisezielen des Landes.',
    'footer.quickLinks': 'Schnelllinks',
    'footer.destinations': 'Reiseziele',
    'footer.experiences': 'Erlebnisse',
    'footer.support': 'Support',
    'footer.legal': 'Rechtliches',
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
    'footer.cookies': 'Cookie-Richtlinie',

    // ── WhatsApp ───────────────────────────────────────────────────────
    'whatsapp.tooltip': 'Kontaktieren Sie uns via WhatsApp',
  },

  fr: {
    // ── Navigation ─────────────────────────────────────────────────────
    'nav.home': 'Accueil',
    'nav.destinations': 'Destinations',
    'nav.experiences': 'Expériences',
    'nav.honeymoon': 'Lune de miel',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.cta': 'Planifiez votre voyage',
    'nav.planTrip': 'Planifiez Votre Voyage',
    'nav.language': 'Langue',
    'brand.name': 'Dahab Dream Tour',

    // ── Hero ───────────────────────────────────────────────────────────
    'hero.tagline': 'Voyages de luxe en Égypte',
    'hero.headline': 'Découvrez l\'Égypte comme jamais',
    'hero.subheadline':
      'Des côtes dorées de Dahab aux récifs vibrants de la mer Rouge — des voyages de luxe sur mesure conçus pour vos rêves.',
    'hero.subheadline.giza':
      'Contemplez les majestueuses Pyramides de Gizeh — où les anciens pharaons ont érigé des monuments qui perdurent depuis plus de 4 500 ans.',
    'hero.subheadline.dahab':
      'Plongez dans les eaux cristallines du Blue Hole, où les montagnes du désert rencontrent les récifs coralliens les plus vibrants au monde.',
    'hero.subheadline.hurghada':
      'Vivez le paradis ultime de la mer Rouge — complexes de luxe, plages immaculées et plongée de classe mondiale vous attendent.',
    'hero.subheadline.sharm':
      'Découvrez Sharm El Sheikh, où les montagnes du Sinaï rencontrent les eaux turquoise — un terrain de jeu pour plongeurs et amateurs de luxe.',
    'hero.subheadline.luxor':
      'Promenez-vous dans la Vallée des Rois et les temples antiques de Louxor — où la gloire des pharaons prend vie.',
    'hero.subheadline.alexandria':
      'Explorez le joyau méditerranéen d\'Alexandrie — où l\'histoire ancienne et l\'élégance moderne se rencontrent sur la mer.',
    'hero.subheadline.nile':
      'Naviguez sur le légendaire Nil au coucher du soleil — un voyage intemporel au cœur de la civilisation égyptienne antique.',
    'hero.subheadline.sinai':
      'Gravissez les sommets sacrés du mont Sinaï — où des levers de soleil époustouflants et la sérénité spirituelle vous attendent.',
    'hero.cta': 'Planifier mon voyage',
    'hero.secondaryCta': 'Explorer les destinations',
    'hero.rating': 'Noté 4,7/5 par les voyageurs',
    'hero.travelers': '5 000+ voyageurs heureux',

    // ── Destinations ───────────────────────────────────────────────────
    'destinations.title': 'Explorez nos destinations',
    'destinations.subtitle':
      'Des lieux soigneusement sélectionnés pour des expériences inoubliables',
    'destinations.cta': 'Voir les détails',
    'destinations.bookNow': 'Réserver',
    'dahab.name': 'Dahab',
    'dahab.tagline': 'Là où le désert rencontre la mer',
    'hurghada.name': 'Hurghada',
    'hurghada.tagline': 'Porte de la mer Rouge',
    'sharm.name': 'Sharm El Sheikh',
    'sharm.tagline': 'La perle du Sinaï',
    'aswan.name': 'Assouan',
    'aswan.tagline': 'L\'âme nubienne du Nil',
    'luxor.name': 'Louxor',
    'luxor.tagline': 'Le plus grand musée à ciel ouvert du monde',
    'alexandria.name': 'Alexandrie',
    'alexandria.tagline': 'Joyau méditerranéen de l\'Égypte',
    'nile.name': 'Le Nil',
    'nile.tagline': 'Voyage intemporel des pharaons',
    'sinai.name': 'Mont Sinaï',
    'sinai.tagline': 'Sommets sacrés & levers de soleil',

    // ── Modal Tabs ─────────────────────────────────────────────────────
    'tab.honeymoon': 'Lune de miel',
    'tab.hotels': 'Hôtels',
    'tab.experiences': 'Expériences',
    'tab.trips': 'Excursions',
    'trips.subtitle': 'Des voyages inoubliables et des excursions quotidiennes.',

    // ── Modal Items ────────────────────────────────────────────────────
    'from': 'à partir de',
    'perNight': 'par nuit',
    'perPerson': 'par personne',
    'perCouple': 'par couple',
    'bookNow': 'Réserver',

    // ── Map ────────────────────────────────────────────────────────────
    'map.title': 'Trouvez votre paradis',
    'map.subtitle': 'Carte interactive de nos destinations exclusives',
    'map.dahabInfo':
      'Une charmante ville côtière réputée pour le windsurf de classe mondiale, ses récifs coralliens vibrants et son atmosphère bohème détendue.',
    'map.hurghadaInfo':
      'Une ville balnéaire animée sur la côte de la mer Rouge, célèbre pour ses eaux cristallines, sa faune marine et son ensoleillement tout au long de l\'année.',
    'map.sharmInfo':
      'Une destination de prestige nichée entre les montagnes du Sinaï et la mer Rouge, offrant une plongée exceptionnelle et des resorts de luxe.',
    'map.gizaInfo': 'Abritant les superbes Grandes Pyramides et l\'intemporel Sphinx. Remontez 4 500 ans dans le temps pour admirer ce chef-d\'œuvre architectural.',
    'map.alexandriaInfo': 'La majestueuse Perle de la Méditerranée. Fondée par Alexandre le Grand, mêlant héritage gréco-romain et élégance côtière.',
    'map.luxorInfo': 'Souvent décrit comme le plus grand musée à ciel ouvert du monde, avec ses temples stupéfiants et la Vallée des Rois.',
    'map.nileInfo': 'Vivez le fleuve nourricier de l\'Égypte à bord d\'une croisière de luxe, naviguant devant des temples antiques au coucher du soleil.',
    'map.sinaiInfo': 'Un paradis spirituel et sauvage. Gravissez le mont Sinaï pour un lever de soleil emblématique.',

    // ── Trip Builder ───────────────────────────────────────────────────
    'tripBuilder.title': 'Composez votre voyage de rêve',
    'tripBuilder.subtitle':
      'Personnalisez votre escapade égyptienne idéale',
    'tripBuilder.budget': 'Budget',
    'tripBuilder.days': 'Durée',
    'tripBuilder.daysLabel': 'jours',
    'tripBuilder.type': 'Type de voyage',
    'tripBuilder.typeAdventure': 'Aventure',
    'tripBuilder.typeRelaxation': 'Détente',
    'tripBuilder.typeCultural': 'Culturel',
    'tripBuilder.typeHoneymoon': 'Lune de miel',
    'tripBuilder.typeFamily': 'Famille',
    'tripBuilder.buildBtn': 'Composer mon voyage',
    'tripBuilder.suggestedPlan': 'Votre programme suggéré',
    'tripBuilder.includes': 'Inclus',
    'tripBuilder.totalPrice': 'Prix total estimé',
    'tripBuilder.inquire': 'Demander maintenant',

    // ── Experiences ────────────────────────────────────────────────────
    'experiences.title': 'Expériences inoubliables',
    'experiences.subtitle':
      'Des activités soigneusement sélectionnées pour chaque type de voyageur',
    'experiences.learnMore': 'En savoir plus',
    'experience.scubaDiving': 'Plongée sous-marine',
    'experience.desertSafari': 'Safari dans le désert',
    'experience.yachtCruise': 'Croisière en yacht',
    'experience.culturalTours': 'Visites culturelles',
    'experience.snorkeling': 'Snorkeling',
    'experience.spaWellness': 'Spa & Bien-être',
    'experiences.viewMore': 'Voir plus',

    // ── Honeymoon ──────────────────────────────────────────────────────
    'honeymoon.title': 'Commencez votre éternité au paradis',
    'honeymoon.subtitle':
      'Des escapades romantiques conçues avec élégance — plages privées, dîners au coucher du soleil et moments inoubliables à deux.',
    'honeymoon.cta': 'Planifiez votre lune de miel',
    'honeymoon.feature1': 'Dîners sur la plage privée',
    'honeymoon.feature2': 'Spa couple de luxe',
    'honeymoon.feature3': 'Croisières en yacht au coucher du soleil',
    'honeymoon.feature4': 'Itinéraire personnalisé',

    // ── Why Us ─────────────────────────────────────────────────────────
    'whyUs.title': 'Pourquoi choisir Dahab Dream Tour ?',
    'whyUs.subtitle':
      'Nous combinons expertise locale et service de classe mondiale pour vous offrir des voyages qui dépassent vos attentes.',
    'whyUs.reason1Title': 'Guides locaux experts',
    'whyUs.reason1Desc':
      'Nos guides passionnés donnent vie à l\'histoire et à la culture de l\'Égypte grâce à leur connaissance approfondie et à leurs récits personnels.',
    'whyUs.reason2Title': 'Itinéraires sur mesure',
    'whyUs.reason2Desc':
      'Chaque voyage est conçu sur mesure selon vos centres d\'intérêt, votre rythme et votre style de voyage — pas de formules toutes faites.',
    'whyUs.reason3Title': 'Hébergements de prestige',
    'whyUs.reason3Desc':
      'Nous collaborons exclusivement avec des hôtels 4 et 5 étoiles ainsi que des resorts de charme répondant à nos normes de qualité exigeantes.',
    'whyUs.reason4Title': 'Assistance conciergerie 24/7',
    'whyUs.reason4Desc':
      'Dès votre réservation jusqu\'à votre retour, notre équipe dédiée est à votre disposition jour et nuit.',

    // ── Stats ──────────────────────────────────────────────────────────
    'stat.travelers': '5 000+',
    'stat.travelersLabel': 'Voyageurs heureux',
    'stat.rating': '4,7',
    'stat.ratingLabel': 'Note moyenne',
    'stat.destinations': '50+',
    'stat.destinationsLabel': 'Expériences',
    'stat.years': '10+',
    'stat.yearsLabel': 'Années d\'excellence',

    // ── Testimonials ───────────────────────────────────────────────────
    'testimonials.title': 'Ce que disent nos voyageurs',
    'testimonials.subtitle':
      'De vrais témoignages de vrais aventuriers qui nous ont confié leurs vacances de rêve.',

    // ── Urgency ────────────────────────────────────────────────────────
    'urgency.title': 'Places limitées',
    'urgency.subtitle':
      'Ne manquez pas nos offres saisonnières exclusives',
    'urgency.cta': 'Réservez votre place maintenant',
    'urgency.spotsLeft': 'Plus que {spots} places pour {month}',

    // ── Contact ────────────────────────────────────────────────────────
    'contact.title': 'Planifiez votre voyage de rêve',
    'contact.subtitle':
      'Remplissez le formulaire et nos experts voyages créeront votre itinéraire idéal',
    'contact.name': 'Votre nom',
    'contact.email': 'Adresse e-mail',
    'contact.message': 'Votre message',
    'contact.submit': 'Envoyer le message',

    // ── Footer ─────────────────────────────────────────────────────────
    'footer.description':
      'Dahab Dream Tour est votre partenaire de confiance pour des voyages de luxe à travers l\'Égypte. Nous créons des séjours inoubliables dans les plus belles destinations du pays.',
    'footer.quickLinks': 'Liens rapides',
    'footer.destinations': 'Destinations',
    'footer.experiences': 'Expériences',
    'footer.support': 'Assistance',
    'footer.legal': 'Mentions légales',
    'footer.rights': 'Tous droits réservés',
    'footer.privacy': 'Politique de confidentialité',
    'footer.terms': "Conditions d'utilisation",
    'footer.cookies': 'Politique de cookies',

    // ── WhatsApp ───────────────────────────────────────────────────────
    'whatsapp.tooltip': 'Discutez avec nous sur WhatsApp',
  },
};

// ── Store Interface ──────────────────────────────────────────────────────────
interface I18nStore {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// ── Zustand Store ────────────────────────────────────────────────────────────
export const useI18n = create<I18nStore>((set, get) => ({
  lang: 'en',
  dir: 'ltr',

  setLang: (lang: Lang) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    set({ lang, dir });
    
    // Update document attributes on the client
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
    }
  },

  t: (key: string, params?: Record<string, string | number>) => {
    const { lang } = get();
    let text = translations[lang]?.[key] ?? translations['en']?.[key] ?? key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }

    return text;
  },
}));
