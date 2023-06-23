const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

async function getGoogleOAuthTokens(code) {
  const data = {
    code,
    client_id: process.env.OAUTH_CLIENT,
    client_secret: process.env.OAUTH_SECRET,
    redirect_uri: process.env.OAUTH_REDIRECT,
    grant_type: "authorization_code",
  };
  // console.log(data);
  try {
    const response = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify(data),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
}

async function getGoogleUser({ access_token, id_token }) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    return err;
  }
}


module.exports = { getGoogleOAuthTokens, getGoogleUser };
