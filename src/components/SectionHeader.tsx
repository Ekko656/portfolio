type Props = {
  index: string
  title: string
  meta?: string
}

/** Thin technical section rule with monospace coordinates / index. */
export default function SectionHeader({ index, title, meta }: Props) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-accent">{index}</span>
        <span className="h-px flex-1 bg-hair" />
        {meta && <span className="label">{meta}</span>}
      </div>
      <h2 className="mt-6 font-display text-3xl font-bold tracking-tightest text-ink md:text-5xl">
        {title}
      </h2>
    </div>
  )
}
