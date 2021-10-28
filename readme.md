
# Requirements

- the main page for new non authenticated user asks for a `.myshopify.com` url and has a button to start the oauth flow
- store details are saved to a MongoDb database
- the main page when authenticated should list the top 10 customers sorted by number of orders
- tests are appreciated, even if not required


# Stack

|Area|Technology|
|--|--|
|PaaS|Heroku, MongoDB Atlas|
|Database|MongoDB|
|Server|Node, Koa, Next, Shopify|
|Client|Next, React, Polaris|
|Test|Jest|


# Environment variables

|KEY|Mentions|
|--|--|
|SHOPIFY_API_KEY||
|SHOPIFY_API_SECRET||
|HOST|Host of the running system|
|MONGODB_CONNECTION_STRING||


# Development

1. Run **npm install** command
2. Run **npm run dev** command
3. Run **ngrok** to open a tunnel to your localhost
4. Update**.env** HOST with the ngrok host (i.e. *your-ngrok-url.ngrok.io*)
5. Configure Shopify App to allow redirect to your ngrok host (i.e. *your-ngrok-url.ngrok.io/auth/callback*)


# Tooling

Node [nodejs/node: Node.js JavaScript runtime (github.com)](https://github.com/nodejs/node)
Koa [koajs/koa: Expressive middleware for node.js using ES2017 async functions (github.com)](https://github.com/koajs/koa)
Koa-shopify-auth [Shopify/koa-shopify-auth: Middleware to authenticate a Koa application with Shopify (github.com)](https://github.com/Shopify/koa-shopify-auth)
Shopify-node-api [Shopify/shopify-node-api: Shopify Admin API Library for Node. Accelerate development with support for authentication, graphql proxy, webhooks (github.com)](https://github.com/Shopify/shopify-node-api)

Next [vercel/next.js: The React Framework (github.com)](https://github.com/vercel/next.js/)
React [facebook/react: A declarative, efficient, and flexible JavaScript library for building user interfaces. (github.com)](https://github.com/facebook/react)
Polaris [Shopify/polaris-react: Shopify’s admin product component library (github.com)](https://github.com/Shopify/polaris-react)

Jest [facebook/jest: Delightful JavaScript Testing](https://github.com/facebook/jest)


# Considerations

The stack was chosen in order to facilitate an easier move to Session Tokens in the future as most apps are going with full on Shopify integration.

Uses client side cookies for authentication.

Encryption keys are mostly the SHOPIFY API KEY, which shouldn't be the case for a serious app.

Most of the code was built with a consideration for the happy flow; error cases and edge cases weren't considered all that much.

Some next steps could be 
- ~~add linting;~~
- ~~fix testing;~~
- ~~refactorization of customer operations into a service;~~
- ~~refactorization of token operations into a service;~~
- fix nasty redirect on spotify unauthorized;
- turn custom cookie auth into a middleware;
- add more tests;
- GraphQL integration for better querying;
- Transformation into a Shopify Bridge app.