/* global Cypress */

const COMMAND_DELAY = 10000;

for (const command of ["visit"]) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("here");
        resolve(originalFn(...args));
      }, COMMAND_DELAY);
    });
  });
}
