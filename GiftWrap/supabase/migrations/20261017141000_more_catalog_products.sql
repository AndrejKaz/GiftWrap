INSERT INTO public."Product"
  (product_slug, product_name, brand, price_cents, category, kind, color, image, badge)
VALUES
  ('bedtime-stories', 'Bedtime stories to keep', 'Small Hours Press', 2600, 'kids', 'Books & bedtime reading', 'blue', 'photo-1544947950-fa07a98d237f', 'Little readers'),
  ('bookish-bookmarks', 'Bookish bookmark set', 'Paper Day', 1400, 'adults', 'Books & stationery', 'lilac', 'photo-1512820790803-83ca734da794', 'For book lovers'),
  ('cloud-pup-bed', 'Cloud nine dog bed', 'Sunday Pup', 7200, 'pets', 'Beds for dogs', 'sage', 'photo-1583337130417-3346a1be7dee', 'Extra cozy'),
  ('kitty-cave-bed', 'The cozy cat cave bed', 'Soft Spot', 6800, 'pets', 'Beds for cats', 'peach', 'photo-1514888286974-6c03e2ca1dba', 'Cat approved'),
  ('reading-journal', 'One more chapter journal', 'Paper Day', 2100, 'adults', 'Books & stationery', 'butter', 'photo-1455390582262-044cdead277a', 'For book lovers'),
  ('rainy-day-puzzle', 'Rainy day picture puzzle', 'Happy Campers', 2900, 'kids', 'Games & puzzles', 'blue', 'photo-1606509036992-664d5a9fae69', 'Rainy day favorite'),
  ('little-paintbox', 'Little hands paintbox', 'Mud & Bloom', 2500, 'kids', 'Arts & crafts', 'lilac', 'photo-1513364776144-60967b0f800f', 'Make something'),
  ('morning-mug', 'The slow morning mug', 'Good Measure', 2800, 'adults', 'Mugs & everyday things', 'peach', 'photo-1514228742587-6b1558fcca3d', 'A daily favorite'),
  ('garden-posy', 'A little garden posy', 'Mud & Bloom', 3600, 'adults', 'Flowers & little luxuries', 'sage', 'photo-1490750967868-88aa4486c946', 'Fresh pick'),
  ('walkies-gift-set', 'Ready for walkies set', 'Sunday Pup', 3900, 'pets', 'Dog walks & play', 'butter', 'photo-1548199973-03cce0bbc87b', 'Pup-approved'),
  ('catnip-play-kit', 'Catnip playtime kit', 'Little Current', 2300, 'pets', 'Cat toys & play', 'lilac', 'photo-1573865526739-10659fec78a5', 'For curious cats'),
  ('teddy-storybook', 'Teddy’s tiny storybook', 'Small Hours Press', 1900, 'kids', 'Books & comics', 'butter', 'photo-1512820790803-83ca734da794', 'Bedtime favorite')
ON CONFLICT (product_slug) WHERE product_slug IS NOT NULL DO UPDATE SET
  product_name = EXCLUDED.product_name,
  brand = EXCLUDED.brand,
  price_cents = EXCLUDED.price_cents,
  category = EXCLUDED.category,
  kind = EXCLUDED.kind,
  color = EXCLUDED.color,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
