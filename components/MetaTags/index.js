import Head from "next/head";

const MetaTags = (props) => {
  return (
    <Head>
      <title>MindHealer | Improve Quality of Your Life</title>
      <link rel="shortcut icon" href="/assets/images/logo/logo.svg" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, user-scalable=no"
      />
      <meta property="twitter:card" content="summary_large_image"></meta>
      <meta property="twitter:url" content={`https://x.com/PsyWorker`}></meta>
      <meta property="twitter:title" content="MindHealer"></meta>
      <meta
        property="twitter:description"
        content="MindHealer: Improve Quality of Your Life"
      ></meta>
      <meta
        property="og:image"
        content="" //
      ></meta>
    </Head>
  );
};

export default MetaTags;
