// src/Components/PayPage.jsx
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const PayPage = () => {
  const paypalRef = useRef();
  const [amount, setAmount] = useState("10.00");
  const authToken = useSelector((state) => state.user.authToken);

  // ✅ 渲染按钮函数
  const renderPaypalButtons = (amountValue) => {
    if (!window.paypal) {
      console.error("PayPal SDK 未加载");
      return;
    }

    // 清空旧按钮，避免重复渲染
    paypalRef.current.innerHTML = "";

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amountValue,
              },
            },
          ],
        });
      },
      onApprove: async (data, actions) => {
        const details = await actions.order.capture();
        const orderID = details.id;
        const payerID = details.payer.payer_id;
        const status = details.status;

        try {
          const orderRes = await axios.post(
            "http://127.0.0.1:8000/api/orders/",
            { order_id: orderID, amount: parseFloat(amountValue) },
            {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            }
          );

          await axios.post(
            "http://127.0.0.1:8000/api/payments/",
            {
              order: orderRes.data.id,
              payment_id:
                details.purchase_units[0].payments.captures[0].id,
              amount: parseFloat(amountValue),
              status: status,
              method: "PayPal",
            },
            {
              headers: {
                Authorization: `Token ${authToken}`,
              },
            }
          );

          alert("✅ 付款成功，记录已保存！");
        } catch (err) {
          console.error("❌ 保存订单失败", err);
          alert("付款成功但保存失败");
        }
      },
      onError: (err) => {
        console.error("PayPal Error", err);
        alert("支付出错，请重试");
      },
    }).render(paypalRef.current);
  };

  // ✅ 每次组件初次加载时，先渲染一次默认按钮
  useEffect(() => {
    renderPaypalButtons(amount);
  }, [authToken]);

  // ✅ 输入变化时重新渲染按钮
  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    renderPaypalButtons(newAmount);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pay with PayPal</h2>
      <label>
        Enter Amount ($):
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={handleAmountChange}
          style={{ margin: "0.5rem", padding: "0.3rem" }}
        />
      </label>
      <div ref={paypalRef}></div>
    </div>
  );
};

export default PayPage;
