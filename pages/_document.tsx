// @ts-nocheck
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>MindHealer</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
        <meta name="keywords" content="mind healer, psycology, mental health" />
        <meta name="author" content="This web app has been developed by Dmitrii Bondarenko & Anastasiia Polozova" />
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" as="image" href="/shared/assets/img/main_bg_07.webp" type="image/webp" />
        <link rel="preload" as="image" href="/shared/assets/img/main_bg_07-mid.webp" type="image/webp" />
        <link rel="preload" as="image" href="/shared/assets/img/main_bg_07-min.webp" type="image/webp" />


        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/favicons/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicons/apple-icon-60x60.png"
        />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/favicons/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/favicons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/favicons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/favicons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/favicons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="MindHealer"
          content="Practice Mental Health Online For Clients & Psychotherapists"
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Main />
        <NextScript />
        <div id="portal" />
      </body>
    </Html>
  );
}
