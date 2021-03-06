import Document, {Head, Html, Main, NextScript} from 'next/document'

import React from "react";

export class MyDocument extends Document {
  render() {
      return (
          <Html lang="en">
              <Head>
                    <meta property="og:type" content="website" />
                    <meta id="og-url" property="og:url" content="https://www.nfthive.io/" />
                    <meta name="theme-color" content="#1A1A1A"  />
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta id="twitter-url" property="twitter:url" content="https://www.nfthive.io/" />
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
<link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap" rel="stylesheet" />
              </Head>
              <body>
                  <Main />
                  <NextScript />
              </body>
          </Html>
      )
  }
}

MyDocument.getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps }
};

export default MyDocument;
