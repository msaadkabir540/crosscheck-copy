import './commands';
import 'cypress-localstorage-commands';

require('@4tw/cypress-drag-drop');

require('@cypress/xpath');

Cypress.Commands.add('login', (email = 'aizaamir8@gmail.com', password = 'Admin@123') => {
  cy.request({
    method: 'POST',
    url: 'https://api-dev.crosscheck.cloud/api/auth/login',
    body: {
      email: email,
      password: password,
    },
  }).then((resp) => {
    window.localStorage.setItem('accessToken', resp.headers.authorization);
    window.localStorage.setItem('user', JSON.stringify(resp.body.data));
  });
});
//     // cypress/support/index.js
// require('dotenv').config();
// // cypress/support/commands.js

// Cypress.Commands.add('login', () => {
//   const email = Cypress.env('loginEmail') || 'fallback-email@example.com';
//   const password = Cypress.env('loginPassword') || 'fallback-password';

//   // Your login logic here
//   // Example:
//   cy.get('#email').type("aizaamir8@gmail.com");
//   cy.get('#password').type("Admin@123")
// });
