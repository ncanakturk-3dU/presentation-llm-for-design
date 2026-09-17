import Slide, { itemTheme } from '../../slides/Slides'
import type { SlideItem } from '../../../content/types'
import './Slide.css'

/**
 * The slide archetypes, on their own stage.
 *
 * The archetypes live in `src/slides/Slides.tsx` and the deck imports them from
 * there; designlab only discovers `src/components/<Name>/<Name>.jsx`, so this
 * is what puts all eight on the component stage.
 *
 * It adds one thing the deck would otherwise provide: `data-theme`. Half the
 * archetypes are dark (`cover`, `keypoints`) and read their ink and ground off
 * that attribute, which on the deck sits on the `.deck` shell. There is no
 * shell here, so the same `itemTheme(item)` the deck calls is applied to the
 * stage root — the same value from the same function, not a second opinion.
 */
export default function SlideStage({ item, reduced = false, still = true }: { item: SlideItem; reduced?: boolean; still?: boolean }) {
  return (
    <div className="slidestage" data-theme={itemTheme(item)}>
      <Slide item={item} reduced={reduced} still={still} />
    </div>
  )
}
