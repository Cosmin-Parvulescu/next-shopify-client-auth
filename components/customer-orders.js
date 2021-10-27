import { Page, Layout, Card, EmptyState, ResourceList, ResourceItem, DataTable } from "@shopify/polaris";

export default function CustomerOrders(props) {
    let customers = props.customers;

    // Empty state doesn't work for now... have to investigate
    let markup = (<EmptyState
        heading="No customers found :("
    >
        <p>Soon enough, this list will be full!</p>
    </EmptyState>);

    if (customers && customers.length > 0) {
        const ordersCountTotal = customers.map(c => c.ordersCount).reduce((pre, cur) => pre += cur, 0);
        const arrayMappedCustomers = customers.map(c => [c.name, c.ordersCount]);

        markup = <DataTable
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
    }

    return markup;
}