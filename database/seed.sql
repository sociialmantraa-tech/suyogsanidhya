-- Seed Data for Custom Relationship & Intimacy Consultation Website
-- Admin Credentials:
-- Username: admin
-- Password: AdminPassword123! (hash precalculated below)

INSERT INTO `admins` (`id`, `username`, `password_hash`, `email`, `role`) VALUES
(1, 'admin', '$2y$10$j8dF4R44c8k6f.f0d0HlOuJ.YtqJ93npxvCwqN0D8cT/9wO4U0K5G', 'admin@abhayharpale.com', 'admin');

-- Dynamic Pages
INSERT INTO `pages` (`id`, `name`, `slug`, `title`, `meta_description`) VALUES
(1, 'Home', 'home', 'Relationship & Intimacy Advisor | Abhay Harpale', 'Confidential relationship guidance and couples communication consultation with Abhay Harpale. Rebuild trust, connection, and clarity in your partnership.'),
(2, 'About', 'about', 'Meet Abhay Harpale | Relationship & Intimacy Advisor', 'Learn about Abhay Harpale\'s background, relationship principles, and professional, supportive approach to individual and couples connection guidance.'),
(3, 'Services', 'services', 'Relationship & Intimacy Guidance Programs', 'Explore private, confidential consultation programs including individual relationship guidance, couples communication, intimacy connection, and trust rebuilding.'),
(4, 'Consultation', 'consultation', 'Book a Private Consultation | Abhay Harpale', 'Schedule a confidential relationship consultation or clarity mapping session. Available online for individuals and couples globally.'),
(5, 'Blog', 'blog', 'Relationship Advice, Articles & Connection Insights', 'Read professional advice and articles on communication patterns, intimacy building, conflict resolution, and rebuilding trust.');

-- Page Sections
INSERT INTO `page_sections` (`page_id`, `section_key`, `section_name`, `content`) VALUES
(1, 'hero', 'Hero Section', '{
  "badge": "RELATIONSHIP & INTIMACY GUIDANCE",
  "heading_main": "Guidance for Stronger,",
  "heading_highlight": "Healthier Relationships",
  "subheading": "Explore personalized relationship and intimacy guidance designed to help individuals and couples improve communication, deepen emotional connection, rebuild trust, and navigate relationship challenges with greater clarity.",
  "cta_primary_text": "Book a Private Consultation",
  "cta_primary_link": "/book",
  "cta_secondary_text": "Explore Guidance Areas",
  "cta_secondary_link": "/services",
  "trust_indicator": "Private • Respectful • Confidential support for individuals and couples."
}'),
(1, 'stats', 'Trust & Authority Stats', '{
  "items": [
    {"label": "Years of Guidance", "value": "12+"},
    {"label": "Private Consultations", "value": "2,400+"},
    {"label": "Guidance Milestones", "value": "85+"},
    {"label": "Client Progress Rate", "value": "98%"}
  ]
}'),
(1, 'about_preview', 'Expert Introduction Teaser', '{
  "eyebrow": "THE APPROACH",
  "heading": "Building Stronger Relationships Through Understanding & Communication",
  "text_1": "Every relationship faces moments of distance, misunderstanding and change. Abhay Harpale offers thoughtful, confidential guidance to individuals and couples seeking greater clarity, healthier communication and a deeper emotional connection in their relationships.",
  "text_2": "“Meaningful relationships grow when people feel heard, understood and emotionally connected. The right guidance can help create space for honest conversations, renewed trust and positive change.”",
  "cta_text": "Discover My Approach",
  "cta_link": "/about"
}'),
(1, 'final_cta', 'Footer Action CTA', '{
  "heading": "Ready to Build a Stronger Connection?",
  "subheading": "Select a time that suits you best for a private, confidential relationship clarity consultation. Let\'s start the conversation.",
  "cta_text": "Book Clarity Consultation",
  "cta_link": "/book"
}');

-- Service Categories
INSERT INTO `service_categories` (`id`, `name`, `slug`) VALUES
(1, 'Astrology & Psychology', 'astrology-psychology');

