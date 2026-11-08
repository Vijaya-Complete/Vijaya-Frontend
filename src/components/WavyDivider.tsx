export function WavyDivider({ flip = false, color = "var(--cream)" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`w-full leading-[0] ${flip ? "rotate-180" : ""}`} aria-hidden>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-12 w-full md:h-16">
        <path
          d="M0,32 C240,80 480,0 720,32 C960,64 1200,16 1440,48 L1440,80 L0,80 Z"
          style={{ fill: color }}
        />
      </svg>
    </div>
  );
}
