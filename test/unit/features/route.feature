Feature: You should be able to call routes

  Scenario: A public route on the API is called without credentials
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "public" route with "get" method @ "/public/ping"
    When I "get" @ "/public/ping"
    And the statusCode should be ok

  Scenario: A private route on the API is called with credentials
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "private" route with "get" method @ "/private/ping"
    When I "get" @ "/private/ping" with header
    And the statusCode should be ok

  Scenario: A private route on the API is called without credentials
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "private" route with "get" method @ "/private/ping"
    When I "get" @ "/private/ping"
    And the statusCode should not be ok