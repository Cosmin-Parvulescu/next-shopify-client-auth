import React from 'react';

import App from 'next/app';
import Head from 'next/head';

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

/* eslint-disable react/jsx-props-no-spreading */
export default class PolarisApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <AppProvider i18n={enTranslations}>
        <Head>
          <title>Cogsmyn Shopify App</title>

          <meta name="description" content="Awesome Shopify App 🚀" />

          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Component {...pageProps} />
      </AppProvider>
    );
  }
}
