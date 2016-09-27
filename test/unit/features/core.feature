Feature: You should be able to retrieve cores and execute their methods

  Scenario: Core injected and it's method executed via a public route
    Given a yoke
    And a express http adapter
    And a (callback) core named myCore with method {ping} that returns {pong response}
    And a route with "get" method @ "/public/ping" with a controller that uses core myCore
    When I listen on port {8020}
    And I "get" @ "/public/ping"
    Then the response should contain "pong response"
    And the statusCode should be ok

  Scenario: Core injected and it's method executed via a public route
    Given a yoke
    And a express http adapter
    And a (promise) core named myCore with method {ping} that returns {pong response}
    And a route with "get" method @ "/public/ping" with a controller that uses core myCore
    When I listen on port {8020}
    And I "get" @ "/public/ping"
    Then the response should contain "pong response"
    And the statusCode should be ok