-- Services (10 Services Seeding)
INSERT INTO `services` (`id`, `category_id`, `title`, `slug`, `short_description`, `full_description`, `image`, `icon`, `duration`, `price`, `sale_price`, `display_order`, `status`, `seo_title`, `seo_description`) VALUES
(1, 1, 'Couple Compatibility Check', 'couple-compatibility-check', 'A deep, dual-lens analysis blending Vedic astrological synastry with psychological relationship profiling to assess emotional, mental, and relational compatibility.', '<p>Our <strong>Couple Compatibility Check</strong> uniquely synthesizes the timeless wisdom of <strong>Vedic Astrology</strong> with evidence-based <strong>Relationship Psychology</strong> to provide deep clarity on partner dynamics.</p><h4>Astrological Dimensions:</h4><ul><li>Kundali Milan & Guna assessment beyond basic match-making</li><li>Planetary synastry (Moon, Venus, Mars, Jupiter placements)</li><li>Dosha analysis (Manglik, Bhakoot, Nadi) & practical mitigations</li><li>Dasha period timing & planetary cycles impacting marital harmony</li></ul><h4>Psychological Dimensions:</h4><ul><li>Emotional intelligence and attachment style mapping</li><li>Behavioral triggers & cognitive communication habits</li><li>Core value alignment, life vision & mutual expectation balance</li></ul>', 'couples_guidance.webp', 'users', 75, 4500.00, 3800.00, 1, 'published', 'Couple Compatibility Check (Astrology & Psychology) | Abhay Harpale', 'Deep couple compatibility assessment combining Vedic astrology Kundali Milan with psychological relationship profiling.'),
(2, 1, 'Pre-Marriage Counselling', 'pre-marriage-counselling', 'Structured pre-marital guidance integrating astrological timeline forecasts with psychological alignment tools to prepare couples for a thriving, harmonious marriage.', '<p>Step into married life with absolute clarity, emotional security, and spiritual alignment through our integrated <strong>Pre-Marriage Counselling</strong> grounded in <strong>Astrology and Psychology</strong>.</p><h4>Astrological Foundation:</h4><ul><li>Comprehensive marital horoscope alignment & astrological compatibility</li><li>Favorable timeline guidance (Muhurta) & life-cycle transitions</li><li>Karmic and planetary dynamics affecting family life and partnership growth</li></ul><h4>Psychological Framework:</h4><ul><li>Deep-dive on expectations: roles, career, lifestyle, and financial compatibility</li><li>Constructive conflict resolution tools & emotional regulation techniques</li><li>Family integration, healthy boundaries & intimate bonding strategies</li></ul>', 'pre_marriage.webp', 'calendar', 90, 5000.00, 4200.00, 2, 'published', 'Pre-Marriage Counselling (Astrology & Psychology) | Abhay Harpale', 'Comprehensive pre-marital counselling combining Vedic astrology forecasts and relationship psychology frameworks.');

-- Concerns (8 Concerns Seeding)
INSERT INTO `concerns` (`id`, `title`, `slug`, `description`, `status`, `display_order`) VALUES
(1, 'Communication Breakdown', 'communication-breakdown', 'Experiencing frequent arguments, feeling unheard, or finding it difficult to share feelings without friction.', 'published', 1),
(2, 'Intimacy & Connection', 'intimacy-connection', 'Experiencing emotional distance, lack of mutual understanding, or wanting to rebuild closeness.', 'published', 2),
(3, 'Trust & Rebuilding', 'trust-rebuilding', 'Navigating broken agreements, boundary issues, or major changes in the partnership.', 'published', 3),
(4, 'Pre-Marriage Alignment', 'pre-marriage-alignment', 'Engaged couples seeking to align on values, expectations, lifestyle compatibility, and finances.', 'published', 4),
(5, 'Conflict Resolution', 'conflict-resolution', 'Trapped in repeating arguments and seeking tools to resolve disputes constructively.', 'published', 5),
(6, 'Marriage Milestones', 'marriage-milestones', 'Married partners navigating transitional shifts, life decisions, or parental stress.', 'published', 6),
(7, 'Emotional Distance', 'emotional-distance', 'Feeling like roommates, experiencing a decline in active sharing, or seeking connection.', 'published', 7),
(8, 'Relationship Crossroads', 'relationship-crossroads', 'Feeling confused, disconnected, or uncertain about the future direction of your relationship.', 'published', 8);

