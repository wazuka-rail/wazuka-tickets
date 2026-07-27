import Head from "next/head";
import type { ReactElement } from "react";
import Layout from "../components/Layout";
import { fontTicketDate } from "../components/Layout";
import Link from "../components/Link";
import type { NextPageWithLayout } from "./_app";

const Fonts: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>きっぷ用フォント - わづか茶源郷鉄道</title>
      </Head>
      <main>
        <h1>きっぷ用フォント</h1>
        <div className="p-8">
          きっぷ用フォントを
          <Link href="fonts/OFL.md">
            <span className="underline hover:text-secondary">
              SIL Open Font License Version 1.1
            </span>
          </Link>
          で提供しています。
        </div>

        <h2>Wazuka-Ticket-Date</h2>
        <div className="text-4xl m-8 shadow-sm">
          <span className={fontTicketDate.className}>.-0123456789</span>
        </div>
        <div className="mx-8 flex gap-8">
          <Link href="fonts/ticket-date.ttf">
            <button className="filled">Download TTF</button>
          </Link>
          <Link href="fonts/ticket-date.woff2">
            <button className="filled">Download WOFF2</button>
          </Link>
        </div>
      </main>
    </>
  );
};

Fonts.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Fonts;
