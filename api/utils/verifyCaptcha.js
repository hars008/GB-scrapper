const axios = require('axios');
const verifyCaptcha = async(token) => {
    const secret = process.env.RECAPTCHA_SECRET_KEY ;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    const response = await axios.post(url);
    return response.data.success;
}

module.exports = verifyCaptcha;