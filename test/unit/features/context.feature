Feature: You should be able to initialize yoke with proper context

  Scenario: A yoke is created with a public route and all the fixins'
    Given a yoke
    And an auth adapter
    And a public route with a controller
    And a new core
    When I start yoke
    And call the public route
    Then the context should be formated correctly

  Scenario: A yoke is created with a private route and all the fixins'
    Given a yoke
    And an auth adapter
    And a private route with a controller
    And a new core
    When I start yoke
    And call the private route
    Then the context should be formated correctly