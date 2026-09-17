export default function Mascot({ size = 150, mood = "happy" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      role="img"
      aria-label="Maskot Kopi"
    >
      {/* uap */}
      <path
        d="M62 30c-6-8 6-12 0-20M82 28c-6-8 6-12 0-20M102 30c-6-8 6-12 0-20"
        fill="none"
        stroke="#222"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* gagang */}
      <path
        d="M124 68c22 0 22 38 0 38"
        fill="none"
        stroke="#222"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M124 68c22 0 22 38 0 38"
        fill="none"
        stroke="#8fd3de"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* badan */}
      <path
        d="M34 48h96l-10 88a14 14 0 0 1-14 12H58a14 14 0 0 1-14-12z"
        fill="#faae2b"
        stroke="#222"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M36 62h92" stroke="#222" strokeWidth="4" />
      <rect
        x="34"
        y="42"
        width="96"
        height="14"
        rx="4"
        fill="#fff"
        stroke="#222"
        strokeWidth="4"
      />
      {/* mata */}
      <circle cx="66" cy="92" r="9" fill="#fff" stroke="#222" strokeWidth="4" />
      <circle cx="98" cy="92" r="9" fill="#fff" stroke="#222" strokeWidth="4" />
      <circle cx="68" cy="94" r="4" fill="#222" />
      <circle cx="100" cy="94" r="4" fill="#222" />
      {/* pipi */}
      <ellipse cx="54" cy="108" rx="7" ry="4" fill="#ff97a1" />
      <ellipse cx="110" cy="108" rx="7" ry="4" fill="#ff97a1" />
      {/* mulut */}
      {mood === "sad" ? (
        <path
          d="M72 120q10-8 20 0"
          fill="none"
          stroke="#222"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M72 112q10 12 20 0"
          fill="#ff6b6b"
          stroke="#222"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}
