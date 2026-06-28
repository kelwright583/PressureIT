-- Seed site_settings
insert into site_settings (
  id, hero_eyebrow, hero_line1, hero_line2, hero_line3, hero_subtitle,
  phone, email, whatsapp, facebook_url,
  service_areas, stats
) values (
  true,
  'PREMIUM PROPERTY CARE',
  'RESTORE.',
  'PROTECT.',
  'TRANSFORM.',
  'Durban''s premium property-care specialists since 2010. We restore, protect and transform your most valuable asset.',
  '074 851 8879',
  'sharon@pressure-it.co.za',
  '27748518879',
  'https://www.facebook.com/pressurecleaningdurban/',
  '["Durban North","Umhlanga","Kloof","Hillcrest","Westville","Pinetown","New Germany","Berea","Morningside","Musgrave","Glenwood","Upper Highway","Gillitts","Waterfall","Mount Edgecombe","Ballito","Amanzimtoti","Queensburgh"]',
  '[{"label":"Years Experience","value":2010,"suffix":"+ yrs"},{"label":"Satisfaction","value":100,"suffix":"%"},{"label":"Properties Restored","value":1000,"suffix":"s"}]'
) on conflict (id) do nothing;

-- Seed services
insert into services (slug, title, short_desc, body, icon, features, sort_order) values
(
  'roof-pressure-cleaning',
  'Roof Pressure Cleaning',
  'Professional high-pressure cleaning for residential roofs, barge boards, fascia boards, gutters and waterproofing.',
  'Our expert roof cleaning service removes years of built-up grime, moss, algae and organic growth. We restore your roof to its former glory while protecting the integrity of your tiles and structure. Every job includes barge boards, fascia boards, and gutters — leaving your roofline looking brand new.',
  'Home',
  '["Tile & concrete roofs","Barge boards","Fascia boards","Gutters","Waterproofing"]',
  1
),
(
  'paving-driveway-cleaning',
  'Paving & Driveway Pressure Cleaning',
  'Transform your driveways, patios, courtyards and pool surrounds with professional pressure cleaning.',
  'Dirty, stained paving drags down your entire property''s appearance. Our high-pressure cleaning service lifts oil stains, moss, algae and ground-in dirt from all paved surfaces. The transformation is instant and dramatic.',
  'LayoutGrid',
  '["Driveways","Patios","Courtyards","Pool surrounds","Brick & concrete paving"]',
  2
),
(
  'wall-restoration',
  'Wall Restoration',
  'Exterior wall cleaning — removal of mould, algae, moss, dirt and organic build-up.',
  'Over time, exterior walls accumulate mould, algae, moss and atmospheric grime that makes your property look neglected. Our wall restoration service deep-cleans every surface, revealing the original finish beneath years of build-up.',
  'Building',
  '["Mould removal","Algae removal","Moss treatment","Dirt & grime","Organic build-up"]',
  3
),
(
  'commercial-pressure-cleaning',
  'Commercial Pressure Cleaning',
  'Industrial-grade cleaning for factories, warehouses, shopping centres, petrol stations and bridges.',
  'We handle large-scale commercial pressure cleaning projects across Durban and KwaZulu-Natal. From factory floors to shopping centre walkways, petrol station forecourts to bridge structures — we have the equipment and expertise for any commercial job.',
  'Factory',
  '["Factories","Warehouses","Shopping centres","Petrol stations","Bridges"]',
  4
),
(
  'exterior-painting',
  'Exterior Painting',
  'Complete surface preparation and premium exterior painting for lasting results.',
  'A fresh coat of paint transforms your property — but only if the preparation is right. We combine our pressure-cleaning expertise with premium paints to deliver exterior painting that looks stunning and lasts for years.',
  'Paintbrush',
  '["Surface preparation","Premium paint","Residential exteriors","Lasting finish"]',
  5
),
(
  'commercial-painting-restoration',
  'Commercial Painting & Restoration',
  'Large-scale commercial repaint and restoration projects.',
  'From office blocks to retail centres, we deliver commercial painting and restoration at scale. Our team handles everything from surface prep through to final coat, minimising disruption to your business operations.',
  'Building2',
  '["Office blocks","Retail centres","Industrial facilities","Full restoration","Minimal disruption"]',
  6
),
(
  'roof-painting',
  'Roof Painting',
  'Re-colour and seal cleaned roofs for a complete transformation.',
  'After pressure cleaning, take your roof to the next level with a professional repaint. We apply premium roof coatings that protect against UV, rain and temperature extremes while giving your home a completely refreshed look.',
  'Palette',
  '["Re-colouring","Sealing","UV protection","Weather resistance","Complete transformation"]',
  7
),
(
  'fleet-vehicle-cleaning',
  'Fleet & Vehicle Cleaning',
  'On-site cleaning for cars, trucks and buses — exterior, interior, engine and chassis.',
  'Keep your fleet looking professional with our on-site vehicle cleaning service. We clean everything from company cars to heavy trucks and passenger buses — exterior wash, interior detail, engine bay and chassis. We famously cleaned 70 passenger buses on 24-hour rotation during the 2010 FIFA World Cup.',
  'Truck',
  '["Cars","Trucks","Buses","Exterior wash","Interior detail","Engine bay","Chassis"]',
  8
),
(
  'school-building-cleaning-painting',
  'School Building Pressure Cleaning & Painting',
  'Specialist cleaning and painting services for educational facilities.',
  'Schools deserve to look their best. We provide comprehensive pressure cleaning and painting services for school buildings, working efficiently during holidays to minimise disruption to the academic calendar.',
  'GraduationCap',
  '["School buildings","Pressure cleaning","Painting","Holiday scheduling","Minimal disruption"]',
  9
),
(
  'solar-panel-cleaning',
  'Solar Panel Cleaning',
  'Professional cleaning to maintain peak solar panel efficiency.',
  'Dirty solar panels can lose up to 30% of their efficiency. Our gentle, professional cleaning service removes dust, bird droppings and grime to keep your solar investment performing at its best — without risking damage to the panels.',
  'Sun',
  '["Efficiency restoration","Gentle cleaning","Bird dropping removal","Dust removal","Safe techniques"]',
  10
);

-- Seed sample testimonials
insert into testimonials (name, location, quote, rating, sort_order) values
(
  'James van der Merwe',
  'Umhlanga',
  'Absolutely phenomenal job on our roof and driveway. The before and after difference was incredible — it looked like a brand new property. Sharon and her team were professional, on time, and left everything spotless.',
  5,
  1
),
(
  'Priya Naidoo',
  'Kloof',
  'We''d been putting off cleaning our exterior walls for years. Pressure-It transformed them in a single day. The team was friendly, efficient, and the price was very fair. Highly recommend!',
  5,
  2
),
(
  'Mark Thompson',
  'Hillcrest',
  'Used Pressure-It for our factory floor and loading bay. The commercial team handled the job with zero disruption to our operations. Will definitely use them again.',
  5,
  3
);

-- Sample before_after entry (commented out — Sharon adds real ones)
-- insert into before_after (title, caption, service_slug, location, before_image, after_image, featured)
-- values (
--   'Tile Roof — Hillcrest',
--   'Complete roof restoration including gutters and barge boards',
--   'roof-pressure-cleaning',
--   'Hillcrest',
--   'before-after/sample-before.jpg',
--   'before-after/sample-after.jpg',
--   true
-- );
