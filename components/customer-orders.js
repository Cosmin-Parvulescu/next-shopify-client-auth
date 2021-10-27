export default function CustomerOrders(props) {
    return <ul>
        {props.customers.map((c, i) => <li key={i}>{c.name} ({c.orders_count})</li>)}
    </ul>
}