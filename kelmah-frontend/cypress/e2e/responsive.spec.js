describe('Responsive Behavior', () => {
  const sizes = ['iphone-6', 'ipad-2', [1280, 720]];
  sizes.forEach((size) => {
    it(`displays dashboard correctly for viewport: ${size}`, () => {
      cy.viewport(size);
      cy.loginAsWorker();
      cy.visit('/worker/dashboard');
      cy.get('h3, h4, h6').should('be.visible');
      // Check quick actions are visible
      cy.get('button').contains('Find Jobs').should('be.visible');
    });
  });
});