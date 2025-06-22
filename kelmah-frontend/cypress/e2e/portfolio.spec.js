describe('Portfolio Upload', () => {
  it('uploads a new portfolio project', () => {
    cy.loginAsWorker();
    cy.visit('/worker/dashboard');
    // Open Add dialog
    cy.get('button').contains('Add').click();
    // Fill form
    cy.get('input[label="Title"]').type('Test Project');
    cy.get('textarea[label="Description"]').type('This is a test project description.');
    cy.get('input[type="date"]').first().type('2025-06-30');
    // Upload image (ensure fixture exists)
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.jpg');
    // Submit
    cy.get('button').contains('Add Project').click();
    // Verify new project appears
    cy.contains('Test Project').should('be.visible');
    // Accessibility audit
    cy.injectAxe();
    cy.checkA11y();
  });
});