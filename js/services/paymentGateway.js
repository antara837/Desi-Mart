/**
 * Simulated Payment Gateway Service.
 * Mimics real gateway API with asynchronous delays and deterministic test outcomes.
 * Does NOT invoke any real external network APIs.
 */

export class PaymentGateway {
  // Time Complexity: O(1)
  // Creates a simulated payment intent.
  static createPaymentIntent(orderDraft) {
    const randomId = Math.random().toString(36).substring(2, 10);
    return {
      intentId: `pi_${randomId}`,
      amount: orderDraft.grandTotal,
      status: "created",
      createdAt: new Date().toISOString()
    };
  }

  // Time Complexity: O(1) (Asynchronous promise with 1.5-2.5s simulated network delay)
  // Processes payment attempt based on deterministic test rules.
  static pay(intentId, method, details = {}) {
    return new Promise((resolve) => {
      // Random latency between 1500ms and 2500ms
      const delay = Math.floor(Math.random() * 1000) + 1500;

      setTimeout(() => {
        const paymentId = `pay_${Math.random().toString(36).substring(2, 10)}`;

        // 1. CASH ON DELIVERY
        if (method === "cod") {
          resolve({
            status: "success",
            paymentId,
            method: "cod",
            reason: "Cash on delivery order confirmed"
          });
          return;
        }

        // 2. UPI PAYMENT METHOD
        if (method === "upi") {
          const upiId = (details.upiId || "").trim().toLowerCase();
          if (upiId === "fail@test") {
            resolve({
              status: "failed",
              paymentId,
              method: "upi",
              reason: "UPI request timed out by issuing bank"
            });
          } else {
            // Default UPI succeeds (including success@test)
            resolve({
              status: "success",
              paymentId,
              method: "upi",
              reason: "UPI payment approved"
            });
          }
          return;
        }

        // 3. CARD PAYMENT METHOD
        if (method === "card") {
          const rawCardNumber = (details.cardNumber || "").replace(/\D/g, "");

          // OTP check if provided
          if (details.otp !== undefined) {
            if (details.otp === "000000") {
              resolve({
                status: "failed",
                paymentId,
                method: "card",
                reason: "Invalid OTP entered (000000)"
              });
              return;
            }
          }

          // Deterministic card test rules
          if (rawCardNumber === "4000000000000002") {
            resolve({
              status: "failed",
              paymentId,
              method: "card",
              reason: "Card declined by bank"
            });
          } else if (rawCardNumber === "4000000000009995") {
            resolve({
              status: "failed",
              paymentId,
              method: "card",
              reason: "Insufficient funds in account"
            });
          } else {
            // Default card succeeds (including 4111 1111 1111 1111)
            resolve({
              status: "success",
              paymentId,
              method: "card",
              reason: "Card payment authorized successfully"
            });
          }
          return;
        }

        // Default fallback
        resolve({
          status: "failed",
          paymentId,
          method,
          reason: "Unsupported payment method"
        });
      }, delay);
    });
  }
}
