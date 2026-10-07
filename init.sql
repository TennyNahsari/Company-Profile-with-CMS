-- ===================================================
-- DigiAgency PostgreSQL Complete Database Init Script
-- File: init.sql
-- Description: Drops old tables (if any), creates all required tables,
--              indexes, sequences, and populates initial seed data
--              including Admin user for login.
-- ===================================================

-- 1. Drop existing tables if re-initializing (Clean Reset)
DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
DROP TABLE IF EXISTS pages CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS sliders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS portfolio_categories CASCADE;
DROP TABLE IF EXISTS service_categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 2. Site Settings Table (Footer & Global Configs)
CREATE TABLE site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (key, value) VALUES (
    'footer',
    '{
        "company_name": "DigiAgency Aetheric",
        "company_bio": "Enterprise digital agency engineering high-speed React web products, UI/UX design systems, and data-driven B2B growth marketing.",
        "office_address": "Financial Tower Level 18, Pacific Boulevard, San Francisco, CA",
        "contact_email": "hello@digiagency.com",
        "contact_phone": "+1 (555) 234-5678",
        "copyright_text": "© 2026 DigiAgency Aetheric. All rights reserved. Powered by React, Express & PostgreSQL.",
        "social_linkedin": "https://linkedin.com",
        "social_twitter": "https://twitter.com",
        "social_github": "https://github.com",
        "social_dribbble": "https://dribbble.com"
    }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- 3. Service Categories Table
CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

INSERT INTO service_categories (id, name, slug, description, order_index) VALUES
(1, 'UI/UX & Product Design', 'ui-ux-product-design', 'Custom design systems, wireframing, and interactive UI prototyping', 1),
(2, 'Full-Stack Development', 'full-stack-development', 'High-performance React, Express, and PostgreSQL cloud architecture', 2),
(3, 'Growth & SEO Marketing', 'growth-seo-marketing', 'Data-driven search engine optimization and B2B conversion marketing', 3),
(4, 'Brand Strategy', 'brand-strategy-category', 'Enterprise brand positioning and corporate visual identity', 4)
ON CONFLICT (id) DO NOTHING;
SELECT setval('service_categories_id_seq', COALESCE((SELECT MAX(id) FROM service_categories), 1));

-- 4. Portfolio Categories Table
CREATE TABLE portfolio_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

INSERT INTO portfolio_categories (id, name, slug, description, order_index) VALUES
(1, 'UI/UX Design', 'ui-ux-design', 'User experience and interface engineering', 1),
(2, 'Web Development', 'web-development', 'React & Node web applications', 2),
(3, 'Digital Marketing', 'digital-marketing', 'Growth campaigns and SEO strategy', 3),
(4, 'Mobile Apps', 'mobile-apps', 'Native & cross-platform applications', 4)
ON CONFLICT (id) DO NOTHING;
SELECT setval('portfolio_categories_id_seq', COALESCE((SELECT MAX(id) FROM portfolio_categories), 1));

-- 5. Users Table (Admin Credentials)
-- Default Login Credentials:
-- Username: admin (atau Email: admin@digiagency.com)
-- Password: admin123
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, username, email, password_hash, role) 
VALUES (1, 'admin', 'admin@digiagency.com', '$2a$10$xQhz/hke83Q5FxPG356Jsu9kVSRK3kHpwMQAWU.3FT99f8lvMGaem', 'ADMIN')
ON CONFLICT (username) DO NOTHING;
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 1));

-- 6. Hero Sliders Table
CREATE TABLE sliders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    badge_text VARCHAR(100),
    image_url TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    order_index INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sliders (id, title, subtitle, badge_text, image_url, cta_text, cta_link, order_index, is_active) VALUES
