const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID; // شناهسه فروشنده است 
// const BASE_URL = "https://api.zarinpal.com"; در حالت واقعی این میشود 
const BASE_URL = "https://sandbox.zarinpal.com"; // مشخص میکند با کدام زرین پال صحبت میکیم

export async function createPayment(amount, callbackURL, description) {
  const response = await fetch(`${BASE_URL}/pg/v4/payment/request.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID, //فروشنده کیست 
      amount, // چقدر 
      callback_url: callbackURL, // بعد از پرداخت کجا برگردد 
      description, // برای چه چیزی
    }),
  });

  return await response.json();
}





export async function verifyPayment(authority, amount) {
  const response = await fetch(`${BASE_URL}/pg/v4/payment/verify.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      authority,
      amount,
    }),
  });

  return await response.json();
}



export function getPaymentUrl(authority) {
  return `${BASE_URL}/pg/StartPay/${authority}`;
}