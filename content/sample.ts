import type { Deck } from './types'

/**
 * The reference deck: one slide of every archetype, never presented.
 *
 * It is what a new deck starts from, what the schema is documented against,
 * and where the `Slide` component's studio variants come from — so archetype
 * coverage is complete by construction rather than by whatever the current
 * talk happens to use. Adding an archetype means adding a slide here.
 */
const deck = {
  meta: {
    mark: "Sample Deck",
  },
  items: [
    {
      type: "cover",
      id: "cover",
      chapter: "Cover",
      title: "Your **headline** goes here.",
      subtitle: "A short supporting line for your talk.",
    },
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
          points: [
            "Detail",
            "Detail",
            "Detail",
          ],
        },
      ],
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
    {
      type: "quote",
      id: "closing",
      chapter: "Closing",
      quote: "A memorable **closing** line goes here.",
      closer: "Thank you.",
      byline: "Your name — Your talk title.",
    },
  ],
} satisfies Deck

export default deck
