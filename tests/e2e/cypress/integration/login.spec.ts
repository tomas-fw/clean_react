import faker from 'faker';
import { FormHelper, HttpMocks } from '../utils';

const path = /login/;
const mockInvalidCredentialsError = (): void =>
  HttpMocks.mockInvalidCredentialsError(path);

const mockUnexpectedError = (): void =>
  HttpMocks.mockUnexpectedError(path, 'POST');

const mockSuccess = (): void =>
  HttpMocks.mockSuccess(path, 'POST', { accessToken: faker.datatype.uuid() });

const mockInvalidResponse = (): void =>
  HttpMocks.mockSuccess(path, 'POST', { invalidData: faker.datatype.uuid() });

const simulateValidSubmit = (): void => {
  cy.getByTestId('email').focus().type(faker.internet.email());
  cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5));

  cy.getByTestId('submit').click();
};

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login');
  });

  it('Should load with correct initial state', () => {
    cy.getByTestId('email').should('have.attr', 'readOnly');
    FormHelper.testInputStatus('email', 'Required');

    cy.getByTestId('password').should('have.attr', 'readOnly');

    FormHelper.testInputStatus('password', 'Required');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present error state if form is invalid', () => {
    cy.getByTestId('email').focus().type(faker.random.word());

    FormHelper.testInputStatus('email', 'Invalid Field');

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(3));

    FormHelper.testInputStatus('password', 'Field Is Too Short');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present valid state if form is valid', () => {
    cy.getByTestId('email').focus().type(faker.internet.email());

    FormHelper.testInputStatus('email');

    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5));
    FormHelper.testInputStatus('password');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrap').should('not.have.descendants');
  });

  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError();

    simulateValidSubmit();

    FormHelper.testMainError('Invalid Credentials');

    FormHelper.testUrl('/login');
  });

  it('Should present UnexpectedError on 400 ', () => {
    mockUnexpectedError();
    simulateValidSubmit();

    FormHelper.testMainError('Something went wrong. Please try again');
    FormHelper.testUrl('/login');
  });

  it('Should present UnexpectedError if invalid data is returned', () => {
    mockInvalidResponse();
    simulateValidSubmit();

    FormHelper.testMainError('Something went wrong. Please try again');
  });

  it('Should save accessToken if valid credentials are provided', () => {
    mockSuccess();
    simulateValidSubmit();

    FormHelper.testUrl('/');

    FormHelper.testLocalStorageItem('accessToken');
  });

  it('Should prevent multiple submits', () => {
    mockSuccess();

    cy.getByTestId('email').focus().type(faker.internet.email());
    cy.getByTestId('password').focus().type(faker.random.alphaNumeric(5));

    cy.getByTestId('submit').dblclick();
    cy.get('@request.all').should('have.length', 1);
  });

  it('Should submit form by clicking enter', () => {
    mockSuccess();

    simulateValidSubmit();

    FormHelper.testHttpCallsCount(1);
  });

  it('Should not call submit if form is invalid', () => {
    mockSuccess();

    cy.getByTestId('email')
      .focus()
      .type(faker.internet.email())
      .type('{enter}');

    FormHelper.testHttpCallsCount(0);
  });
});
