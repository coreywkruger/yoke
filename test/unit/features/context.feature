Feature: You should be able to initialize yoke with proper context

  Scenario: A yoke is created with a public route and all the fixins'
    Given a yoke
    And a express http adapter
    And a route with "post" method @ "/public/ping" with a controller
    And a (callback) core named myCore with method {ping} that returns {pong response}
    When I listen on port {8020}
    And I post @ "/public/ping" with body and querystring
    Then the response should have a body field ping equal to pong
    And the response should have a param query equal to pong
    And the statusCode should be ok

  Scenario: A yoke is created with a public route and all the fixins'
    Given a yoke
    And a express http adapter
    And a route with "post" method @ "/public/ping" with a controller
    And a (promise) core named myCore with method {ping} that returns {pong response}
    When I listen on port {8020}
    And I post @ "/public/ping" with body and querystring
    Then the response should have a body field ping equal to pong
    And the response should have a param query equal to pong
    And the statusCode should be ok
