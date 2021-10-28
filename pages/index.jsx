import React from 'react';



import { Page, Layout, Card } from '@shopify/polaris';
import PropTypes from 'prop-types';
import Cryptool from '../cryptool';
import CustomerOrders from '../components/customer-orders';
import ShopToken from '../models';
import CustomerService from '../services';

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
  const customerService = new CustomerService();

  const shopCookie = ctx.req.cookies.shop;
  if (!shopCookie || shopCookie === '') {
    return {
      redirect: {
        destination: '/install',
        permanent: false,
      },
    };
  }

  const shopData = JSON.parse(Cryptool.decrypt(shopCookie));
  const { shop } = shopData;

  const shopTokenDbEntry = await ShopToken.findOne({ shop }).exec();
  if (shopTokenDbEntry === null) {
    return {
      redirect: {
        destination: '/install',
        permanent: false,
      },
    };
  }

  const accessToken = Cryptool.decrypt(shopTokenDbEntry.token);
  const top10Customers = await customerService.getTop10CustomersByOrders(shop, accessToken);

  return {
    props: {
      customers: top10Customers.map(c => ({
        name: c.name,
        ordersCount: c.ordersCount
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
