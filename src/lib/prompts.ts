/**
 * The prompts a `promptrun` slide shows, read from `content/prompts/*.md`.
 *
 * A prompt on a slide is a prompt somebody will paste into a chat, so the file
 * is the one copy of it: the pane renders that text, the copy button hands over
 * that text, and there is no second version in the deck module to drift from
 * it. Editing the prompt is editing the `.md`.
 *
 * Bundled with `?raw` rather than fetched from `public/`. A fetch would resolve
 * after the first paint, which makes a designlab capture a race between the
 * screenshot and the network, and it would leave the prompt out of the copy
 * button until it landed. Eager because there are a handful of them and they
 * are a few kilobytes each.
 */
const files = import.meta.glob('../../content/prompts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const byName = new Map(
  Object.entries(files).map(([path, text]) => [path.split('/').pop() as string, text]),
)

/**
 * The text of `content/prompts/<name>`, or `null` when nothing is there.
 *
 * Null rather than a throw: a deck naming a prompt that does not exist should
 * say so on the slide, the way an image with no `src` draws its alt text, not
 * take the whole deck down mid-talk.
 */
export function promptText(name: string): string | null {
  return byName.get(name) ?? null
}
