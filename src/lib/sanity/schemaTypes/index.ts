import { type SchemaTypeDefinition } from "sanity";

import { faqItem } from "./faqItem";
import { visaTypeContent } from "./visaTypeContent";
import { contactDetails } from "./contactDetails";
import { pageSeo } from "./pageSeo";
import { author } from "./author";
import { category } from "./category";
import { post } from "./post";
import { testimonial } from "./testimonial";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  contactDetails,
  // Content
  faqItem,
  visaTypeContent,
  testimonial,
  pageSeo,
  // Blog
  author,
  category,
  post,
];
