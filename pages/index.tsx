import Head from "next/head";
import type { ReactElement } from "react";
import Layout from "../components/Layout";
import { fontTicketDate } from "../components/Layout";
import type { NextPageWithLayout } from "./_app";

const Index: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>きっぷ - わづか茶源郷鉄道</title>
      </Head>
      <main>
        <h1>わづか茶源郷鉄道のきっぷ</h1>
        <div className="p-8">
          きっぷの情報を公開します。
        </div>
      </main>
    </>
  );
};

Index.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default Index;
