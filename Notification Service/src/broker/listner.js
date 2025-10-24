import { sendEmail } from "../utils/email.js";
import { subscribeToQueue } from "./rabbit.js";

function Listner() {
  subscribeToQueue("user_create_by_google", async (msg) => {
    const {
      email,
      fullname: { firstname, lastname },
      role,
    } = msg;

    console.log(msg);

    const template = `
      <h2>Welcome, ${firstname}!</h2>
      <p>Your registration as a <b>${role}</b> was successful.</p>
      <p>You can now log in to your account and start using our services.</p>
      <a href="https://yourwebsite.com/login">Login Here</a>
      <br/><br/>
      <small>Thank you,<br/>Beatly Music</small>
    `;

    const text = `
      Hi ${firstname},

      Your registration as a ${role} was successful!
      You can now log in to your account.

      Thank you,
      Beatly Music
    `;

    await sendEmail(email, "Registration Successful", text, template);
    console.log(`✅ Registration email sent to ${email}`);
  });
  subscribeToQueue("user_create", async (msg) => {
    const {
      email,
      fullname: { firstname, lastname },
      role,
    } = msg;

    console.log(msg);

    const template = `
      <h2>Welcome, ${firstname}!</h2>
      <p>Your registration as a <b>${role}</b> was successful.</p>
      <p>You can now log in to your account and start using our services.</p>
      <a href="https://yourwebsite.com/login">Login Here</a>
      <br/><br/>
      <small>Thank you,<br/>Beatly Music</small>
    `;

    const text = `
      Hi ${firstname},

      Your registration as a ${role} was successful!
      You can now log in to your account.

      Thank you,
      Beatly Music
    `;

    await sendEmail(email, "Registration Successful", text, template);
    console.log(`✅ Registration email sent to ${email}`);
  });
}

export default Listner;
