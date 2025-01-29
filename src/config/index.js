export const config = {
  server: {
    port: process.env.PORT || 3000
  },
  mongodb: {
    uri: "mongodb://localhost:27017/simpleshop",
    options: {
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 3000
    }
  },
  session: {
    // Secret key to encrypt client side sessions.
    // Created on the terminal with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
    secret: "x3cIkEhWRLRLBD8Zfhd2SUw0UEGieSjOVV2a1a82YEE="
  }
};
