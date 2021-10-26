import { Layout, Page, Card, FormLayout, TextField, Button } from "@shopify/polaris";
import { useCallback, useState } from "react";

export default function Install() {
  const [shop, setShop] = useState('');
  const handleShopChange = useCallback((value) => setShop(value), []);

  const handleButtonClick = () => document.location = `/auth?shop=${shop}.myshopify.com`;

  return <Page title="Install App">
    <Layout>
      <Layout.AnnotatedSection
        title="Store"
        description="We'll need your store name in order to connect our app">
        <Card sectioned>
          <FormLayout>
            <TextField
              placeholder="Store name"
              value={shop}
              onChange={handleShopChange}
            ></TextField>

              <div>{ shop }.myshopify.com</div>

            <Button onClick={handleButtonClick} primary>Connect</Button>
          </FormLayout>
        </Card>
      </Layout.AnnotatedSection>
    </Layout>
  </Page>;
}
