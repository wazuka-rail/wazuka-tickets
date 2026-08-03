import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import type { ReactElement } from "react";
import Footer from "./Footer";
import Header from "./Header";

const noto = Noto_Sans_JP({
  weight: ["400", "700"],
  preload: false,
  variable: "--font-noto-sans",
});

export const fontTicketDate = localFont({
  src: "../public/fonts/ticket-date.woff2",
  adjustFontFallback: "Times New Roman",
});

export const fontTicketMisc = localFont({
  src: "../public/fonts/ticket-misc.woff2",
});

type LayoutProps = {
  readonly children: ReactElement;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className={`${noto.variable} font-sans min-h-screen flex flex-col`}>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
};

export default Layout;
