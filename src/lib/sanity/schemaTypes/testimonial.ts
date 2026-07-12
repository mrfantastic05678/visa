import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().max(50),
    }),
    defineField({
      name: "country",
      title: "Country",
      description: "ISO 3166-1 alpha-2 code, used to show the flag (e.g. IN, GB, FR, US, AE)",
      type: "string",
      validation: (rule) => rule.required().length(2).uppercase(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      initialValue: 5,
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "text",
      title: "Testimonial Text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().min(20).max(500),
    }),
    defineField({
      name: "sort_order",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrder",
      by: [{ field: "sort_order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "country" },
  },
});
