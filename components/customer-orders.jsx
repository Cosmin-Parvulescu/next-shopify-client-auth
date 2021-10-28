import React from 'react';
import { EmptyState, DataTable } from '@shopify/polaris';

export default function CustomerOrders(props) {
  const { customers } = props;

  let markup = (
    <EmptyState
      heading="No customers with orders... yet!"
    >
      <p>Soon enough, this list will be amazing!</p>
    </EmptyState>
  );

  if (customers && customers.length > 0) {
    const ordersCountTotal = customers
      .map((c) => c.ordersCount)
      .reduce((pre, cur) => pre + cur, 0);

    const arrayMappedCustomers = customers.map((c) => [c.name, c.ordersCount]);

    markup = (
      <DataTable
        showTotalsInFooter
        columnContentTypes={[
          'text',
          'numeric',
        ]}
        headings={[
          'Customer',
          'Orders count',
        ]}
        rows={arrayMappedCustomers}
        totals={['', `${ordersCountTotal}`]}
        totalsName={{
          singular: 'Total order count',
          plural: 'Total orders count',
        }}
      />
    );
  }

  return markup;
}
