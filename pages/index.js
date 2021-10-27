import Cryptool from '../cryptool';
import Shopify from '@shopify/shopify-api';

import { Layout, Page } from "@shopify/polaris";
import CustomerOrders from '../components/customer-orders';

export default function Index(props) {
  return (
    <Page
      title="App"
    >
      <Layout>
        <Layout.Section>
          {props.customers && 
          props.customers.length > 0 && 
          <CustomerOrders customers={props.customers}></CustomerOrders>}
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export async function getServerSideProps(ctx) {
  const shopCookie = ctx.req.cookies['shop'];
  if (!shopCookie || shopCookie === '') {
    return {
      redirect: {
        destination: '/install',
        permanent: false,
      }
    }
  }

  const shopData = JSON.parse(Cryptool.dencrypt(shopCookie));

  const client = new Shopify.Clients.Rest(shopData.shop, shopData.token);
  const customerQryRes = await client.get({
    path: 'customers/search',
    query: {
      "order": "orders_count DESC",
      "limit": 10
    }
  })

  const mappedCustomers = customerQryRes.body.customers.map(c => {
    return {
      name: `${c.first_name} ${c.last_name}`,
      orders_count: c.orders_count
    }
  })

  return {
    props: {
      customers: mappedCustomers
    }
  }
}