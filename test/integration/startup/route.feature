Feature: You should be able to call routes

  Scenario: A public route on the API is called without credentials
    Given a public route
    When I call it without credentials
    Then I should receive a response body

  Scenario: A private route on the API is called with credentials
    Given a private route
    When I call the private route it with credentials
    Then I should receive a response body

  Scenario: A private route on the API is called without credentials
    Given a private route
    When I call the private route without credentials
    Then I should receive an error from the API