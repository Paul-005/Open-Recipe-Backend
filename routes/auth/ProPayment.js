const { Router } = require("express");
const stripe = require("stripe")(
  ""
);

const route = Router();

const proPayment = route.get("/propayment", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "https://open-recipe-paul.vercel.app/pro-payment/success",
      cancel_url: "https://open-recipe-paul.vercel.app/pro-payment/cancel",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Pro Membership"
            },
            unit_amount: 20000
          },
          quantity: 1
        }
      ],
      mode: "payment"
    });
    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ error: error.message });
  }
});

module.exports = proPayment;
