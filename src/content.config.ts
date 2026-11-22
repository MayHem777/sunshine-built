import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Trades used to group the "Our standard of finish" gallery.
export const TRADES = [
  'Bathrooms & ensuites',
  'Kitchens & joinery',
  'Carpentry & decks',
  'Saunas',
  'Extensions & renovations',
  'Fit-outs',
  'Other',
] as const;

// Case studies. draft: true (the default) keeps an entry out of the built site.
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      jobType: z.string(),
      area: z.string(), // suburb or region only, never a street or house number
      year: z.number().optional(),
      draft: z.boolean().default(true),
      order: z.number().default(99),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      photos: z
        .array(z.object({ image: image(), alt: z.string(), caption: z.string().optional() }))
        .default([]),
    }),
});

// Gallery items. hidden: true keeps a photo out of the built site entirely.
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      alt: z.string().min(3),
      caption: z.string(),
      trade: z.enum(TRADES),
      hidden: z.boolean().default(false),
      order: z.number().default(99),
    }),
});

export const collections = { work, gallery };
