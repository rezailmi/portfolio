# 015 — Fix broken typing animation on onboarding screen

- **Status**: DONE
- **Commit**: ed1069b
- **Severity**: HIGH
- **Category**: Broken animation
- **Estimated scope**: 2 files, small edits

## Problem

`components/onboarding-screen.tsx:28` references a `typing` keyframe that is defined nowhere in the repo — the animation silently never runs; the line just appears statically:

```tsx
/* components/onboarding-screen.tsx:28 — current */
<p className="max-w-[min(32rem,90%)] animate-[typing_3s_steps(120,end)] text-xs text-[#80ECFD] sm:text-base">
  Drag and drop the numbers into the progress bars.
</p>
```

The classic width-based typewriter trick cannot work here because the text may wrap (`max-w-[min(32rem,90%)]`). Use a `clip-path` reveal instead, which works on wrapped text and animates on the compositor.

## Target

In `app/globals.css`, next to the other keyframes (after `@keyframes blur-fade-in`, ~line 191), add:

```css
@keyframes typing {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
```

In `components/onboarding-screen.tsx:28`, change the class to:

```
animate-[typing_2s_steps(60,end)_backwards] motion-reduce:animate-none
```

(2s/60 steps reads as terminal output; `backwards` ensures the text is hidden before the animation starts; the reduced-motion gate shows the text instantly.)

## Repo conventions to follow

- Keyframes live at the bottom of `app/globals.css` outside `@theme` (exemplar: `@keyframes blur-fade-in` at line 182).
- The onboarding screen is a terminal pastiche (`#040C15` background, `#80ECFD` text, blink cursor) — the reveal should read as output being printed.

## Steps

1. Add the `typing` keyframes to `app/globals.css`.
2. Update the className on `components/onboarding-screen.tsx:28`.

## Boundaries

- Do NOT touch the blink cursor (`animate-blink`) or the "Press enter" button.
- Do NOT add a per-character JS typewriter — CSS only.
- If the stepped clip reveal looks wrong on the wrapped two-line mobile layout during the feel check, fall back to deleting `animate-[...]` from line 28 entirely (a dead reference is worse than no animation) and report which path you took.

## Verification

- **Mechanical**: `bun run build` succeeds; `grep -n "typing" app/globals.css` shows the keyframes.
- **Feel check**: open http://localhost:3020 (the playground renders on the home page via `ComputerWrapper`) — before pressing enter, the instruction line sweeps in left-to-right in discrete steps over ~2s, then the cursor keeps blinking. Reload with DevTools → Rendering → "Emulate prefers-reduced-motion" — text appears instantly.
- **Done when**: the animation visibly runs on load and reduced-motion shows static text.
