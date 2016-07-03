Feature: You should be able to initialize yoke with proper context

  Scenario: A yoke is created with a public route and all the fixins'
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "public" route with "post" method @ "/public/ping" with a controller
    And a (callback) core named myCore with method {ping} that returns {pong response}
    When I start yoke
    And I post @ "/public/ping" with body and querystring
    Then the response should have a body field ping equal to pong
    And the response should have a param query equal to pong
    And the statusCode should be ok

  Scenario: A yoke is created with a private route and all the fixins'
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "private" route with "post" method @ "/private/ping" with a controller
    And a (callback) core named myCore with method {ping} that returns {pong response}
    When I start yoke
    And I post @ "/private/ping" with body, querystring, and header
    Then the response should have a body field ping equal to pong
    And the response should have a param query equal to pong
    And the response should have a session who equal to me
    Then the statusCode should be ok

  Scenario: A yoke is created with a private route and all the fixins'
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "private" route with "post" method @ "/private/ping" with a controller
    And a (callback) core named myCore with method {ping} that returns {pong response}
    When I start yoke
    And I post @ "/private/ping" with body and querystring
    Then the statusCode should not be ok

  Scenario: A yoke is created with a public route and all the fixins'
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "public" route with "post" method @ "/public/ping" with a controller
    And a (promise) core named myCore with method {ping} that returns {pong response}
    When I start yoke
    And I post @ "/public/ping" with body and querystring
    Then the response should have a body field ping equal to pong
    And the response should have a param query equal to pong
    And the statusCode should be ok

  Scenario: A yoke is created with a private route and all the fixins'
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "private" route with "post" method @ "/private/ping" with a controller
    And a (promise) core named myCore with method {ping} that returns {pong response}
    When I start yoke
    And I post @ "/private/ping" with body, querystring, and header
    Then the response should have a body field ping equal to pong
    And the response should have a param query equal to pong
    And the response should have a session who equal to me
    Then the statusCode should be ok

  Scenario: A yoke is created with a private route and all the fixins'
    Given a yoke
    And a express http adapter
    And a header auth adapter
    And a "private" route with "post" method @ "/private/ping" with a controller
    And a (promise) core named myCore with method {ping} that returns {pong response}
    When I start yoke
    And I post @ "/private/ping" with body and querystring
    Then the statusCode should not be ok