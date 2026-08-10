export type BaseColor = "none" | "white" | "cream";
export type BasePattern = "none" | "original" | "dilated";
export type TextureMode = "none" | "smooth" | "rough";

const BLEED = 3;
const MARKER = 7;
const BM = BLEED + MARKER;
const SIZES = {
  "A": [57.5, 30],
  "B": [57.5, 25],
};

type TicketSheetProps = {
  trimmed: boolean;
  baseColor: BaseColor;
  basePattern: BasePattern;
  textureMode: TextureMode;
  readonly svgRef?: React.Ref<SVGSVGElement>;
  readonly children?: React.ReactElement;
};

function TicketSheet(
  { trimmed, baseColor, basePattern, textureMode, svgRef, children }:
    TicketSheetProps,
) {
  const numX = 1;
  const numY = 1;
  const format = "B";
  const [w, h] = SIZES[format];
  const baseW = w * numX + (trimmed ? 0 : BLEED * 2);
  const baseH = h * numY + (trimmed ? 0 : BLEED * 2);
  const viewBoxW = baseW + (trimmed ? 0 : MARKER * 2);
  const viewBoxH = baseH + (trimmed ? 0 : MARKER * 2);
  const viewBox = (trimmed ? "0 0" : `${-BM} ${-BM}`)
    + ` ${viewBoxW} ${viewBoxH}`;
  const baseFill = {
    "none": "none",
    "white": "#f4f4f0",
    "cream": "#f8f0d0",
  }[baseColor];
  const green = [0xd8 / 0xff, 0xe8 / 0xff, 0xa0 / 0xff, 0.8];
  const baseDefs = (
    <>
      <filter
        id="filter_noise"
        width="1"
        height="1"
      >
        <feTurbulence
          baseFrequency="1.5"
          numOctaves="2"
          seed="0"
          stitchTiles="stitch"
          type="fractalNoise"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0.5 0  0 0 0 0.5 0  0 0 0 0.5 0  0 0 0 0 1"
        />
      </filter>
      <filter
        id="filter_emboss"
        width="2"
        height="2"
      >
        <feConvolveMatrix
          order="3 3"
          kernelMatrix="1.4 -0.7 0  0.7 0 -0.7  0 0.7 -1.4"
          edgeMode="wrap"
          preserveAlpha="true"
          divisor={textureMode == "rough" ? 0.7 : 1.4}
          bias="0.25"
        />
      </filter>
      <pattern
        id="pattern_paper"
        x="0"
        y="0"
        width="256"
        height="256"
        patternUnits="userSpaceOnUse"
        patternTransform="scale(1)"
      >
        <rect
          x="25.6"
          y="25.6"
          width="256"
          height="256"
          transform="translate(-25.6,-25.6)"
          filter="url(#filter_noise)"
        />
      </pattern>
    </>
  );
  const basePatternDefs = (
    <>
      <filter
        colorInterpolationFilters="sRGB"
        id="filter_dilate"
        x="-0.05"
        y="-0.05"
        width="1.1"
        height="1.1"
      >
        <feGaussianBlur stdDeviation="3" />
        <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -5" />
      </filter>
      <filter
        colorInterpolationFilters="sRGB"
        id="filter_green"
        width="1.1"
        height="1.1"
      >
        <feColorMatrix
          values={`0 0 0 0 ${green[0]}
                   0 0 0 0 ${green[1]}
                   0 0 0 0 ${green[2]}
                   0 0 0 ${green[3]} 0`}
        />
      </filter>
      <pattern
        x="0.5"
        y="0"
        width="12"
        height="7"
        id="pattern_cha"
        patternUnits="userSpaceOnUse"
      >
        <g
          stroke="#000"
          transform={`scale(${1 / 128})`}
          filter={basePattern == "dilated" ? "url(#filter_dilate)" : ""}
        >
          <g
            strokeWidth="32"
            fill="none"
            id="g_cha"
          >
            <circle
              cx="256"
              cy="256"
              r="224"
              strokeWidth="24"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m 100,160 h 8 m -28,136 28,-14 m 52,118 15,-30 m 81,62 v -128
                m 96,96 -15,-30 m 95,-74 -28,-14 m 8,-122 h -8"
            />
            <path d="m 100,160 h 24 m 72,0 h 44 m 32,0 h 44 m 72,0 h 24
                m -24,114 28,14 m -87,66 15,30 m -161,-30 -15,30
                m -44,-110 -28,14 m 48,16 h 224 m -112,-44 v 44" />
            <path
              strokeLinejoin="round"
              d="m 160,88 v 168 l 96,-48 96,48 v -167"
            />
            <path
              id="path_sc"
              strokeWidth="16"
              d="m 1024,256 m -168,0
                a 168,168 0 0 1 336,0 a 168 168 0 0 1 -336,0
                a 168,168 0 0 0 168,-168 a 168 168 0 0 0 168,168
                a 168,168 0 0 0 -168,168 a 168,168 0 0 0 -168,-168"
            />
            <use
              xlinkHref="#path_sc"
              transform="translate(-352,0)"
            />
            <use
              xlinkHref="#path_sc"
              transform="translate(352,0)"
            />
            <use
              xlinkHref="#path_sc"
              transform="translate(-1184,0)"
            />
            <path
              fill="#000"
              stroke="none"
              d="m 1024,256 m 0,176 a 176,176 0 0 1 352,0
                a 176,176 0 0 1 -176,-176 a 176,176 0 0 1 -176,176 z
                m -176,-176 a 176,176 0 0 1 -352,0
                a 176,176 0 0 1 176,176 a 176,176 0 0 1 176,-176 z
                m -1184,0 a 176,176 0 0 1 176,176 a 176,176 0 0 1 -176,-176 z"
            />
          </g>
          <use
            xlinkHref="#g_cha"
            transform="translate(1024,704) rotate(180) translate(-256,-256)"
          />
          <use
            xlinkHref="#g_cha"
            transform="translate(1024,-192) rotate(180) translate(-256,-256)"
          />
        </g>
      </pattern>
    </>
  );
  const markers = (
    <g strokeWidth="0.12" stroke="#000" fill="none">
      <path
        d={`M${-BM},0 h${MARKER} v${-BM} m${BLEED},0 v${MARKER} h${-BM}
          M${w},${-BM} v${MARKER} h${BM} m0,${BLEED} h${-MARKER} v${-BM}
          M${-BM},${h} h${MARKER} v${BM} m${BLEED},0 v${-MARKER} h${-BM}
          M${w},${h + BM} v${-MARKER} h${BM} m0,${-BLEED} h${-MARKER} v${BM}`}
      />
    </g>
  );

  return (
    <div className={`p-[${trimmed ? BM : 0}mm]`}>
      <div className="p-[0mm] p-[10mm] hidden" />
      <svg
        width={`${viewBoxW}mm`}
        height={`${viewBoxH}mm`}
        viewBox={viewBox}
        ref={svgRef}
      >
        <defs>
          {baseDefs}
          {basePatternDefs}
        </defs>
        <rect
          x={-BLEED}
          y={-BLEED}
          width={baseW}
          height={baseH}
          fill={baseFill}
        />
        {basePattern == "none" ? <></> : (
          <rect
            x={-BLEED}
            y={-BLEED}
            width={baseW}
            height={baseH}
            fill="url(#pattern_cha)"
            filter="url(#filter_green)"
          />
        )}
        {textureMode == "none" ? <></> : (
          <rect
            width={baseW * 2}
            height={baseH * 2}
            fill="url(#pattern_paper)"
            filter="url(#filter_emboss)"
            style={{ mixBlendMode: "overlay" }}
            transform={`translate(${-BLEED},${-BLEED}) scale(0.5)`}
          />
        )}
        {children}
        {markers}
      </svg>
    </div>
  );
}

export default TicketSheet;
