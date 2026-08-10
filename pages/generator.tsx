import ConfigCard from "@/components/ConfigCard";
import TicketSheet, {
  BaseColor,
  BasePattern,
  TextureMode,
} from "@/components/TicketSheet";
import RadioGroup from "@/components/ui/RadioGroup";
import Head from "next/head";
import { type ReactElement, useRef, useState } from "react";
import Layout from "../components/Layout";
import type { NextPageWithLayout } from "./_app";

const Generator: NextPageWithLayout = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [trimmed, setTrimmed] = useState(false);
  const [baseColor, setBaseColor] = useState("white" as BaseColor);
  const [basePattern, setBasePattern] = useState("dilated" as BasePattern);
  const [textureMode, setTextureMode] = useState("smooth" as TextureMode);

  const onTrimmingChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTrimmed(ev.target.checked);
  };
  const onBaseColorChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value != baseColor) {
      setBaseColor(ev.target.value as BaseColor);
    }
  };
  const onBasePatternChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value != basePattern) {
      setBasePattern(ev.target.value as BasePattern);
    }
  };
  const onTextureModeChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value != textureMode) {
      setTextureMode(ev.target.value as TextureMode);
    }
  };

  const downloadSVG = () => {
    const svg = svgRef.current;
    if (svg == null) {
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml",
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = svgUrl;
    link.download = "wazuka-ticket.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(svgUrl);
  };

  return (
    <>
      <Head>
        <title>券面生成器 - わづか茶源郷鉄道</title>
      </Head>
      <main className="mx-auto max-w-(--breakpoint-2xl) min-w-3/4 items-center p-4">
        <h1>券面生成器</h1>
        <div className="bg-stripe p-2 inset-shadow-sm">
          <TicketSheet
            trimmed={trimmed}
            baseColor={baseColor}
            basePattern={basePattern}
            textureMode={textureMode}
            svgRef={svgRef}
          >
          </TicketSheet>
        </div>
        <button className="filled" onClick={downloadSVG}>Download SVG</button>
        <h2 className="mt-8">共通設定</h2>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(9em,_1fr))] gap-4 bg-stripe p-2 inset-shadow-sm">
          <ConfigCard caption="裁ち落とし">
            <input
              type="checkbox"
              onChange={onTrimmingChange}
              checked={trimmed}
            />
            <span className="px-1">裁断後</span>
          </ConfigCard>
          <ConfigCard caption="ベース色">
            <RadioGroup
              name="base_color"
              items={[
                ["none", "無色"],
                ["white", "白"],
                ["cream", "クリーム"],
              ]}
              currentValue={baseColor}
              onChange={onBaseColorChange}
            />
          </ConfigCard>
          <ConfigCard caption="地紋">
            <RadioGroup
              name="base_pattern"
              items={[
                ["none", "なし"],
                ["original", "原版"],
                ["dilated", "太り"],
              ]}
              currentValue={basePattern}
              onChange={onBasePatternChange}
            />
          </ConfigCard>
          <ConfigCard caption="紙質">
            <RadioGroup
              name="texture_mode"
              items={[
                ["none", "なし"],
                ["smooth", "滑らか"],
                ["rough", "粗い"],
              ]}
              currentValue={textureMode}
              onChange={onTextureModeChange}
            />
          </ConfigCard>
        </div>
      </main>
    </>
  );
};

Generator.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Generator;
