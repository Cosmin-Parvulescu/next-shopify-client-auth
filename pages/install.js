import { Layout, Page, Card, FormLayout, TextField, Button, Form } from "@shopify/polaris";
import { useCallback, useState } from "react";

export default function Install() {
  const [shop, setShop] = useState('');
  const handleShopChange = useCallback((value) => setShop(value), []);

  const handleButtonClick = () => document.location = `/auth?shop=${shop}.myshopify.com`;

  return <Page title="Install App">
    <Layout>
      <Layout.Section>
        <Card title="Install our app to your store" sectioned>
          <Form>
            <FormLayout>
              <TextField
                label="Store name"
                placeholder="Store name"
                value={shop}
                onChange={handleShopChange}
                suffix=".myshopify.com"
                helpText="We need this information in order to link our application to your store"
              ></TextField>

              {/* <div>{shop}.myshopify.com</div> */}

              <Button onClick={handleButtonClick} primary>Connect</Button>
            </FormLayout>
          </Form>
        </Card>
      </Layout.Section>
    </Layout>
  </Page>;
}
