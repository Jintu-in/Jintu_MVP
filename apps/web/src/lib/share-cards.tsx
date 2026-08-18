/**
 * The two share cards from docs/design/Share cards.dc.html, as JSX builders
 * for ImageResponse — 1200×630, flat fills and text only, built so one
 * number survives a WhatsApp thumbnail.
 *
 * No route consumes these yet (there is no /u/[handle] surface); they are
 * the captured design, typed and ready. Satori has no CSS grid, so the
 * design's 14-square grid renders as a flex row of fixed 66px squares —
 * (1200 − 2×72 padding − 13×10 gaps) / 14. Colours are the design hexes,
 * as in every ImageResponse in this repo (the contrast guard reads
 * classNames; these are rasterised images). The mono faces render only if
 * the caller passes font data to ImageResponse — noted, not hidden.
 *
 * Per the design's own note: nothing on either card claims a skill or a
 * job; both state days and dates only.
 */

export interface StreakShareCard {
  daysLearned: number;
  detailLine: string; // "Data analyst · 12 day streak"
  last14: boolean[]; // oldest first; true = done
}

export function streakShareCard({ daysLearned, detailLine, last14 }: StreakShareCard) {
  const doneCount = last14.filter(Boolean).length;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
        padding: 72,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 500, color: "#17758a" }}>jintu.in</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 36 }}>
        <div
          style={{
            fontSize: 180,
            fontWeight: 500,
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            color: "#231f20",
          }}
        >
          {daysLearned}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingBottom: 6 }}>
          <div style={{ fontSize: 32, lineHeight: 1.2, color: "#585556" }}>days learned</div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: "#231f20" }}>{detailLine}</div>
        </div>
      </div>
      {/* Satori: no grid — a flex row of fixed squares. aria is moot in a PNG;
          the alt text carries "{doneCount} of the last 14 days completed". */}
      <div style={{ display: "flex", gap: 10 }} data-done={doneCount}>
        {last14.map((done, i) => (
          <div
            key={i}
            style={{
              width: 66,
              height: 66,
              borderRadius: 10,
              background: done ? "#43b4c8" : "#f7f7f7",
              border: done ? "none" : "1px solid #ededed",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export interface MilestoneShareCard {
  daysLine: string; // "30 days"
  ofLine: string; // "of learning Data analyst"
  factLine: string; // "Started 12 July. Missed 2 days."
}

export function milestoneShareCard({ daysLine, ofLine, factLine }: MilestoneShareCard) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#FFFFFF",
        padding: 72,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 500, color: "#17758a" }}>jintu.in</div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontSize: 150,
            fontWeight: 500,
            lineHeight: 0.9,
            letterSpacing: "-0.045em",
            color: "#231f20",
          }}
        >
          {daysLine}
        </div>
        <div style={{ fontSize: 32, lineHeight: 1.3, color: "#585556" }}>{ofLine}</div>
      </div>
      <div
        style={{
          borderTop: "1px solid #ededed",
          paddingTop: 24,
          fontSize: 22,
          lineHeight: 1.5,
          color: "#706d6e",
        }}
      >
        {factLine}
      </div>
    </div>
  );
}
