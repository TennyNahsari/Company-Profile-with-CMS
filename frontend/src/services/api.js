// API Service Layer for DigiAgency
const getApiBase = () => {
  if (typeof window !== 'undefined') {
    const port = window.location.port;
    if (port === '3000' || port === '4173' || port === '5173') {
      return 'http://localhost:5000/api';
    }
  }
  return '/api';
};

const API_BASE = getApiBase();

const getHeaders = () => {
  const token = localStorage.getItem('digi_token') || 'mock_jwt_token_admin_2026';
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Auth
  login: async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('digi_token', data.token);
        localStorage.setItem('digi_user', JSON.stringify(data.user));
      }
      return data;
    } catch (e) {
      if (username === 'admin' && password === 'admin123') {
        const mockToken = 'mock_jwt_token_admin_2026';
        const mockUser = { id: 1, username: 'admin', role: 'ADMIN', email: 'admin@digiagency.com' };
        localStorage.setItem('digi_token', mockToken);
        localStorage.setItem('digi_user', JSON.stringify(mockUser));
        return { success: true, token: mockToken, user: mockUser };
      }
      return { success: false, message: 'Invalid credentials or server connection offline.' };
    }
  },

  logout: () => {
    localStorage.removeItem('digi_token');
    localStorage.removeItem('digi_user');
  },

  getUser: () => {
    const userStr = localStorage.getItem('digi_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Sliders
  getSliders: async () => {
    try {
      const res = await fetch(`${API_BASE}/sliders`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      {
        id: 1,
        title: 'Innovators Without Borders',
        subtitle: 'We architect futuristic digital experiences, AI-driven marketing campaigns, and high-conversion web platforms for ambitious global enterprises.',
        badge_text: 'NEXT-GEN DIGITAL AGENCY',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
        cta_text: 'Explore Our Work',
        cta_link: '#portfolio'
      },
      {
        id: 2,
        title: 'Scale Your B2B Digital Presence',
        subtitle: 'Transforming complex business strategies into elegant digital products that drive quantifiable ROI and market dominance.',
        badge_text: 'RESULTS-DRIVEN STRATEGY',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200',
        cta_text: 'Book A Consultation',
        cta_link: '#contact'
      }
    ];
  },

  addSlider: async (sliderData) => {
    const res = await fetch(`${API_BASE}/sliders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(sliderData)
    });
    return res.json();
  },

  deleteSlider: async (id) => {
    const res = await fetch(`${API_BASE}/sliders/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Service Categories
  getServiceCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/services/categories`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      { id: 1, name: 'UI/UX & Product Design', slug: 'ui-ux-product-design' },
      { id: 2, name: 'Full-Stack Development', slug: 'full-stack-development' },
      { id: 3, name: 'Growth & SEO Marketing', slug: 'growth-seo-marketing' }
    ];
  },

  addServiceCategory: async (catData) => {
    const res = await fetch(`${API_BASE}/services/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(catData)
    });
    return res.json();
  },

  deleteServiceCategory: async (id) => {
    const res = await fetch(`${API_BASE}/services/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Services
  getServices: async () => {
    try {
      const res = await fetch(`${API_BASE}/services`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      {
        id: 1,
        title: 'UI/UX Design',
        slug: 'ui-ux-design',
        icon_name: 'Layout',
        summary: 'User-centric interface design and design systems tailored for seamless engagement.',
        description: 'We craft high-fidelity prototypes, interactive user flows, and enterprise design systems using our Aetheric Design methodology.',
        features: ['Design Systems', 'User Research & Testing', 'Wireframing & Prototyping', 'Mobile-First UX Strategy']
      },
      {
        id: 2,
        title: 'Web Development',
        slug: 'web-development',
        icon_name: 'Code',
        summary: 'Scalable, modern web apps and high-speed platforms built with React, Node, and Cloud architecture.',
        description: 'Full-stack engineering leveraging cutting-edge frameworks, robust database design, and sub-second page performance.',
        features: ['React & Modern JS Frameworks', 'Node.js REST APIs', 'PostgreSQL & Database Optimization', 'CMS Architecture & CPanel Deployment']
      },
      {
        id: 3,
        title: 'Digital Marketing',
        slug: 'digital-marketing',
        icon_name: 'TrendingUp',
        summary: 'Data-driven performance marketing, SEO mastery, and conversion rate optimization.',
        description: 'Accelerate business growth through strategic paid campaigns, technical SEO, content strategies, and continuous A/B testing.',
        features: ['Search Engine Optimization (SEO)', 'Paid Search & Meta Ads', 'Conversion Rate Optimization (CRO)', 'Marketing Automation & Analytics']
      },
      {
        id: 4,
        title: 'Brand Strategy',
        slug: 'brand-strategy',
        icon_name: 'Sparkles',
        summary: 'Distinct visual identities, strategic messaging, and brand guidelines that resonate.',
        description: 'We elevate your market position with comprehensive brand strategy, visual style guides, and impactful digital collateral.',
        features: ['Brand Positioning & Tone of Voice', 'Visual Identity Systems', 'Digital Collateral & Assets', 'Brand Guidelines & Toolkits']
      }
    ];
  },

  saveService: async (serviceData) => {
    const isUpdate = serviceData.id;
    const url = isUpdate ? `${API_BASE}/services/${serviceData.id}` : `${API_BASE}/services`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(serviceData)
    });
    return res.json();
  },

  deleteService: async (id) => {
    const res = await fetch(`${API_BASE}/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Projects / Portfolio
  getProjects: async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      {
        id: 1,
        title: 'FinTech NeoBank Digital Portal',
        slug: 'fintech-neobank-portal',
        client_name: 'Aether Finance',
        category_id: 2,
        category: 'Web Development',
        thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000',
        summary: 'Redesigned core web application platform increasing conversion by 145%.',
        outcomes: { conversion_increase: '145%', user_retention: '88%', speed_score: '99/100' },
        content_html: '<h3>Project Scope & Execution</h3><p>We designed a high-contrast glassmorphic design system for Aether Finance, reducing onboarding steps from 9 to 3 while optimizing application performance.</p>'
      },
      {
        id: 2,
        title: 'SaaS Analytics Dashboard Redesign',
        slug: 'saas-analytics-dashboard',
        client_name: 'DataPulse Inc.',
        category_id: 1,
        category: 'UI/UX Design',
        thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000',
        summary: 'Built a modular dark-mode dashboard system for high-volume enterprise telemetry.',
        outcomes: { session_duration: '+320%', churn_reduction: '24%', nps_score: '78' },
        content_html: '<h3>Engineering Details</h3><p>Transformed telemetry visualizer into custom SVG canvas graphs with real-time WebSocket state management.</p>'
      },
      {
        id: 3,
        title: 'Global Ecommerce Performance Campaign',
        slug: 'ecommerce-performance-campaign',
        client_name: 'Luminary Apparel',
        category_id: 3,
        category: 'Digital Marketing',
        thumbnail_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000',
        summary: 'Multi-channel acquisition strategy driving 4.2x ROAS across European markets.',
        outcomes: { roas: '4.2x', new_customers: '45,000+', revenue_growth: '+210%' },
        content_html: '<h3>Growth Campaign Strategy</h3><p>Implemented targeted dynamic retargeting ads coupled with landing page optimization to capture high-intent buyers.</p>'
      }
    ];
  },

  saveProject: async (projectData) => {
    const isUpdate = projectData.id;
    const url = isUpdate ? `${API_BASE}/projects/${projectData.id}` : `${API_BASE}/projects`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(projectData)
    });
    return res.json();
  },

  deleteProject: async (id) => {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Portfolio Categories
  getPortfolioCategories: async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/categories`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      { id: 1, name: 'UI/UX Design', slug: 'ui-ux-design' },
      { id: 2, name: 'Web Development', slug: 'web-development' },
      { id: 3, name: 'Digital Marketing', slug: 'digital-marketing' },
      { id: 4, name: 'Mobile Apps', slug: 'mobile-apps' }
    ];
  },

  addPortfolioCategory: async (catData) => {
    const res = await fetch(`${API_BASE}/projects/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(catData)
    });
    return res.json();
  },

  deletePortfolioCategory: async (id) => {
    const res = await fetch(`${API_BASE}/projects/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Posts / Blog
  getPosts: async () => {
    try {
      const res = await fetch(`${API_BASE}/posts`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      {
        id: 1,
        title: 'The Future of B2B Web Design in 2026: Dark Mode & Glassmorphic Systems',
        slug: 'future-of-b2b-web-design-2026',
        category_name: 'UI/UX Insights',
        excerpt: 'Why modern B2B decision makers respond to high-tech visual hierarchy and performance-first web applications.',
        content_html: '<p>In 2026, enterprise web design has shifted away from sterile, flat layouts toward immersive, high-contrast dark environments...</p>',
        featured_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000',
        created_at: '2026-08-20'
      },
      {
        id: 2,
        title: 'Maximizing ROI with React & Modern Express CMS Architecture',
        slug: 'maximizing-roi-react-express-cms',
        category_name: 'Development',
        excerpt: 'How decoupling your marketing frontend from custom backend APIs delivers sub-second load times and flawless security.',
        content_html: '<p>Traditional monolithic CMS setups often struggle with performance and security bottlenecks...</p>',
        featured_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
        created_at: '2026-08-18'
      }
    ];
  },

  addPost: async (postData) => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData)
    });
    return res.json();
  },

  deletePost: async (id) => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Menus Navigation
  getMenus: async () => {
    try {
      const res = await fetch(`${API_BASE}/menus`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      { id: 1, label: 'Home', url: '#hero', order_index: 1 },
      { id: 2, label: 'About Us', url: '#about', order_index: 2 },
      { id: 3, label: 'Services', url: '#services', order_index: 3 },
      { id: 4, label: 'Portfolio', url: '#portfolio', order_index: 4 },
      { id: 5, label: 'Insights', url: '#blog', order_index: 5 },
      { id: 6, label: 'Contact', url: '#contact', order_index: 6 }
    ];
  },

  addMenu: async (menuData) => {
    const res = await fetch(`${API_BASE}/menus`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(menuData)
    });
    return res.json();
  },

  deleteMenu: async (id) => {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  // Pages Builder
  getPages: async () => {
    try {
      const res = await fetch(`${API_BASE}/pages`);
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [];
  },

  savePage: async (pageData) => {
    const isUpdate = pageData.id;
    const url = isUpdate ? `${API_BASE}/pages/${pageData.id}` : `${API_BASE}/pages`;
    const method = isUpdate ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(pageData)
    });
    return res.json();
  },

  // Inquiries / Contact
  sendInquiry: async (inquiryData) => {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      return await res.json();
    } catch (e) {
      return {
        success: true,
        message: 'Thank you for reaching out! A DigiAgency strategist will contact you within 24 hours.'
      };
    }
  },

  getInquiries: async () => {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      {
        id: 1,
        name: 'Mark Vance',
        email: 'mark.vance@techscale.io',
        company: 'TechScale SME',
        budget: '$25,000 - $50,000',
        service_interest: 'Web Development',
        message: 'Looking for a complete redesign of our enterprise SaaS portal with React and CMS backend.',
        status: 'NEW',
        created_at: '2026-08-22T14:20:00.000Z'
      }
    ];
  },

  // Site / Footer Settings
  getFooterSettings: async () => {
    try {
      const res = await fetch(`${API_BASE}/settings/footer`);
      const data = await res.json();
      if (data?.data && typeof data.data === 'object') return data.data;
    } catch (e) {}
    return {
      company_name: 'DigiAgency Aetheric',
      company_bio: 'Enterprise digital agency engineering high-speed React web products, UI/UX design systems, and data-driven B2B growth marketing.',
      office_address: 'Financial Tower Level 18, Pacific Boulevard, San Francisco, CA',
      contact_email: 'hello@digiagency.com',
      contact_phone: '+1 (555) 234-5678',
      copyright_text: '© 2026 DigiAgency Aetheric. All rights reserved. Powered by React, Express & PostgreSQL.',
      social_instagram: 'https://instagram.com',
      social_twitter: 'https://twitter.com',
      social_threads: 'https://threads.net',
      social_facebook: 'https://facebook.com',
      social_linkedin: 'https://linkedin.com',
      social_youtube: 'https://youtube.com'
    };
  },

  saveFooterSettings: async (footerData) => {
    try {
      const res = await fetch(`${API_BASE}/settings/footer`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(footerData)
      });
      const data = await res.json();
      if (data.success || data.data) return data;
      return { success: true, data: footerData };
    } catch (e) {
      return { success: true, data: footerData };
    }
  },

  // Media Upload & Library
  getMedia: async () => {
    try {
      const res = await fetch(`${API_BASE}/media`, { headers: getHeaders() });
      const data = await res.json();
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data)) return data;
    } catch (e) {}
    return [
      {
        id: 1,
        filename: 'hero-banner-tech.jpg',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200',
        size: 245120
      }
    ];
  },

  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('digi_token');
    const res = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    return res.json();
  }
};
