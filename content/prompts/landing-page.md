Redesign the landing page of https://3duniversum.com.

Keep the company's real content, products, services, clients, and positioning, but improve the information hierarchy, messaging, navigation, visual identity, and conversion flow.

The result should feel like a credible, established AI and computer-vision company with real technical expertise, not a generic AI startup template.

Follow these design rules strictly.

ANTI-SLOP
- No eyebrow or kicker labels above headings.
- No em dash or en dash anywhere in visible copy.
- No generic badge above the hero headline.
- No centered hero followed by repetitive 3-card sections.
- No same-size icon + heading + paragraph cards repeated across the page.
- No fake dashboard, fake terminal, or fake product mockups made from decorative divs.
- No gradient text.
- No decorative glassmorphism.
- No floating icon pills.
- No meaningless status dots.
- No section labels like 01 / 02 / 03 unless sequencing matters.
- No monospace typography used merely to look technical.
- Do not default to blue/purple AI aesthetics simply because this is an AI company.

DESIGN
- Use strong typography and clear visual hierarchy.
- Give the page a distinctive visual concept grounded in 3D, spatial computing, computer vision, or the company's actual work.
- Use real company imagery, project imagery, or meaningful visual assets whenever possible.
- Vary section compositions instead of repeating one layout pattern.
- Make the primary CTA obvious without turning every section into a CTA.
- Keep the copy concise and specific. Remove generic marketing filler.
- Make desktop and mobile layouts intentionally designed.

MOTION
- Use motion sparingly and purposefully.
- Do not apply the same reveal animation to every section.
- Avoid animating layout properties when smoother alternatives exist.
- Respect prefers-reduced-motion.

MEDIA AND LARGE-SCREEN RULES

- Design intentionally for 1440px, 1728px, 1920px and 2560px wide screens.
- Do not allow content to expand indefinitely with viewport width.
- Use a page/content max-width, normally around 1440–1600px.
- Give large media its own sensible max-width where necessary.
- Do not upscale images simply to fill available space.

IMAGE CROPPING
- Preserve the complete source image by default.
- Informational images must never be cropped:
  floorplans, screenshots, diagrams, faces, product imagery,
  technical visualizations and project outputs.
- Do not use `object-fit: cover` on informational imagery unless
  cropping is explicitly intentional.
- Prefer:
    width: 100%;
    height: auto;
    object-fit: contain;
- Do not combine a forced fixed height with `object-fit: cover`
  simply to make a layout look balanced.
- If an image has an unusual aspect ratio, adapt the layout to
  the image rather than cropping the image to fit the layout.
- Use `object-position` only when an intentional crop has been
  explicitly chosen.

FULL-BLEED
- Full-width/full-bleed imagery must be intentional.
- Do not make an image full bleed merely because the viewport is large.
- Important product and technical imagery should normally live inside
  the site's content grid.

VISUAL QA BEFORE FINISHING
Check every image at:
- 375px mobile
- 768px tablet
- 1440px desktop
- 1920px large desktop
- 2560px ultrawide

Verify:
- no unintended cropping
- no excessive image enlargement
- no blurry upscaling
- no image dominating the page because of viewport size
- important subjects remain fully visible

Before finishing, perform an anti-slop pass. If any part still looks like a recognizable AI-generated SaaS template, redesign that part before presenting the result.

Create the complete responsive landing page as a polished HTML artifact/page that I can preview.