-- Concern to Service Map
INSERT INTO `concern_service_map` (`concern_id`, `service_id`) VALUES
(1, 1), (1, 2),
(2, 1), (2, 2),
(3, 1), (3, 2),
(4, 1), (4, 2),
(5, 1), (5, 2),
(6, 1), (6, 2),
(7, 1), (7, 2),
(8, 1), (8, 2);

-- Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `setting_group`) VALUES
('site_name', 'Abhay Harpale', 'general'),
('contact_email', 'contact@abhayharpale.com', 'contact'),
('contact_phone', '+91 91529 62255', 'contact'),
('contact_whatsapp', '+91 91529 62255', 'contact'),
('contact_address', 'Studio 402, Signature Towers, Sector 30, Gurugram, India', 'contact'),
('business_hours', 'Monday - Friday: 09:00 AM - 06:00 PM (IST)', 'contact'),
('social_linkedin', 'https://linkedin.com/in/abhayharpale', 'social'),
('social_twitter', 'https://twitter.com/abhayharpale', 'social'),
('social_youtube', 'https://www.youtube.com/@suyogsaanidhya', 'social'),
('razorpay_key_id', 'rzp_test_MckL5gR2T7o8U1', 'payment'),
('tax_rate_percent', '18.00', 'payment'),
('email_smtp_host', 'smtp.mailtrap.io', 'email'),
('email_smtp_port', '2525', 'email'),
('email_smtp_user', 'user_placeholder', 'email'),
('email_smtp_pass', 'pass_placeholder', 'email'),
('email_from_address', 'noreply@abhayharpale.com', 'email'),
('email_from_name', 'Abhay Harpale', 'email');

-- FAQs (8 FAQs Seeding)
INSERT INTO `faqs` (`id`, `question`, `answer`, `display_order`, `status`) VALUES
(1, 'What does a Relationship & Intimacy Advisor do?', 'A Relationship & Intimacy Advisor helps individuals and couples identify emotional dynamics, resolve communication bottlenecks, build trust parameters, and rediscover emotional connection in a supportive, confidential space.', 1, 'published'),
(2, 'Who can book a private consultation?', 'Any individual or couple seeking to improve their communication, navigate relationship decisions, recover from broken trust, or build closer emotional intimacy is welcome to book a session.', 2, 'published'),
(3, 'Can couples attend consultations together?', 'Yes. Joint consultations are highly recommended for communication and partnership rebuilding programs. However, individuals may also attend separate coaching sessions.', 3, 'published'),
(4, 'Are online consultations available?', 'Yes. All relationship and clarity sessions are offered in a secure, confidential online meeting room, accessible to clients globally.', 4, 'published'),
(5, 'Is the consultation confidential?', 'Absolutely. Respect, privacy, and strict confidentiality are the cornerstones of my work. All personal data, session conversations, and email communications are private and secure.', 5, 'published'),
(6, 'What concerns can be discussed?', 'You can discuss communication issues, trust recovery, pre-marriage alignment, emotional distance, conflict habits, intimacy challenges, or decision-making at a relationship crossroads.', 6, 'published'),
(7, 'How long does a consultation last?', 'Sessions range from 60 minutes for individual relationship coaching to 90 minutes for comprehensive couples communication guidance.', 7, 'published'),
(8, 'How do I book and pay for a consultation?', 'Simply navigate to our booking scheduler, select your preferred guidance program, choose an available date and time, fill out your contact details, and complete the payment process securely via Razorpay.', 8, 'published');

