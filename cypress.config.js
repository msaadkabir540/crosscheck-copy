// const { defineConfig } = require("cypress");

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    crossCheckURL: 'http://localhost:3000/',
    loginEmail: 'aizaamir8@gmail.com',
    loginPassword: 'Admin@123',
    saifEmail: 'sprintxdemo@gmail.com',
    saifPassword: 'Admin1##',
    saadEmail: 'saad.baig@sprintx.net',
    saadPassword: 'Admin@123',
    laibaEmail: 'laiba.javaid@sprintx.net',
    laibaPassword: 'Admin@123',
    devEmail: 'aiza.amir@sprintx.net',
    devPassword: 'Admin@123',
  },
});

// crossCheckURL:"http://localhost:3000/",
// loginEmail: "aizaamir8@gmail.com",
// loginPassword: "Admin@123",
// saifEmail:"sprintxdemo@gmail.com",
// saifPassword:"Admin1##",
// saadEmail:"saad.baig@sprintx.net",
// saadPassword:"Admin@123",
// laibaEmail:"laiba.javaid@sprintx.net",
// laibaPassword:"Admin@123",
// devEmail:"aiza.amir@sprintx.net",
// devPassword:"Admin@123",
