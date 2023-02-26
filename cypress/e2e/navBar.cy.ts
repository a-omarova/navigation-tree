const topLvlData = require('../fixtures/topLvl')

describe('navigation bar', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays top level', () => {
    cy
      .get('[data-test-navbar=navBar] li')
      .should('have.length', topLvlData.data.length)
  })

  it('is node with children open after click', () => {
    cy
      .get(`[data-test-branch-haschildren=true]`)
      .each((elem) => {
        cy.wrap(elem).click()

        cy.wrap(elem).should('have.attr', 'data-test-branch-open', 'true')
      })
  })

  it('is node with children close after double click', () => {
    cy
      .get(`[data-test-branch-open=false]`)
      .each((elem) => {
        cy.wrap(elem).click()
        cy.wrap(elem).click()

        cy.wrap(elem).should('have.attr', 'data-test-branch-open', 'false')
      })
  })

  it('is node without children do not open', () => {
    cy
      .get(`[data-test-branch-haschildren=false]`)
      .each((elem) => {
        cy.wrap(elem).click()

        cy.wrap(elem).should('have.attr', 'data-test-branch-open', 'false')
      })
  })

  it('displays preload', () => {
    cy.get(`[data-test-navbar=preload]`).should('be.visible');
    cy.get(`[data-test-navbar=preload]`).should('not.exist');
  })
})

export {}
