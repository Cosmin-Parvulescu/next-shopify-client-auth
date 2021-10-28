import React from 'react';
import { Page, Layout, Card } from '@shopify/polaris';
import PropTypes from 'prop-types';
import Cryptool from '../cryptool';
import CustomerOrders from '../components/customer-orders';
import { CustomerService, TokenService } from '../services';

function Index(props) {
  const { customers } = props;

  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Card title="Top customers by orders count" sectioned>
            <CustomerOrders customers={customers} />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export async function getServerSideProps(ctx) {
  const redirect = () => ({
    redirect: {
      destination: '/install',
      permanent: false,
    },
  });

  const shopCookie = ctx.req.cookies.shop;
  if (!shopCookie || shopCookie === '') {
    return redirect();
  }

  const shopData = JSON.parse(Cryptool.decrypt(shopCookie));
  const { shop } = shopData;

  const token = await TokenService.getTokenByShop(shop);
  if (token === null) {
    return redirect();
  }

  const top10Customers = await CustomerService.getTop10CustomersByOrders(shop, token);
  if (top10Customers === null) {
    // For now, it probably means
    // that Shopify is not longer authorizing
    // the token, so we need to reauth
    return redirect();
  }

  return {
    props: {
      customers: top10Customers.map((c) => ({
        name: c.name,
        ordersCount: c.ordersCount,
      })),
    },
  };
}

Index.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.object),
};

Index.defaultProps = {
  customers: [],
};

export default Index;
