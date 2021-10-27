import { Layout, Page } from "@shopify/polaris";

export default function Index() {
  return (
    <Page
      title="App"
    >
      <Layout>
        <Layout.Section>
          <h1>Hello?</h1>
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

  return {
    props: {

    }
  }
}

