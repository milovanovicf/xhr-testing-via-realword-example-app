/// <reference types='cypress' />

describe("SignUp", () => {
  let randomString = Math.random().toString(36).substring(2);
  let userName = "user_" + randomString;
  let email = "email_" + randomString + "@gmail.com";
  let password = "Password1";
  beforeEach(function () {
    cy.visit("http://localhost:4200/");
  });
  it("Test valid Sign up", () => {
    // cy.server();
    /*  cy.route("POST", "https://conduit.productionready.io/api/users").as(
      "newUser"
    ); */
    cy.intercept("POST", " **/users").as("newUser");
    cy.xpath("//a[@href='/register']").click();
    cy.get('[placeholder="Username"]').type(userName);
    cy.get("[placeholder='Email']").type(email);
    cy.get('[placeholder="Password"]').type(password);
    cy.get('[type="submit"]').click();

    cy.wait("@newUser");
    cy.get("@newUser").should((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
      expect(xhr.request.body.user.username).to.eq(userName);
      expect(xhr.request.body.user.email).to.eq(email);
    });
  });
  it("Test valid login", () => {
    // cy.server();
    //cy.route("GET", "**/tags", "fixture:popularTags.json");
    cy.intercept("GET", "**/tags", { fixture: "popularTags.json" });
    cy.xpath('//a[contains(text(),"Sign in")]').click();
    cy.get("[placeholder='Email']").type(email);
    cy.get('[placeholder="Password"]').type(password);
    cy.get("button").contains("Sign in").click();
    cy.get(":nth-child(4) > .nav-link").should("be.visible");

    cy.get(".tag-list").should("contain", "qauni").and("contain", "cypress");
  });
  it("Mock global feed data", () => {
    cy.intercept("GET", "**/articles*", { fixture: "popularArticles.json" }).as(
      "articles"
    );
    cy.xpath('//a[contains(text(),"Sign in")]').click();
    cy.get("[placeholder='Email']").type(email);
    cy.get('[placeholder="Password"]').type(password);
    cy.get('[type="submit"]').click();
    cy.wait("@articles");
    // cy.server();
    //cy.route("GET", "**/articles*", "fixture:popularArticles.json").as();
  });
});
