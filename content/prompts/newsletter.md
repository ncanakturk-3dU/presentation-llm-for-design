Redesign the newsletter from the html file. (upload the file)

Create a web newsletter / announcement page.
Use [https://wescan.io/](https://wescan.io/) as the visual source of truth. Inspect and reuse its real brand identity, including colors, typography, logo treatment, imagery style, and overall visual character. Do not copy the website layout.
For the web version, use the actual weScan typography where practical. For the email version, preserve the same typographic character but use a reliable email-safe fallback if the website font is not broadly supported.
Keep the original newsletter content and meaning, but improve hierarchy, readability, visual storytelling, and CTA clarity. The reader should immediately understand what is new, why it matters, and what to do next.
Follow these design rules strictly.
ANTI-SLOP

- No eyebrow or kicker labels above headings.
- No em dash or en dash anywhere in visible copy.
- No generic badges above headlines.
- No repetitive card grid for every piece of content.
- No floating icon pills.
- No decorative glassmorphism.
- No gradient text.
- No meaningless status dots.
- No generic SaaS styling that conflicts with the weScan brand.
- No unnecessary rounded containers around content that can stand on its own.
- No generic marketing filler or invented claims.

DESIGN

- Strong typography and clear information hierarchy.
- Let the release or announcement itself be the visual focus.
- Use the weScan brand colors with restraint.
- Use real product screenshots or supplied visuals instead of fake product mockups.
- Create visual rhythm by varying composition rather than repeating identical sections.
- Keep one obvious primary CTA.
- Make secondary information visually quieter.
- Keep the content concise and easy to scan.
- Make mobile layout intentionally designed, not merely stacked desktop content.

WEB VERSION

- Responsive desktop and mobile layout.
- Use subtle motion only when it improves hierarchy or feedback.
- Animate transform and opacity where possible.
- Avoid transition: all.
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
