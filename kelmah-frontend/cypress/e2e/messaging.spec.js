describe('Messaging System', () => {
  it('sends and receives messages in a conversation', () => {
    // Login as worker and create conversation with hirer
    cy.loginAsWorker();
    cy.visit('/worker/dashboard');
    // Navigate to hirer profile and start conversation
    cy.visit('/profiles/user/hirer-456');
    cy.get('button').contains('Message').click();
    // Confirm conversation appears
    cy.visit('/messages');
    cy.get('ul').should('exist');
    cy.get('li').first().click();
    // Send a message
    cy.get('textarea').type('Hello from worker');
    cy.get('button').contains('Send').click();
    cy.contains('Hello from worker').should('exist');
    // Simulate hirer response in same session
    cy.loginAsHirer();
    cy.visit('/messages');
    cy.get('li').first().click();
    cy.get('textarea').type('Hello back from hirer');
    cy.get('button').contains('Send').click();
    cy.contains('Hello back from hirer').should('exist');
  });
});