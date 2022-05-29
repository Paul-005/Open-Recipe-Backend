const { Router } = require("express");
const verifyUser = require("./jwtVerifier");
const stripe = require("stripe")(
  "sk_test_51JGPiESGsKLMr3E0SUPCLs7KHD5Q5MLY1SfkEGcW5cfaGKTgahKbeFtRjhn117w1qLr0pXy7Kjpk5PoYbohVnzd000RIndH1Cu"
);
const jwt = require("jsonwebtoken");
const UserModal = require("../../modals/UserModal");

const route = Router();

const proPayment = route.get("/propayment", verifyUser, async (req, res) => {
  const user_email = jwt.decode(req.headers.token);

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `https://open-recipe-paul.vercel.app/pro-payment/success/`,
      cancel_url: "https://open-recipe-paul.vercel.app/pro-payment/cancel",
      payment_method_types: ["card"],
      customer_email: user_email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Pro Membership",
            },
            unit_amount: 20000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
    });

    UserModal.findOneAndUpdate(
      { email: user_email },
      {
        proMember: {
          id: session.id,
        },
      },
      { pro: true }
    )
      .then((data) => {
        res.json({ url: session.url });
      })
      .catch((err) => res.status(500).json({ err: err.message }));
  } catch (error) {
    console.log(error);
    res.json({ error: error.message, mes: "error os stripe" });
  }
});

module.exports = proPayment;
