import Cryptool from '../cryptool';
import Shopify from '@shopify/shopify-api';

import { Page, Layout, Card } from "@shopify/polaris";
import CustomerOrders from '../components/customer-orders';

export default function Index(props) {
  return (
    <Page title="Dashboard">
      <Layout>
        <Layout.Section>
          <Card title="Top customers by orders count" sectioned>
            <CustomerOrders customers={props.customers}></CustomerOrders>
          </Card>
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

  const mappedCustomers = customerQryRes.body.customers
    .filter(c => c.orders_count > 0)
    .map(c => {
      return {
        name: `${c.first_name} ${c.last_name}`,
        ordersCount: c.orders_count
      }
    })

  return {
    props: {
      customers: mappedCustomers
    }
  }
}