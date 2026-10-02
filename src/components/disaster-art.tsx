import type { Disaster } from "@/lib/data";

type ArtType = Disaster["type"];

/**
 * Picture art for every disaster type — layered SVG scenes in bone
 * white + amber over the card's gradient. Used on home, /disasters,
 * /impact and the study zone so text sections get real visuals.
 */
export function DisasterArt({
  type,
  className = "",
}: {
  type: ArtType;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={className}
    >
      {type === "Flood" && (
        <g>
          {/* half-submerged house */}
          <rect x="42" y="118" width="92" height="62" fill="#fff" opacity="0.28" />
          <polygon points="30,120 88,78 146,120" fill="#fff" opacity="0.4" />
          <rect x="78" y="146" width="20" height="34" fill="#1b0b07" opacity="0.35" />
          {/* rescue boat */}
          <path d="M248 168 L336 168 L314 196 L270 196 Z" fill="#ffb14d" opacity="0.95" />
          <rect x="288" y="140" width="6" height="30" fill="#fff" opacity="0.8" />
          <circle cx="272" cy="156" r="9" fill="#fff" opacity="0.9" />
          {/* waves */}
          <path
            d="M0 178 Q25 164 50 178 T100 178 T150 178 T200 178 T250 178 T300 178 T350 178 T400 178 V225 H0 Z"
            fill="#fff"
            opacity="0.18"
          />
          <path
            d="M0 196 Q25 184 50 196 T100 196 T150 196 T200 196 T250 196 T300 196 T350 196 T400 196 V225 H0 Z"
            fill="#fff"
            opacity="0.22"
          />
          {/* rain */}
          {[
            60, 120, 180, 240, 300, 360,
          ].map((x) => (
            <line
              key={x}
              x1={x}
              y1="18"
              x2={x - 12}
              y2="58"
              stroke="#fff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.45"
            />
          ))}
        </g>
      )}

      {type === "Earthquake" && (
        <g>
          {/* tilted buildings */}
          <rect
            x="56"
            y="66"
            width="72"
            height="118"
            fill="#fff"
            opacity="0.24"
            transform="rotate(-6 92 125)"
          />
          <rect
            x="252"
            y="44"
            width="84"
            height="140"
            fill="#fff"
            opacity="0.3"
            transform="rotate(5 294 114)"
          />
          {[0, 1, 2].map((r) => (
            <g key={r} opacity="0.5" fill="#1b0b07">
              <rect x={66 + r * 0} y={86 + r * 26} width="52" height="8" transform={`rotate(-6 92 125)`} />
            </g>
          ))}
          {/* ground crack */}
          <polyline
            points="0,202 55,188 105,198 165,178 225,192 295,172 400,188"
            fill="none"
            stroke="#ffb14d"
            strokeWidth="6"
            strokeLinejoin="round"
            opacity="0.9"
          />
          {/* debris */}
          <circle cx="150" cy="150" r="7" fill="#fff" opacity="0.55" />
          <circle cx="205" cy="120" r="5" fill="#fff" opacity="0.45" />
          <circle cx="330" cy="160" r="8" fill="#fff" opacity="0.5" />
          <circle cx="90" cy="120" r="4" fill="#ffb14d" opacity="0.8" />
        </g>
      )}

      {type === "Cyclone" && (
        <g fill="none" stroke="#fff">
          {/* spiral */}
          <circle cx="200" cy="108" r="18" strokeWidth="7" opacity="0.9" />
          <circle cx="200" cy="108" r="42" strokeWidth="6" opacity="0.55" />
          <circle cx="200" cy="108" r="68" strokeWidth="5" opacity="0.35" />
          <circle cx="200" cy="108" r="94" strokeWidth="4" opacity="0.22" />
          <circle cx="200" cy="108" r="7" fill="#ffb14d" stroke="none" opacity="0.95" />
          {/* wind swoosh */}
          <path
            d="M10 190 Q120 170 200 186 T390 178"
            strokeWidth="5"
            opacity="0.4"
          />
          {/* rain */}
          {[
            40, 90, 140, 260, 310, 360,
          ].map((x) => (
            <line
              key={x}
              x1={x}
              y1="150"
              x2={x - 14}
              y2="196"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.5"
            />
          ))}
        </g>
      )}

      {type === "Wildfire" && (
        <g>
          {/* pine trees */}
          {[
            { x: 56 },
            { x: 320 },
          ].map(({ x }) => (
            <g key={x} opacity="0.55" fill="#fff">
              <polygon points={`${x},40 ${x + 34},110 ${x - 34},110`} />
              <rect x={x - 5} y="110" width="10" height="26" />
            </g>
          ))}
          {/* flames */}
          <path
            d="M150 200 Q130 160 148 128 Q152 150 164 138 Q160 110 176 84 Q196 112 190 140 Q206 132 202 160 Q224 176 214 200 Z"
            fill="#fff"
            opacity="0.4"
          />
          <path
            d="M232 200 Q220 172 232 148 Q238 164 248 156 Q246 134 258 116 Q272 138 266 160 Q278 156 274 176 Q288 186 282 200 Z"
            fill="#ffb14d"
            opacity="0.9"
          />
          <path
            d="M96 200 Q88 180 96 162 Q100 174 108 168 Q107 152 115 140 Q124 156 120 172 Q128 170 126 182 Q134 188 131 200 Z"
            fill="#fff"
            opacity="0.5"
          />
          {/* embers */}
          <circle cx="170" cy="60" r="5" fill="#ffb14d" opacity="0.9" />
          <circle cx="250" cy="44" r="4" fill="#fff" opacity="0.6" />
          <circle cx="310" cy="80" r="5" fill="#ffb14d" opacity="0.7" />
          {/* ground */}
          <rect x="0" y="200" width="400" height="25" fill="#1b0b07" opacity="0.35" />
        </g>
      )}

      {type === "Landslide" && (
        <g>
          {/* mountain */}
          <polygon points="0,225 150,36 280,225" fill="#fff" opacity="0.18" />
          <polygon points="150,36 196,108 128,108" fill="#fff" opacity="0.35" />
          {/* slope crack */}
          <polyline
            points="150,60 190,110 170,150 210,190"
            fill="none"
            stroke="#ffb14d"
            strokeWidth="5"
            opacity="0.85"
          />
          {/* falling rocks */}
          <circle cx="216" cy="128" r="11" fill="#fff" opacity="0.6" />
          <circle cx="246" cy="160" r="7" fill="#fff" opacity="0.5" />
          <circle cx="188" cy="168" r="6" fill="#ffb14d" opacity="0.85" />
          <circle cx="272" cy="120" r="5" fill="#fff" opacity="0.45" />
          {/* motion ticks */}
          <line x1="300" y1="150" x2="330" y2="150" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <line x1="306" y1="170" x2="344" y2="170" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
          {/* houses at foot */}
          <rect x="288" y="188" width="60" height="26" fill="#fff" opacity="0.35" />
          <polygon points="282,188 318,168 354,188" fill="#fff" opacity="0.5" />
        </g>
      )}

      {type === "Heatwave" && (
        <g>
          {/* sun */}
          <circle cx="308" cy="62" r="34" fill="#ffb14d" opacity="0.95" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = 308 + Math.cos(a) * 46;
            const y1 = 62 + Math.sin(a) * 46;
            const x2 = 308 + Math.cos(a) * 62;
            const y2 = 62 + Math.sin(a) * 62;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ffb14d"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.8"
              />
            );
          })}
          {/* cracked earth */}
          <line x1="0" y1="192" x2="400" y2="192" stroke="#fff" strokeWidth="5" opacity="0.5" />
          <polyline
            points="90,192 100,206 116,206 126,218"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            opacity="0.5"
          />
          <polyline
            points="220,192 212,206 196,208"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            opacity="0.4"
          />
          {/* heat waves */}
          {[
            70, 150, 230,
          ].map((x) => (
            <path
              key={x}
              d={`M${x} 160 q8 -12 0 -24 q-8 -12 0 -24 q8 -12 0 -24`}
              fill="none"
              stroke="#fff"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.55"
            />
          ))}
          {/* lone tree */}
          <rect x="52" y="150" width="10" height="42" fill="#fff" opacity="0.5" />
          <circle cx="57" cy="136" r="24" fill="#fff" opacity="0.3" />
        </g>
      )}
    </svg>
  );
}
