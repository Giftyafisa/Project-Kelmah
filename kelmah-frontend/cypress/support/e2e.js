import 'cypress-axe';

Cypress.Commands.add('loginAsWorker', () => {
  cy.visit('/');
  cy.window().then(win => {
    win.localStorage.setItem('kelmah_user', JSON.stringify({ id: 'worker-123', role: 'worker', firstName: 'TestWorker' }));
    win.localStorage.setItem('kelmah_auth_token', 'fake-token');
  });
});

Cypress.Commands.add('loginAsHirer', () => {
  cy.visit('/');
  cy.window().then(win => {
    win.localStorage.setItem('kelmah_user', JSON.stringify({ id: 'hirer-456', role: 'hirer', firstName: 'TestHirer' }));
    win.localStorage.setItem('kelmah_auth_token', 'fake-token');
  });
});

afterEach(() => {
  cy.clearLocalStorage();
});