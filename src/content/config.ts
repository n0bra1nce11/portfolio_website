import { defineCollection, z } from 'astro:content';

const severity = z.enum(['critical', 'high', 'medium', 'low', 'info']);

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Report-style reference used in the document metadata header.
    refId: z.string(),
    version: z.string().default('1.0'),
    date: z.date(),
    classification: z.string().default('Public — Sanitized Work Sample'),
    author: z.string().default('Aayush Shrestha'),
    // Highest severity present, drives the index card badge.
    headlineSeverity: severity.optional(),
    tags: z.array(z.string()).default([]),
    // complete = real content; template = full structure with clearly
    // labelled illustrative example content; stub = section shell only.
    status: z.enum(['complete', 'template', 'stub']).default('stub'),
    order: z.number().default(99),
  }),
});

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Set for "resources" style posts that primarily offer a download.
    resourceUrl: z.string().optional(),
  }),
});

export const collections = { work, writing };
