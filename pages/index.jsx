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
  const shopCookie = ctx.req.cookies.shop;

  const shopData = JSON.parse(Cryptool.decrypt(shopCookie));
  const { shop } = shopData;

  const token = await TokenService.getTokenByShop(shop);
  const top10Customers = await CustomerService.getTop10CustomersByOrders(shop, token);

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
