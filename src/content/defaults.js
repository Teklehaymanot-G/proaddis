// src/content/defaults.js
// Built-in content. Each top-level key is one section that can be edited in
// the dashboard; a saved section replaces the matching one here.

const defaults = {
  settings: {
    seoTitle: "ProAddis Marketing - Strategic Marketing Solutions in Ethiopia",
    seoDescription:
      "ProAddis Marketing provides data-driven marketing solutions, branding, digital advertising, and traditional marketing services in Ethiopia. Your path to business success.",
    phones: ["+251 (988) 11-88-88", "+251 (912) 17-38-76"],
    emails: ["proaddismarketing@gmail.com", "contact@proaddismarketing.com"],
    addressLines: [
      "Mexico to Kera road, next to Total station",
      "Metamen Building 2nd Floor",
      "Addis Ababa, Ethiopia",
    ],
    hours: [
      "Mon - Fri: 8:30 AM - 5:30 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed",
    ],
    mapUrl:
      "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d4686.315735894789!2d38.74791207639912!3d8.999167625171903!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2set!4v1760343776295!5m2!1sen!2set",
    socials: [
      { platform: "Facebook", url: "#" },
      { platform: "Twitter", url: "#" },
      { platform: "Instagram", url: "#" },
      { platform: "LinkedIn", url: "#" },
      { platform: "YouTube", url: "#" },
    ],
  },

  hero: {
    videoUrl: "/Comp 3.mp4",
  },

  about: {
    eyebrow: "Why We Stand Out",
    // **double asterisks** mark highlighted words
    intro:
      "We don't just create campaigns; we build **lasting partnerships** that drive **measurable growth** and **sustainable success**.",
    quote: "Walking your path to success with data-driven excellence",
    features: [
      {
        icon: "Brain",
        title: "Expertise & Innovation",
        description:
          "Years of experienced personnel with cutting-edge capabilities",
      },
      {
        icon: "Database",
        title: "Data-Driven Strategies",
        description: "Strategic decisions powered by insights and analytics",
      },
      {
        icon: "Users",
        title: "Customer-Centric",
        description: "Tailored services, committed to your satisfaction",
      },
      {
        icon: "Award",
        title: "Quality & Reliability",
        description: "High standards, integrity, and efficiency",
      },
      {
        icon: "Shield",
        title: "Competitive & Sustainable",
        description: "Affordable solutions with long-term support",
      },
      {
        icon: "TrendingUp",
        title: "Complete Service",
        description: "End-to-end marketing solutions for your business",
      },
    ],
    stats: [
      { number: 40, suffix: "+", label: "Projects Completed" },
      { number: 25, suffix: "+", label: "Happy Clients" },
      { number: 2, suffix: "+", label: "Years Experience" },
      { number: 94, suffix: "%", label: "Client Satisfaction" },
    ],
  },

  services: {
    eyebrow: "Marketing Solutions",
    title: "Our Services",
    description: "Powered by Data and Creative Excellence",
    tags: ["Creative", "Innovative", "Data-Driven", "Strategic", "Impactful"],
    items: [
      {
        icon: "Target",
        title: "Product Strategy",
        description:
          "Product positioning, branding, and lifecycle management analysis",
      },
      {
        icon: "TrendingUp",
        title: "Price Strategy",
        description: "Data-driven pricing strategies for maximum profitability",
      },
      {
        icon: "Package",
        title: "Distribution Strategy",
        description: "Traditional and digital channel optimization",
      },
      {
        icon: "Megaphone",
        title: "Promotion Strategy",
        description: "Data-based promotion strategies for brand visibility",
      },
      {
        icon: "Users",
        title: "Digital Advertising",
        description: "Search Engine, Social Media, and Display Advertising",
      },
      {
        icon: "Train",
        title: "Train Advertising",
        description: "Train branding and advertising solutions",
      },
      {
        icon: "Car",
        title: "Car Branding",
        description: "Vehicle branding and fleet advertising",
      },
      {
        icon: "Monitor",
        title: "Digital Screen",
        description: "Digital signage, LED screens, and interactive displays",
      },
      {
        icon: "HeartHandshake",
        title: "Public Relations",
        description:
          "Media relations, corporate events, and reputation management",
      },
      {
        icon: "Palette",
        title: "Branding Services",
        description: "Brand strategy, visual identity, and positioning",
      },
      {
        icon: "Camera",
        title: "Photography & Videography",
        description: "Commercial, corporate, event, and social media content",
      },
      {
        icon: "Code",
        title: "Web Development",
        description: "ERP solutions, SEO, mobile apps, and e-commerce",
      },
    ],
  },

  process: {
    eyebrow: "How We Work",
    title: "Our Process",
    description: "A structured approach to delivering measurable results",
    steps: [
      {
        icon: "Search",
        title: "Discovery & Research",
        description: "Deep dive into your business, market, and competition",
      },
      {
        icon: "Target",
        title: "Strategy Development",
        description: "Data-driven marketing strategy tailored to your goals",
      },
      {
        icon: "Palette",
        title: "Creative Execution",
        description: "Bringing the strategy to life with compelling creative",
      },
      {
        icon: "Rocket",
        title: "Implementation",
        description: "Multi-channel campaign execution and optimization",
      },
      {
        icon: "BarChart",
        title: "Analysis & Reporting",
        description: "Continuous monitoring and performance optimization",
      },
    ],
  },

  clients: {
    eyebrow: "Trusted By",
    title: "Our Valued Clients",
    items: [
      {
        name: "Warka Academy",
        logo: "logos/warka.png",
        category: "Education",
        project: "Complete Branding & Marketing Strategy",
      },
      {
        name: "Abay Esdee Paints",
        logo: "logos/abay.png",
        category: "Manufacturing",
        project: "Distribution Strategy & Digital Advertising",
      },
      {
        name: "Little Limited",
        logo: "logos/little.png",
        category: "Transportation",
        project: "Packaging Design & Traditional Advertising",
      },
      {
        name: "Yonathan BT Furniture",
        logo: "logos/yonathan.jpeg",
        category: "Furniture",
        project: "Brand Identity & Market Positioning",
      },
      {
        name: "Valtra Logistics",
        logo: "logos/VALTRA Logistics.jpg",
        category: "Transportation",
        project: "Brand Identity & Market Positioning",
      },
      {
        name: "Visa",
        logo: "logos/visa.png",
        category: "Finance",
        project: "E-commerce Development & Digital Marketing",
      },
      {
        name: "Bank of Abyssinia",
        logo: "logos/BOA.png",
        category: "Finance",
        project: "E-commerce Development & Digital Marketing",
      },
      {
        name: "Sika Chemical Engineering",
        logo: "logos/sika.jpg",
        category: "Manufacturing",
        project: "E-commerce Development & Digital Marketing",
      },
      {
        name: "Alema Farms",
        logo: "logos/alema farms.jpg",
        category: "Agro Industry",
        project: "E-commerce Development & Digital Marketing",
      },
      {
        name: "E-Mecce Agro",
        logo: "logos/e mecce agro.png",
        category: "Agro Industry",
        project: "E-commerce Development & Digital Marketing",
      },
      {
        name: "Dreamliner Hotel",
        logo: "logos/dreamliner.webp",
        category: "Hotel",
        project: "E-commerce Development & Digital Marketing",
      },
      {
        name: "Meneshaye",
        logo: "logos/meneshaye.png",
        category: "Kids Products",
        project: "Megazine Ad.",
      },
      {
        name: "Doue Dutch Vodka",
        logo: "logos/Doue Dutch Vodka.png",
        category: "Beverages",
        project: "Printing Services",
      },
      {
        name: "Fresco Juice",
        logo: "logos/fresco.jpg",
        category: "Logo Design",
        project: "Logo Design",
      },
    ],
  },

  portfolio: {
    eyebrow: "Our Work",
    title: "Featured Portfolio",
    description:
      "Explore our latest projects across web, design, social media, and marketing.",
    categories: [
      { key: "web", label: "Web Development" },
      { key: "mobile", label: "Mobile Apps" },
      { key: "design", label: "Design" },
      { key: "social", label: "Social Media" },
      { key: "marketing", label: "Marketing" },
    ],
    projects: [
      {
        title: "Abay Paints Social Media Campaign",
        category: "social",
        image: "projects/abay tiktok.png",
        description: "Social media marketing campaign for Abay Paints",
        technologies: ["FaceBook", "TikTok", "Instagram", "Telegram"],
        liveUrl: "https://www.tiktok.com/@abayesdeepaints",
      },
      {
        title: "Warka Academy Social Media Campaign",
        category: "social",
        image: "projects/warka tiktok.png",
        description: "Social media marketing campaign for Warka Academy",
        technologies: ["FaceBook", "TikTok", "Instagram", "Telegram"],
        liveUrl: "https://www.tiktok.com/@warkaacademy",
      },
      {
        title: "Yonatan BT Furniture Social Media",
        category: "social",
        image: "projects/yonathan.png",
        description: "Social media management for Yonatan BT Furniture",
        technologies: ["Instagram", "Facebook", "Content Creation"],
        liveUrl: "https://www.tiktok.com/@yonatanbtfurniture",
      },
      {
        title: "Valtra Logistics",
        category: "web",
        image:
          "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500",
        description: "Website development for Valtra Logistics",
        technologies: ["WordPress"],
        liveUrl: "https://www.valtralogistics.com",
      },
      {
        title: "Valtra Logistics Logo Design",
        category: "design",
        image: "logos/valtra.jpg",
        description: "Logo design for Valtra Logistics",
        technologies: ["Logo", "Brand Color", "Letterhead Design"],
        liveUrl: "https://www.valtralogistics.com",
      },
      {
        title: "Sika Chemical Engineering Signage",
        category: "mobile",
        image: "projects/sika sinage.jpg",
        description: "Signage design for Sika Chemical Engineering",
        technologies: ["Signage", "Lightbox"],
        liveUrl: "https://eth.sika.com/",
      },
      {
        title: "Sika Chemical Engineering Production",
        category: "mobile",
        image: "projects/sika.png",
        description: "Production design for Sika Chemical Engineering",
        technologies: ["Production"],
        liveUrl: "https://eth.sika.com/",
      },
      {
        title: "Tap & Go Campaign",
        category: "marketing",
        image: "projects/tap & go.jpg",
        description: "Tap & Go Campaign for Little, Visa & Bank of Abyssinia",
        technologies: ["Outdoor Screen", "QR Code Scanner", "Analytics"],
        liveUrl: "https://www.little.africa/",
      },
      {
        title: "Warka Academy Website",
        category: "web",
        image: "projects/warka-website.png",
        description: "Website development for Warka Academy",
        technologies: ["WordPress", "Custom Design"],
        liveUrl: "https://www.warkaacademy.com",
      },
      {
        title: "Duratek Importer Website & Branding",
        category: "web",
        image: "projects/duratek-website.png",
        description: "Website development and branding for Duratek Importer",
        technologies: ["WordPress", "Brand Identity", "Logo Design"],
        liveUrl: "https://duratek-importer.com/",
      },
      {
        title: "DTA Sales Marketing Campaign",
        category: "marketing",
        image: "projects/dta.png",
        description: "Sales marketing campaign for DTA",
        technologies: ["Strategy", "Digital Ads", "Lead Generation"],
        liveUrl: "",
      },
    ],
  },

  caseStudies: {
    eyebrow: "Success Stories",
    title: "Our Case Studies",
    description: "Real results from real partnerships.",
    items: [
      {
        client: "Warka Academy Strength Co. Ltd",
        industry: "Education",
        challenge: "Low brand recognition in a competitive education market.",
        solution:
          "Comprehensive branding strategy combined with a targeted digital marketing campaign.",
        image: "/projects/warka-website.png",
        metrics: [
          { label: "Enrollment Growth", value: "+300%" },
          { label: "Brand Awareness", value: "+150%" },
          { label: "ROI", value: "4.5x" },
        ],
        services: ["Brand Strategy", "Digital Advertising", "PR Campaign"],
      },
      {
        client: "Abay Esdee Paints",
        industry: "Manufacturing",
        challenge: "Facing market saturation from international paint brands.",
        solution:
          "Developed a localized branding strategy and expanded the distribution network.",
        image: "/projects/abay tiktok.png",
        metrics: [
          { label: "Sales Growth", value: "+40%" },
          { label: "New Regions", value: "3" },
          { label: "Market Share", value: "+12%" },
        ],
        services: [
          "Distribution Strategy",
          "Brand Positioning",
          "Packaging Design",
        ],
      },
    ],
  },

  testimonials: {
    eyebrow: "Testimonials",
    title: "Client Testimonials",
    description: "What our clients say about working with us",
    items: [
      {
        quote:
          "ProAddis transformed our brand presence in Ethiopia. Their data-driven approach delivered exceptional results.",
        author: "Warka Academy",
        position: "Manager",
      },
      {
        quote:
          "The team's understanding of the local market combined with international standards is remarkable.",
        author: "Abay Esdee Paints",
        position: "CEO",
      },
      {
        quote:
          "From strategy to execution, ProAddis delivered beyond our expectations. True partners in growth.",
        author: "Yonatan BT Furniture",
        position: "Marketing Manager",
      },
    ],
  },

  contact: {
    eyebrow: "Get In Touch",
    title: "Contact Us",
    description: "Let's map your journey to success together.",
    formTitle: "Send us a Message",
    formNote:
      "We'll get back to you within 24 hours. Your information is secure with us.",
    mapTitle: "Visit Our Office",
    mapDescription:
      "Located in the heart of Addis Ababa, easily accessible from major routes",
  },

  footer: {
    ctaTitle: "Ready to walk your path to success?",
    ctaLabel: "Start a project",
    description:
      "Provides strategic marketing solutions through creative, innovative and data-driven insights to help organizations achieve their goals and succeed in Ethiopia's volatile business landscape.",
    serviceLinks: [
      "Product Strategy",
      "Digital Advertising",
      "Branding",
      "Web Development",
    ],
    location: "Addis Ababa, Ethiopia",
    phone: "+251 988 11 8888",
    email: "hello@proaddis.com",
  },
};

export default defaults;
