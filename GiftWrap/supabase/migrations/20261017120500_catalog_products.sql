DO $$
DECLARE
  name_column_type TEXT;
  identity_generation TEXT;
  id_default TEXT;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'poduct_name'
  ) AND NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'product_name'
  ) THEN
    ALTER TABLE public."Product" RENAME COLUMN poduct_name TO product_name;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Product'
      AND column_name = 'product_name'
  ) THEN
    ALTER TABLE public."Product" ADD COLUMN product_name TEXT;
  END IF;

  SELECT data_type INTO name_column_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'Product'
    AND column_name = 'product_name';

  IF name_column_type <> 'text' THEN
    ALTER TABLE public."Product"
      ALTER COLUMN product_name TYPE TEXT USING product_name::TEXT;
  END IF;

  SELECT is_identity, column_default
  INTO identity_generation, id_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'Product'
    AND column_name = 'id';

  IF identity_generation = 'NO' AND id_default IS NULL THEN
    CREATE SEQUENCE IF NOT EXISTS public.product_id_seq;
    ALTER SEQUENCE public.product_id_seq OWNED BY public."Product".id;
    PERFORM setval(
      'public.product_id_seq',
      COALESCE((SELECT MAX(id) FROM public."Product"), 0) + 1,
      FALSE
    );
    ALTER TABLE public."Product"
      ALTER COLUMN id SET DEFAULT nextval('public.product_id_seq');
  END IF;
END
$$;

ALTER TABLE public."Product"
  ADD COLUMN IF NOT EXISTS product_slug TEXT,
  ADD COLUMN IF NOT EXISTS brand TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT 'peach',
  ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS badge TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS product_product_slug_unique
  ON public."Product" (product_slug)
  WHERE product_slug IS NOT NULL;

ALTER TABLE public."Product" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read products" ON public."Product";
CREATE POLICY "Authenticated users can read products"
  ON public."Product"
  FOR SELECT
  TO service_role
  USING (true);

INSERT INTO public."Product"
  (product_slug, product_name, brand, price_cents, category, kind, color, image, badge)
VALUES
  ('sun-drops', 'Sun drops hoops', 'Morrow Studio', 4800, 'adults', 'Jewellery', 'sand', 'photo-1535632066927-ab7c9ab60908', 'Bestseller'),
  ('little-garden', 'The little garden kit', 'Mud & Bloom', 3200, 'kids', 'Creative play', 'lilac', 'photo-1599623560574-39d485900c95', 'Little joy'),
  ('good-dog', 'Good dog day set', 'Sunday Pup', 3800, 'pets', 'For your dog', 'peach', 'photo-1589924691995-400dc9ecc119', 'Pup-approved'),
  ('soft-hours', 'Soft hours candle', 'Sonder Home', 2900, 'adults', 'Little luxuries', 'butter', 'photo-1603006905003-be475563bc59', ''),
  ('story-time', 'A very good story', 'Small Hours Press', 2400, 'kids', 'Books & comics', 'blue', 'photo-1512820790803-83ca734da794', 'For story time'),
  ('cat-nap', 'The window-seat cushion', 'Soft Spot', 5600, 'pets', 'For your cat', 'sage', 'photo-1573865526739-10659fec78a5', 'Cat favorite'),
  ('berry-tumbler', 'Sunday berry tumbler', 'Good Measure', 3400, 'adults', 'Everyday things', 'blue', 'photo-1513558161293-cdaf765edfd7', ''),
  ('playful-puzzle', 'A little bit of everything', 'Happy Campers', 2700, 'kids', 'Games & puzzles', 'peach', 'photo-1606509036992-664d5a9fae69', 'Best for sharing'),
  ('fish-bowl', 'The tiny fin snack pack', 'Little Current', 1800, 'pets', 'For your fish', 'lilac', 'photo-1522069169874-c58ec4b76be5', ''),
  ('garden-after-rain', 'Garden after rain perfume', 'Sunday Scent Co.', 6200, 'adults', 'A little luxury', 'sage', 'photo-1541643600914-78b084683601', 'New favorite'),
  ('golden-hour', 'Golden hour aperitif', 'A little later', 4200, 'adults', 'For the grown-ups', 'butter', 'photo-1514362545857-3bc16c4c7d1b', '18+'),
  ('comic-relief', 'The comic relief collection', 'Small Hours Press', 2200, 'kids', 'Comics & stories', 'blue', 'photo-1519791883288-dc8bd696e667', ''),
  ('tiny-artist', 'Make-believe building set', 'Happy Campers', 3500, 'kids', 'Toys & make-believe', 'lilac', 'photo-1599623560574-39d485900c95', 'Make something'),
  ('nap-club', 'Nap club cloud bed', 'Soft Spot', 6400, 'pets', 'For sleepy pets', 'sage', 'photo-1583337130417-3346a1be7dee', 'Extra cozy'),
  ('tiny-feast', 'The little treat tin', 'Sunday Pup', 1900, 'pets', 'Treats for good pets', 'peach', 'photo-1560743641-3914f2c45636', ''),
  ('parrot-party', 'Parrot party perch set', 'Little Current', 3100, 'pets', 'For your parrot', 'butter', 'photo-1552728089-57bdde30beb3', 'Bird-approved')
ON CONFLICT (product_slug) WHERE product_slug IS NOT NULL DO UPDATE SET
  product_name = EXCLUDED.product_name,
  brand = EXCLUDED.brand,
  price_cents = EXCLUDED.price_cents,
  category = EXCLUDED.category,
  kind = EXCLUDED.kind,
  color = EXCLUDED.color,
  image = EXCLUDED.image,
  badge = EXCLUDED.badge;
