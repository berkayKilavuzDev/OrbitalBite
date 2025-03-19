import { useSelector, useDispatch } from 'react-redux';
import { removeItem } from '../redux/slices/basketSlice';

const Basket = () => {
  const basket = useSelector((state) => state.basket);
  const dispatch = useDispatch();

  return (
    <div className="container mt-5">
      <h1>Basket</h1>
      {basket.items.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <ul className="list-group">
          {basket.items.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between">
              {item.item_name} - ${item.total_price.toFixed(2)}
              <button className="btn btn-danger btn-sm" onClick={() => dispatch(removeItem(item))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: ${basket.total.toFixed(2)}</h3>
    </div>
  );
};

export default Basket;