-- Testimonials (6 Testimonials Seeding)
INSERT INTO `testimonials` (`id`, `client_name`, `client_avatar`, `client_initials`, `rating`, `service_category`, `testimonial_text`, `video_url`, `display_order`, `is_featured`, `status`) VALUES
(1, 'Marcus Vance', NULL, 'MV', 5, 'Couples Guidance', 'Working with Abhay completely re-established my approach to conflict in my marriage. His guidance is thoughtful, direct, and non-judgmental. We communicate so much more openly now.', NULL, 1, 1, 'published'),
(2, 'Sarah Chen', NULL, 'SC', 5, 'Individual Guidance', 'The relationship clarity consultation provided me with actionable insights that I still use daily. His respectful space made a massive difference in my boundary choices.', NULL, 2, 0, 'published'),
(3, 'Elena Thorne', NULL, 'ET', 5, 'Couples Guidance', 'The couples connection sessions helped us navigate a tough transition after years of distance. Abhay creates a truly safe, confidential space for honest conversations.', NULL, 3, 0, 'published'),
(4, 'Arjun Mehta', NULL, 'AM', 5, 'Individual Guidance', 'Abhay helped me understand my repeating relationship choices. I felt completely respected, and I have gained massive clarity on what emotional connection really means.', NULL, 4, 1, 'published'),
(5, 'Ria & Vikram Shah', NULL, 'RV', 5, 'Couples Guidance', 'The pre-marriage sessions laid down a transparent foundation for our future. We aligned on expectations regarding values, boundaries, and conflict resolution rules.', NULL, 5, 0, 'published'),
(6, 'Nisha Rao', NULL, 'NR', 5, 'Individual Guidance', 'Intimacy and closeness coaching helped me navigate vulnerability blocks. Abhay is patient, supportive, and extremely professional.', NULL, 6, 0, 'published');

-- Blog Categories
INSERT INTO `blog_categories` (`id`, `name`, `slug`) VALUES
(1, 'Relationship Communication', 'communication'),
(2, 'Intimacy & Closeness', 'intimacy');

