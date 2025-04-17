// Example for Stripe (simplified version)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post("/payment", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body; // Assuming amount is passed from the client
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // Change to your currency
      metadata: { integration_check: "accept_a_payment" },
    });
    res.status(200).json(paymentIntent.client_secret);
  } catch (err) {
    res.status(500).json(err);
  }
});
