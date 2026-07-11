import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Matches the `page` values used across every getPageSeo(page) call in src/app/(public)/*.
const PAGESEO_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  blog: "/blog",
  apply: "/apply",
  careers: "/careers",
  contact: "/contact",
  faq: "/faq",
  services: "/services",
  track: "/track",
  "visa-types": "/visa-types",
};

interface SanityWebhookPayload {
  _type?: string;
  slug?: string;
  page?: string;
}

export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<SanityWebhookPayload>(
    req,
    process.env.SANITY_WEBHOOK_SECRET
  );

  if (!isValidSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }
  if (!body?._type) {
    return NextResponse.json({ error: "Missing _type" }, { status: 400 });
  }

  const paths = new Set<string>();

  switch (body._type) {
    case "visaTypeContent":
      // Price/content shown on the homepage, the listing page, and throughout the apply flow.
      paths.add("/");
      paths.add("/visa-types");
      paths.add("/apply");
      break;
    case "faqItem":
      paths.add("/faq");
      break;
    case "contactDetails":
      paths.add("/contact");
      break;
    case "homepageCopy":
      paths.add("/");
      break;
    case "post":
      paths.add("/blog");
      if (body.slug) paths.add(`/blog/${body.slug}`);
      break;
    case "category":
      paths.add("/blog");
      break;
    case "pageSeo":
      if (body.page && PAGESEO_PATHS[body.page]) paths.add(PAGESEO_PATHS[body.page]);
      break;
    default:
      return NextResponse.json({
        revalidated: false,
        message: `No revalidation mapping for type: ${body._type}`,
      });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, type: body._type, paths: Array.from(paths) });
}

export async function GET() {
  return NextResponse.json({
    webhook: "/api/webhooks/sanity",
    status: process.env.SANITY_WEBHOOK_SECRET ? "configured" : "missing-secret",
  });
}
