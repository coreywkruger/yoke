Feature: You should be able to call routes

  Scenario: A public route on the API is called without credentials
    Given a yoke
    And a express http adapter
    And a route with "get" method @ "/public/ping"
    When I listen on port {8020}
    And I "get" @ "/public/ping"
    And the statusCode should be ok
