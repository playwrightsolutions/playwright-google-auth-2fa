# playwright-google-auth-2fa

With this repo I demonstrate how to use Playwright to authenticate to a site that has google authentication with 2FA via a `auth.setup` file saving the state of the browser, so that all tests are able to start with a logged in state.

2FA Library: [otpauth](https://www.npmjs.com/package/otpauth)

To run the tests:

you will need to create a .env file with the following variables:

```bash
BASE_URL=https://www.tanyaaja.in
GOOGLE_EMAIL=
GOOGLE_PASSWORD=
GOOGLE_OTP_SECRET=
```

GOOGLE_EMAIL and GOOGLE_PASSWORD are the email and password for your Google account, I specifically didn't commit a .env file to this repo as you should keep your password and OTP secret private. There is however a .env.example that can be renamed to .env and filled out with your information.

The GOOGLE_OTP_SECRET is a little harder to get but if you have a google authenticator app on your phone you can go through the export process and get the secret from there, by exporting you will be presented with a QR code which you can then read with a QR code reader with a `QR-Code:otpauth://totp/Google%3A{email}?secret={secret}&issuer=Google`.

To run the tests you will need to run the following commands:

```bash
npm install
npx playwright install
npx playwright test
```

If you found this helpful please visit for other Playwright tips and tricks: <https://playwrightsolutions.com>.
