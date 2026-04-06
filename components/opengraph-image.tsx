import { ImageResponse } from "next/og";
import { join } from "path";
import { readFile } from "fs/promises";

const BRAND_GREEN = "#71a826";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props,
): Promise<ImageResponse> {
  const siteName = process.env.SITE_NAME || "Ferti Lider";
  const { title } = {
    ...{ title: siteName },
    ...props,
  };

  const [fontFile, logoFile] = await Promise.all([
    readFile(join(process.cwd(), "./fonts/Inter-Bold.ttf")),
    readFile(join(process.cwd(), "public/logo.png")).catch(() => null),
  ]);

  const font = Uint8Array.from(fontFile).buffer;
  const logoSrc = logoFile
    ? `data:image/png;base64,${logoFile.toString("base64")}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND_GREEN,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 280,
            height: 280,
            borderRadius: 32,
            backgroundColor: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt=""
              width={248}
              height={248}
              style={{ objectFit: "contain" }}
            />
          ) : null}
        </div>
        <p
          style={{
            marginTop: 36,
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: 1000,
            lineHeight: 1.1,
            textShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          {title}
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: font,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
