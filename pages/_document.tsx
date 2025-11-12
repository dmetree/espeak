// @ts-nocheck
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>EasySpeak</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
        <meta name="keywords" content="languages, learn" />
        <meta name="author" content="This web app has been developed by Dmitrii B & Anastasiia Polozova" />
        <link rel="icon" href="favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/favicons/apple-icon-60x60.png"
        />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="Easy Speak"
          content="Learn to Speak a New Language"
        />
        <link rel="manifest" href="/site.webmanifest" />
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