-- Blogs (6 Blogs Seeding)
INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `featured_image`, `category_id`, `author`, `publish_date`, `status`, `is_featured`, `seo_title`, `seo_description`) VALUES
(1, 'How Better Communication Can Strengthen a Relationship', 'how-better-communication-strengthens-relationship', 'An overview of how active listening, emotional safety, and non-defensive sharing transform daily partnership quality.', '<p>Communication is not just about the words spoken; it is about the emotional safety underneath. When partners feel disconnected, they often fall into repetitive friction that masks deeper vulnerabilities.</p><h2>The Practice of Active Validation</h2><p>Validation does not mean agreement. It means acknowledging your partner\'s reality as real to them. Practicing non-defensive responses creates space for honest discussion without triggering defense mechanisms.</p><h3>Practical Steps:</h3><ul><li>Establish regular check-ins without phones.</li><li>Use \'I\' statements instead of pointing accusations.</li><li>Allow brief pauses during heated moments to self-regulate.</li></ul>', 'communication_blog.webp', 1, 'Abhay Harpale', '2026-07-10 10:00:00', 'published', 1, 'How Better Communication Strengthens Relationships | Abhay Harpale', 'Learn why active listening and validation are key to resolving couples conflicts.'),
(2, 'Understanding Emotional Distance in Relationships', 'understanding-emotional-distance', 'Why partnerships grow distant over time and how couples can recognize the warning signs of silent withdrawal.', '<p>Emotional distance rarely happens overnight. It is the gradual accumulation of unanswered bids for connection. Understanding the difference between healthy independence and relational withdrawal is vital.</p><h2>The Bid for Connection</h2><p>A bid can be a simple question, a sigh, or a look. If a partner regularly turns away instead of turning toward these small bids, distance begins to build. Recognizing these silent cycles early is key to stopping withdrawal patterns.</p>', 'distance_blog.webp', 2, 'Abhay Harpale', '2026-07-09 14:00:00', 'published', 0, 'Understanding Emotional Distance in Partnerships | Abhay Harpale', 'Discover why emotional distance builds and how to recognize withdrawal signals early.'),
(3, 'Rebuilding Trust After Relationship Challenges', 'rebuilding-trust-relationship-challenges', 'Steps to restore emotional security, transparent communication, and boundary parameters after broken agreements.', '<p>Restoring trust is a slow, structural process that requires patient, step-by-step commitment from both partners. It begins with absolute transparency and consistent daily alignment.</p><h2>The Two Sides of Trust Rebuilding</h2><p>For trust to return, one partner must practice emotional accountability while the other works on allowing space for progressive milestones. Clear negotiation of boundaries provides the blueprint for this healing period.</p>', 'trust_blog.webp', 2, 'Abhay Harpale', '2026-07-08 09:00:00', 'published', 0, 'Rebuilding Trust After Partnership Challenges | Abhay Harpale', 'A professional framework to rebuild boundary checkpoints and emotional trust.'),
(4, 'Why Couples Keep Having the Same Arguments', 'why-couples-keep-arguing', 'Unpacking the pursuit-withdrawal cycle and other repeating relationship habits that drain partnership energy.', '<p>Most repeating arguments are not about the topics (e.g. chores, schedules) but the underlying pattern of safety. Recognizing the recurring dance of pursuit and retreat is crucial.</p><h2>Breaking the Loop</h2><p>When one partner pursues aggressively, the other retreats. This loop creates a self-reinforcing trigger. Halting the loop requires one partner to state their soft feelings (e.g., \'I feel lonely\' instead of \'You are never here\').</p>', 'arguing_blog.webp', 1, 'Abhay Harpale', '2026-07-07 11:30:00', 'published', 0, 'Why Couples Repeat the Same Arguments | Abhay Harpale', 'Break the pursuit-withdrawal cycle and resolve repeating relationship loops.'),
(5, 'Emotional Intimacy: What It Means in a Relationship', 'emotional-intimacy-meaning', 'Deepening your connection through shared vulnerability, absolute acceptance, and quiet emotional presence.', '<p>Emotional intimacy is the experience of being fully seen and accepted by your partner. It requires courage to share fears and vulnerability, knowing they will be handled with care.</p><h2>Building Emotional Closeness</h2><p>Intimacy grows when partners practice active interest in each other\'s inner lives. Simple daily check-ins regarding emotional states (rather than logistics) provide the ideal framework.</p>', 'intimacy_blog.webp', 2, 'Abhay Harpale', '2026-07-06 15:00:00', 'published', 0, 'Understanding Emotional Intimacy & Connection | Abhay Harpale', 'Deepen your relationship bond through shared vulnerability and acceptance.'),
(6, 'When to Seek Relationship Guidance', 'when-to-seek-relationship-guidance', 'How to identify when personal coaching or couples connection advising can help resolve crossroads or gridlocks.', '<p>Many couples wait until a relationship is in deep crisis before seeking help. Relational guidance is most effective when used as maintenance—identifying small friction points before they become major blocks.</p><h2>Signs to Look For</h2><p>Key indicators include feeling like roommates, avoiding conversations to prevent arguments, or feeling uncertain about the partnership\'s direction. An objective, supportive consultation provides immediate clarity.</p>', 'guidance_blog.webp', 1, 'Abhay Harpale', '2026-07-05 10:00:00', 'published', 0, 'When to Seek Relationship Consultation | Abhay Harpale', 'Learn how early relationship guidance prevents gridlock and improves communication.');

-- Videos (4 Videos Seeding)
INSERT INTO `videos` (`id`, `title`, `slug`, `category`, `description`, `thumbnail_url`, `video_url`, `duration`, `status`) VALUES
(1, 'Understanding Communication Patterns in Relationships', 'understanding-communication-patterns', 'Relationship Communication', 'An in-depth look at typical loop habits like pursuit-withdrawal and how partners can shift to active validation and listening.', 'video_pattern.webp', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '12:45', 'published'),
(2, 'Building Emotional Connection Between Partners', 'building-emotional-connection', 'Intimacy & Closeness', 'Discussing emotional bids, active empathy, and ways to express care that strengthen connection over time.', 'video_connection.webp', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '15:20', 'published'),
(3, 'Navigating Trust and Relationship Challenges', 'navigating-trust-challenges', 'Trust Rebuilding', 'Key steps to rebuild trust checkpoints, outline transparency, and support hard transitions in a partnership.', 'video_trust.webp', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '18:10', 'published'),
(4, 'Creating Space for Honest Conversations', 'creating-space-conversations', 'Conflict Resolution', 'How to set up private relationship discussions without distractions and address issues with mature honesty.', 'video_conversations.webp', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '10:50', 'published');
