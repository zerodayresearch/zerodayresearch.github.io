import { defineCollection, z } from 'astro:content';

const advisoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.date(),
    cveId: z.string().optional(),
    vendor: z.string().optional(),
    affectedProduct: z.string().optional(),
    severity: z.enum(['Critical', 'High', 'Medium', 'Low']).optional(),
    patchStatus: z.enum(['Patched', 'Unpatched', 'Partial']).optional(),
    patchDate: z.date().optional(),
    discoveryDate: z.date().optional(),
  }),
});

export const collections = {
  advisories: advisoriesCollection,
};