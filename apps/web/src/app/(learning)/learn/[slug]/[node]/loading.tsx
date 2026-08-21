/**
 * The day's skeleton, shaped like the day.
 *
 * No spinner: a spinner says "something is happening", a skeleton says
 * "this is what is coming", and on a slow connection the second is the one
 * that stops people leaving. The shapes match the real layout — header,
 * title, meta, principle, then section blocks with their tick columns.
 */
const Bar = ({ className }: { className: string }) => (
  <div className={`animate-[jskel_1.4s_ease-in-out_infinite] rounded bg-ink-50 ${className}`} />
);

export default function LoadingNode() {
  return (
    <div aria-busy className="bg-white lg:bg-ink-50">
      <span className="sr-only">Loading this day.</span>
      <div className="border-b border-ink-100 bg-white">
        <div className="flex h-[52px] items-center gap-3 px-5">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <Bar className="h-3 w-2/3" />
            <Bar className="h-2.5 w-1/3" />
          </div>
        </div>
        <div className="h-[3px] bg-ink-100" />
      </div>

      <div>
        <div className="mx-auto max-w-[720px]">
          <div className="bg-white px-5 pt-5 pb-10 lg:border-x lg:border-ink-100">
            <Bar className="h-3 w-1/2" />
            <Bar className="mt-3 h-6 w-5/6" />
            <Bar className="mt-2.5 h-3 w-2/5" />
            <Bar className="mt-5 h-4 w-4/5" />

            {[0, 1, 2].map((i) => (
              <div key={i} className="mt-7 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Bar className="h-4 w-1/3" />
                  <Bar className="mt-3 h-3 w-full" />
                  <Bar className="mt-2 h-3 w-full" />
                  <Bar className="mt-2 h-3 w-3/5" />
                </div>
                <Bar className="size-5 flex-none rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
