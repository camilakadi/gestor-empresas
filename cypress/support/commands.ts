/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      waitForMUI(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("waitForMUI", () => {
  cy.wait(100);
});

export {};
