describe('Responsive Behavior', () => {
  const sizes = ['iphone-6', 'ipad-2', { width: 1280, height: 720 }];
  sizes.forEach((size) => {
    it(`displays dashboard correctly for viewport: ${JSON.stringify(size)}`, () => {
      if (typeof size === 'string') {
        cy.viewport(size);
      } else {
        cy.viewport(size.width, size.height);
      }
      cy.loginAsWorker();
      cy.visit('/worker/dashboard');
      // Check key elements in dashboard
      cy.get('h3, h4, h6').first().should('be.visible');
      cy.get('button').contains(/Find Jobs|Find Work/).first().should('be.visible');
    });
  });
});