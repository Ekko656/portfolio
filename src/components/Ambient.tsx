/**
 * Ambient depth layer: a few large, heavily-blurred warm glows that drift on
 * long loops behind all content. Fixed, very low opacity — this is atmosphere,
 * not decoration. Animation is disabled under prefers-reduced-motion via CSS.
 */
export default function Ambient() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute -left-[10%] top-[8%] h-[42vmax] w-[42vmax] animate-drift rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="absolute right-[-8%] top-[35%] h-[36vmax] w-[36vmax] animate-drift-slow rounded-full bg-violet/[0.08] blur-[130px]" />
      <div className="absolute bottom-[-12%] left-[30%] h-[40vmax] w-[40vmax] animate-drift rounded-full bg-accent-deep/[0.06] blur-[140px] [animation-delay:-12s]" />
    </div>
  )
}
