import type { Deck } from './types'

/**
 * The reference deck: one slide of every archetype, never presented.
 *
 * It is what a new deck starts from, what the schema is documented against,
 * and where the `Slide` component's studio variants come from — so archetype
 * coverage is complete by construction rather than by whatever the current
 * talk happens to use. Adding an archetype means adding a slide here.
 *
 * One archetype has two slides: `process` is written twice, once per `mark`.
 * A variant that changes what the card looks like is a second thing to look
 * at, and a studio param is something you have to think to try — a slide of
 * its own is captured every run whether anyone thought of it or not.
 */
const deck = {
  meta: {
    mark: "Sample Deck",
  },
  parts: [
    {
      id: "intro",
      label: "Intro",
      slides: [
        {
          type: "cover",
          id: "cover",
          chapter: "Cover",
          title: "Your **headline** goes here.",
          subtitle: "A short supporting line for your talk.",
          qr: {
            src: "qr/qr-code.png",
            alt: "QR code for this deck",
            label: "Scan for the deck",
            embed: "https://findexu.github.io/qr-4-seasons/#eyJ1IjoiaHR0cHM6Ly9uY2FuYWt0dXJrLTNkdS5naXRodWIuaW8vcHJlc2VudGF0aW9uLWxsbS1mb3ItZGVzaWduLyIsIm0iOiJjb2RlIiwiYiI6ImJsdXNoIiwidHMiOiJzcHJpbmciLCJ0biI6MX0",
          },
        },
      ],
    },
    {
      id: "part-1",
      label: "Section one",
      slides: [
        {
          type: "divider",
          id: "section-one",
          chapter: "Section one",
          number: "01",
          title: "Section title",
          note: "A short description of what this section covers.",
          list: [
            "First topic",
            "Second topic",
            "Third topic",
            "Fourth topic",
          ],
        },
        {
          type: "keypoints",
          id: "key-points",
          chapter: "Key points",
          kicker: "KEY POINTS",
          title: "Your main **takeaway** in one line.",
          // Prose fields take inline Markdown: `code`, *emphasis*, [links](href),
          // and `**strong**`, which renders as this deck's accent word.
          points: [
            "First point goes here",
            "A point with `inline code` in it",
            "A point with *emphasis* and a [link](https://example.com)",
            "Fourth point goes here",
          ],
        },
        {
          type: "twocolumn",
          id: "before-after",
          chapter: "Before / after",
          kicker: "BEFORE / AFTER",
          title: "From one thing to **another**.",
          note: "A short line comparing the two states.",
          columns: [
            {
              variant: "plain",
              label: "Before",
              caption: "First state",
              note: "Describe the before state here.",
            },
            {
              variant: "brand",
              label: "After",
              caption: "Second state",
              note: "Describe the after state here.",
            },
          ],
        },
        {
          type: "process",
          id: "process",
          chapter: "The process",
          kicker: "THE PROCESS",
          title: "From start to **finish**.",
          steps: [
            {
              n: "1",
              tone: "teal",
              title: "Step one",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
                "Detail",
              ],
            },
            {
              n: "2",
              tone: "blue",
              title: "Step two",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
                "Detail",
              ],
            },
            {
              n: "3",
              tone: "violet",
              title: "Step three",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
                "Detail",
              ],
            },
            {
              n: "4",
              tone: "ink",
              title: "Step four",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
                "Detail",
              ],
            },
          ],
        },
        {
          type: "process",
          id: "process-block",
          chapter: "The process, block marks",
          kicker: "THE PROCESS",
          title: "A flow whose **marks** are the point.",
          // `mark: "block"` draws each step's mark as a tile the height of the
          // card's band instead of the small numbered chip. It is for a flow
          // whose marks are themselves the takeaway — a named framework whose
          // initials the room is meant to leave with.
          mark: "block",
          steps: [
            {
              n: "A",
              tone: "teal",
              title: "Step A",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
              ],
            },
            {
              n: "B",
              tone: "blue",
              title: "Step B",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
              ],
            },
            {
              n: "C",
              tone: "violet",
              title: "Step C",
              subtitle: "What the step is called",
              points: [
                "Detail",
                "Detail",
              ],
            },
          ],
          loop: "what the return is called",
        },
        {
          type: "cards",
          id: "cards",
          chapter: "Parallel cards",
          kicker: "PARALLEL CARDS",
          title: "Three inputs, one **result**.",
          note: "A short line on what the three have in common.",
          // `quoted` wraps every card title in quotation marks, for titles that are
          // things somebody said or typed. Leave it out and a title is plain: a
          // filename, a name, a label. A card's content is `points` or `text`,
          // never both.
          quoted: true,
          cards: [
            {
              title: "The first input, quoted verbatim.",
              subtitle: "Why it fails",
              points: [
                "First detail",
                "Second detail",
              ],
            },
            {
              title: "The second input, quoted verbatim.",
              subtitle: "The AI hears",
              points: [
                "First detail",
              ],
            },
            {
              title: "The third input, quoted verbatim.",
              subtitle: "What you get",
              text: "A card whose content is one paragraph instead of a list — the same three rows, and the rule still lands where the neighbours' rules land.",
            },
          ],
        },
        {
          type: "codeui",
          id: "code-ui",
          chapter: "Code + preview",
          kicker: "CODE + UI",
          title: "Code and its **result**.",
          code: "export function Button({\n  variant = \"primary\",\n  ...props\n}) {\n  return (\n    <button\n      className={variants[variant]}\n      {...props}\n    />\n  )\n}",
          preview: {
            title: "Preview",
            buttons: [
              {
                label: "Primary button",
                variant: "primary",
              },
              {
                label: "Secondary button",
                variant: "secondary",
              },
              {
                label: "Danger button",
                variant: "danger",
              },
            ],
            states: [
              "Default",
              "Hover",
              "Disabled",
            ],
          },
          note: "A short caption describing the code and its preview.",
        },
        {
          type: "commands",
          id: "commands",
          chapter: "Commands",
          kicker: "COMMANDS",
          title: "What you type, and what you **get**.",
          // Every console carries a copy button — a call on a slide is meant to
          // be taken away, not transcribed off a projector. `copy: false` turns
          // them off for calls that are illustrations rather than runnable.
          // `image` is optional: set it and the calls move into a narrow column
          // with the capture beside them. Same `src` rule as `showcase` — a
          // `public/` path with no leading slash — and an image with no `src`
          // draws its alt in a dashed frame, which is what this one does.
          image: {
            alt: "A capture of what the calls put on screen. Drop a file in public/ and point src at it.",
            label: "what the call opens",
          },
          // One row per call. `writes` is optional — leave it out for a command
          // that leaves nothing behind, and the row draws no arrow. `rules` is
          // what holds for the whole set, not for any one row.
          commands: [
            {
              run: "/command init",
              writes: "FILE.md",
              detail: "One line saying what this call is for.",
            },
            {
              run: "/command build <target>",
              writes: "dist/",
              detail: "A second call, with an argument in it.",
            },
            {
              run: "/command check",
              detail: "A call that writes nothing, so the row draws no arrow.",
            },
          ],
          rules: [
            "A rule that holds for every row above — when it is run, or how often.",
            "A second rule: what the set assumes is already true before any of it runs.",
          ],
        },
        {
          type: "commands",
          id: "commands-dense",
          chapter: "Commands, as a sheet",
          kicker: "COMMANDS",
          title: "The same archetype, as a **reference sheet**.",
          // Four calls or more and the blocks go to three columns at one step
          // down in size. Nothing authors that: the count decides it, the way
          // it decides `cards` density.
          commands: [
            { run: "/command init", writes: "FILE.md", detail: "One line per call." },
            { run: "/command document", writes: "OTHER.md", detail: "One line per call." },
            { run: "/command build <target>", writes: "dist/", detail: "A call with an argument in it." },
            { run: "/command check", detail: "A call that writes nothing." },
            { run: "/command watch", detail: "A call that writes nothing." },
            { run: "/command ship", writes: "a release", detail: "The sixth, which fills the second row." },
          ],
          rules: [
            "A rule that holds for every call above.",
          ],
        },
        {
          type: "table",
          id: "table",
          chapter: "Comparison",
          kicker: "COMPARISON",
          title: "A **table** of options.",
          note: "A short caption for the table.",
          columns: [
            "Level",
            "Meaning",
            "Example",
            "Action",
          ],
          rows: [
            {
              severity: "P0",
              tone: "red",
              meaning: "Highest",
              examples: "Example text goes here",
              action: "Do first",
            },
            {
              severity: "P1",
              tone: "orange",
              meaning: "High",
              examples: "Example text goes here",
              action: "Do soon",
            },
            {
              severity: "P2",
              tone: "yellow",
              meaning: "Medium",
              examples: "Example text goes here",
              action: "Consider",
            },
            {
              severity: "P3",
              tone: "muted",
              meaning: "Low",
              examples: "Example text goes here",
              action: "Optional",
            },
          ],
        },
        {
          // The second `table`, and so its own Slide variant: eight rows or
          // more and the matrix drops a step in padding and size. A reference
          // list is not a severity ladder, so every row is `ink` — `muted`
          // renders in --ink-faint and does not reach AA.
          type: "table",
          id: "table-dense",
          chapter: "Reference list",
          kicker: "REFERENCE",
          title: "A **reference** list.",
          note: "A short caption for the table.",
          columns: [
            "Command",
            "What it does",
            "Group",
          ],
          rows: [
            { severity: "first", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Create" },
            { severity: "second", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Evaluate" },
            { severity: "third", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Evaluate" },
            { severity: "fourth", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Refine" },
            { severity: "fifth", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Refine" },
            { severity: "sixth", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Simplify" },
            { severity: "seventh", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Harden" },
            { severity: "eighth", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "Harden" },
            { severity: "ninth", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "System" },
            { severity: "tenth", tone: "ink", meaning: "One line saying what this row does, long enough to wrap.", examples: "System" },
            { severity: "+14 more", tone: "ink", meaning: "The last row, where the rest of the set is linked.", examples: "[the source page](https://example.com)" },
          ],
        },
        {
          type: "callouts",
          id: "callouts",
          chapter: "Callouts",
          kicker: "CALLOUTS",
          title: "A list, and the screen that **proves** it.",
          image: {
            src: "showcase/treeqr-studio.png",
            alt: "Describe the screenshot for a reader who cannot see it. Any file under public/showcase works.",
            label: "What the picture is",
          },
          points: [
            { text: "A claim the picture can settle", pin: { x: 30, y: 34 } },
            { text: "Another one, somewhere else on it", pin: { x: 68, y: 55 } },
            { text: "A third, further down", pin: { x: 45, y: 78 } },
            { text: "A claim with no pin: nothing to point at in a still" },
          ],
          status: "One line about what the picture is, or is not.",
        },
        {
          type: "showcase",
          id: "showcase",
          chapter: "Showcase",
          kicker: "SHOWCASE",
          title: "A real screen, not a **mockup**.",
          note: "A short line about what the screenshots show and why they are here.",
          images: [
            {
              src: "showcase/treeqr-studio.png",
              alt: "Describe the screenshot for a reader who cannot see it. This one stands in: any file under public/showcase works.",
              label: "First state",
            },
            {
              alt: "[second screenshot goes here]",
              label: "Second state",
            },
          ],
          status: "Shipped",
          link: "example.com/the-thing",
        },
      ],
    },
    {
      id: "closing",
      label: "Closing",
      slides: [
        {
          type: "quote",
          id: "closing",
          chapter: "Closing",
          quote: "A memorable **closing** line goes here.",
          closer: "Thank you.",
          byline: "Your name — Your talk title.",
        },
      ],
    },
    {
      id: "bonus",
      label: "Bonus",
      slides: [
        {
          type: "promptrun",
          id: "promptrun",
          chapter: "Prompt and results",
          title: "One prompt, two **results**.",
          note: "The prompt on the left, what each model returned beside it. The prompt itself lives in content/prompts/ — this slide names the file, it does not repeat the text.",
          prompt: {
            label: "The prompt",
            source: "sample.md",
            detail: "Copy it, change the URL, run it yourself.",
            href: "https://example.com",
            hrefLabel: "the page it redesigns",
          },
          results: [
            {
              label: "Model one",
              detail: "How it was run",
              image: { alt: "A still of what the first model returned" },
              href: "results/sample-one.html",
            },
            {
              label: "Model two",
              detail: "How it was run",
              image: { alt: "A still of what the second model returned" },
              href: "results/sample-two.html",
            },
          ],
        },
      ],
    },
  ],
} satisfies Deck

export default deck
