Feature: You should be able to call routes

  Scenario: A public route on the API is called without credentials
    Given a public route
    When I call route without credentials
    Then I should receive a response body
    And I should get status code 200

  Scenario: A private route on the API is called with credentials
    Given a private route
    When I call route with credentials
    Then I should receive a response body
    And I should get status code 200

  Scenario: A private route on the API is called without credentials
    Given a private route
    When I call route without credentials
    Then I should not get status code 200