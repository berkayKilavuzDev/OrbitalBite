import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderHistory } from "../redux/orderSlice"; // Güncel slice yolu

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { history, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  if (status === "loading") return <p>Loading order history...</p>;
  if (status === "failed") return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="mt-4">
      <h4>Order History</h4>
      {history.length > 0 ? (
        <ul className="list-group">
          {history.map((order) => (
            <li key={order.id} className="list-group-item">
              <strong>Order #{order.id}</strong> - {order.date}
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.name} - £{item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <strong>Total:</strong> £{order.total_price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