(1, 'Aetheric Digital Engineering', 'We engineer high-speed React web applications, intuitive UI/UX design systems, and conversion-focused growth marketing.', 'NEXT-GEN AGENCY', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200', 'Explore Capabilities', '#services', 1, true),
(2, 'Enterprise Web Architecture', 'Building resilient Node & Express cloud microservices backends powered by PostgreSQL enterprise databases.', 'REACT & NODE EXCELLENCE', 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200', 'View Case Studies', '#portfolio', 2, true)
ON CONFLICT (id) DO NOTHING;
SELECT setval('sliders_id_seq', COALESCE((SELECT MAX(id) FROM sliders), 1));

-- 7. Services Table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category_id INT REFERENCES service_categories(id) ON DELETE SET NULL,
    icon_name VARCHAR(100),
    thumbnail_url TEXT,
    summary TEXT,
    description TEXT,
    features JSONB,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO services (id, title, slug, category_id, icon_name, thumbnail_url, summary, description, features, order_index) VALUES
(1, 'UI/UX Design Systems', 'ui-ux-design-systems', 1, 'Layout', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000', 'Crafting intuitive user interfaces, interactive wireframes, and scalable brand design tokens for web and mobile platforms.', '<h2>Designing Experiences That Convert</h2><p>Our design team combines human-centered research with pixel-perfect visual design to create user interfaces that drive engagement and retention.</p>', '["User Research & Journey Mapping", "Interactive Prototyping in Figma", "Component Design System Tokens", "Accessibility & Usability Testing"]'::jsonb, 1),
(2, 'React & Node Web Apps', 'react-node-web-apps', 2, 'Code', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000', 'Full-stack application development using modern React 18, Vite, Express.js microservices, and PostgreSQL database architecture.', '<h2>High-Speed Technical Architecture</h2><p>We build ultra-fast, search engine optimized web platforms that handle enterprise traffic with ease.</p>', '["React 18 & Vite SPA Architecture", "Node & Express.js REST APIs", "PostgreSQL Database Design", "Production CPanel & Cloud Deployment"]'::jsonb, 2),
(3, 'SEO & Digital Growth Marketing', 'seo-digital-growth-marketing', 3, 'TrendingUp', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000', 'Data-driven search engine optimization, technical site audits, and targeted B2B client acquisition campaigns.', '<h2>Dominate Search Engine Rankings</h2><p>Increase your organic reach with our technical SEO audits, keyword research, and conversion rate optimization (CRO) strategies.</p>', '["Technical SEO & Core Web Vitals Audit", "Keyword Strategy & Content Architecture", "Conversion Rate Optimization (CRO)", "Analytics & Performance Tracking"]'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;
SELECT setval('services_id_seq', COALESCE((SELECT MAX(id) FROM services), 1));

-- 8. Portfolio Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    client_name VARCHAR(200),
    category_id INT REFERENCES portfolio_categories(id) ON DELETE SET NULL,
    category VARCHAR(100),
    thumbnail_url TEXT,
    summary TEXT,
    outcomes JSONB,
    content_html TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (id, title, slug, client_name, category_id, category, thumbnail_url, summary, outcomes, content_html, featured) VALUES
(1, 'Global Ecommerce Performance Campaign', 'global-ecommerce-performance-campaign', 'Luminary Apparel', 3, 'Digital Marketing', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000', 'Multi-channel acquisition strategy driving 4.2x ROAS across European markets.', '{"conversion_lift": "+140%", "revenue_growth": "$3.2M", "roas_multiplier": "4.2x"}'::jsonb, '<h2>Overview & Challenge</h2><p>Luminary Apparel needed a scalable growth strategy to expand into European markets while maintaining strong profit margins.</p><h2>Our Strategy</h2><p>We deployed targeted performance marketing, CRO optimization, and localized landing pages.</p>', true),
(2, 'Fintech Neobank Web Portal', 'fintech-neobank-portal', 'Aura Financial', 2, 'Web Development', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1000', 'High-security React dashboard and customer onboarding portal handling $50M+ monthly volume.', '{"active_users": "250K+", "latency_reduction": "-65%", "security_compliance": "SOC-2"}'::jsonb, '<h2>Technical Architecture</h2><p>Built on React, Node.js, and encrypted PostgreSQL infrastructure to deliver sub-second response times.</p>', true)
ON CONFLICT (id) DO NOTHING;
SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1));

-- 9. Blog Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO categories (id, name, slug) VALUES
(1, 'Thought Leadership', 'thought-leadership'),
(2, 'Web Engineering', 'web-engineering'),
(3, 'Growth Marketing', 'growth-marketing')
ON CONFLICT (id) DO NOTHING;
SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1));

-- 10. Posts Table (Blog Articles)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    excerpt TEXT,
    content_html TEXT,
    featured_image TEXT,
    meta_title VARCHAR(255),
    meta_desc TEXT,
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (id, title, slug, category_id, excerpt, content_html, featured_image, meta_title, meta_desc, status) VALUES
(1, 'The Future of B2B Web Design in 2026', 'future-of-b2b-web-design-2026', 1, 'Discover how modern React applications, micro-animations, and AI-driven personalization are reshaping B2B client acquisition.', '<h2>The Shift Toward Performance-First Design</h2><p>In 2026, enterprise clients demand lightning-fast web experiences. Slow load times directly hurt conversion rates and Google search rankings.</p>', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000', 'The Future of B2B Web Design in 2026 | DigiAgency', 'How React and performance-first design transform B2B web applications.', 'PUBLISHED')
ON CONFLICT (id) DO NOTHING;
SELECT setval('posts_id_seq', COALESCE((SELECT MAX(id) FROM posts), 1));

-- 11. Pages Table (Page Builder)
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content_blocks JSONB,
    custom_html_css TEXT,
    meta_seo JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Header Menus Table
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    order_index INT DEFAULT 0,
    is_external BOOLEAN DEFAULT FALSE
);

INSERT INTO menus (id, label, url, order_index, is_external) VALUES
(1, 'Home', '#hero', 1, false),
(2, 'About Us', '#about', 2, false),
(3, 'Services', '#services', 3, false),
(4, 'Portfolio', '#portfolio', 4, false),
(5, 'Insights', '#blog', 5, false),
(6, 'Contact', '#contact', 6, false)
ON CONFLICT (id) DO NOTHING;
SELECT setval('menus_id_seq', COALESCE((SELECT MAX(id) FROM menus), 1));

-- 13. Media Library Table
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath TEXT NOT NULL,
    mimetype VARCHAR(100),
    size BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Inquiries Table (Leads Inbox)
CREATE TABLE inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(200),
    budget VARCHAR(100),
    service_interest VARCHAR(100),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
