Feature: You should be able to retrieve cores and execute their methods

  Scenario: Core injected and it's method executed via a public route
    Given a core
    And a public route with a controller that uses that core
    When I call the route that uses cores
    Then the route's controller should be able to execute the core's methods
    And I should receive a response with content from the core

  Scenario: Core injected and it's method executed via a private route
    Given a core
    And a private route with a controller that uses that core
    When I call the route that uses cores
    Then the route's controller should be able to execute the core's methods
    And I should receive a response with content from the core