import React from 'react';
import App from 'next/app';

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css';

export default class PolarisApp extends App {
    render() {
        const { Component, pageProps } = this.props;

        return (
            <AppProvider i18n={enTranslations}>
                <Component {...pageProps} />
            </AppProvider>
        );
    }
}