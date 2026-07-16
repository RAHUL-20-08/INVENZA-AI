import { loginUser } from './backend/controllers/authController.js';

const req = {
  body: {
    email: 'the_founder@invenza.io',
    password: 'founder123',
    portalType: 'student'
  },
  headers: { 'user-agent': 'Mozilla/5.0 Node.js' },
  ip: '127.0.0.1'
};

const res = {
  status: (code) => {
    console.log('Status set to:', code);
    return res;
  },
  json: (data) => {
    console.log('JSON returned:', data);
  }
};

(async () => {
  await loginUser(req, res);
})();
