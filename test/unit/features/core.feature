Feature: You should be able to retrieve cores and execute their methods

  Scenario: Core injected and it's method executed via a public route
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a (callback) core named myCore with method {ping} that returns {pong response}
    And a "public" route with "get" method @ "/public/ping" with a controller that uses core myCore
    When I "get" @ "/public/ping"
    Then the response should contain "pong response"
    And the statusCode should be ok

  Scenario: Core injected and it's method executed via a private route
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a (callback) core named myCore with method {ping} that returns {pong response}
    And a "private" route with "get" method @ "/private/ping" with a controller that uses core myCore
    When I "get" @ "/private/ping" with header
    Then the response should contain "pong response"
    And the statusCode should be ok

  Scenario: Core injected and it's method executed via a private route
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a (callback) core named myCore with method {ping} that returns {pong response}
    And a "private" route with "get" method @ "/private/ping" with a controller that uses core myCore
    When I "get" @ "/private/ping"
    And the statusCode should not be ok

  Scenario: Core injected and it's method executed via a public route
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a (promise) core named myCore with method {ping} that returns {pong response}
    And a "public" route with "get" method @ "/public/ping" with a controller that uses core myCore
    When I "get" @ "/public/ping"
    Then the response should contain "pong response"
    And the statusCode should be ok

  Scenario: Core injected and it's method executed via a private route
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a (promise) core named myCore with method {ping} that returns {pong response}
    And a "private" route with "get" method @ "/private/ping" with a controller that uses core myCore
    When I "get" @ "/private/ping" with header
    Then the response should contain "pong response"
    And the statusCode should be ok

  Scenario: Core injected and it's method executed via a private route
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a (promise) core named myCore with method {ping} that returns {pong response}
    And a "private" route with "get" method @ "/private/ping" with a controller that uses core myCore
    When I "get" @ "/private/ping"
    And the statusCode should not be ok