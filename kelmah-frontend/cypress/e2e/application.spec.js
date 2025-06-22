describe('Job Application Wizard', () => {
  it('completes the application flow successfully', () => {
    cy.loginAsWorker();
    cy.visit('/worker/find-work');
    // Perform search
    cy.get('button').contains('Search Jobs').click();
    // Open first job
    cy.get('button').contains('View Details').first().click();
    // Click Apply
    cy.get('button').contains('Apply for this Job').click();
    // Step 2: Your Proposal
    cy.get('textarea[name="coverLetter"]').type('I am the best candidate.');
    cy.get('input[name="proposedBudget"]').type('100');
    cy.get('input[name="estimatedDuration"]').type('5');
    // Attach a file
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf');
    cy.contains('Next').click();
    // Step 3: Proposed Milestones (skip)
    cy.contains('Next').click();
    // Step 4: Review & Submit
    cy.contains('Submit Application').click();
    // Verify success message
    cy.contains('Your application has been submitted successfully').should('be.visible');
  });
});