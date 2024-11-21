const request = require('request');

class OTP {
  constructor(baseURL, customerId, email, password) {
    this.baseURL = baseURL;
    this.customerId = customerId;
    this.email = email;
    this.password = password;
    this.verificationId = null;
  }

  async generateAuthToken() {
    console.log('Password:', this.password);
    console.log('Base URL:', this.baseURL);
    console.log('Customer ID:', this.customerId);
    console.log('Email:', this.email);

    if (!this.password) {
      throw new Error('Password is undefined or null');
    }

    const base64String = Buffer.from(this.password).toString('base64');
    const url = `${this.baseURL}/auth/v1/authentication/token?country=IN&customerId=${this.customerId}&email=${this.email}&key=${base64String}&scope=NEW`;

    const options = {
      url: url,
      headers: {
        accept: '*/*',
      },
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          console.error('Error generating auth token:', error);
          reject(error);
          return;
        }

        try {
          const parsedBody = JSON.parse(body);
          const authToken = parsedBody?.token;

          if (!authToken) {
            reject(new Error('Auth token missing in response'));
            return;
          }

          console.log('Auth Token:', authToken);
          resolve(authToken);
        } catch (e) {
          reject(new Error('Error parsing auth token response'));
        }
      });
    });
  }

  async sendOtp(authToken, countryCode, mobileNumber) {
    const url = `${this.baseURL}/verification/v2/verification/send?countryCode=${countryCode}&customerId=${this.customerId}&flowType=SMS&mobileNumber=${mobileNumber}`;
  
    const options = {
      url: url,
      method: 'POST',
      json: true,
      headers: {
        accept: '*/*',
        authToken: authToken,
      },
    };
  
    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          console.error('Error sending OTP:', error);
          reject(error);
          return;
        }
  
        // Log the full response for debugging
        console.log('Response Status:', response.statusCode);
        console.log('Response Body:', body);
  
        // Check for response status codes and errors
        if (response.statusCode !== 200) {
          const errorMessage = body.errorMessage || 'Unknown error';
          console.error(`Error sending OTP: ${errorMessage}`);
          reject(new Error(`Error sending OTP: ${errorMessage}`));
          return;
        }
  
        // Assuming the OTP response has a `data` field with `verificationId`
        if (body.data && body.data.verificationId) {
          this.verificationId = body.data.verificationId;
          resolve(body);
        } else {
          console.error('Unexpected response format:', body);
          reject(new Error('Unexpected response format'));
        }
      });
    });
  }
  

  async validateOtp(authToken, otpCode, countryCode, mobileNumber) {
    const url = `${this.baseURL}/verification/v2/verification/validateOtp?countryCode=${countryCode}&mobileNumber=${mobileNumber}&verificationId=${this.verificationId}&customerId=${this.customerId}&code=${otpCode}`;

    const options = {
      url: url,
      method: 'GET',
      json: true,
      headers: {
        accept: '*/*',
        authToken: authToken,
      },
    };

    return new Promise((resolve, reject) => {
      request(options, (error, response, body) => {
        if (error) {
          console.error('Error validating OTP:', error);
          reject(error);
          return;
        }

        console.log('Request:', options);
        console.log('Body:', body);

        resolve(body);
      });
    });
  }
}

module.exports = OTP;
