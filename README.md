# Node.js Middleware Study

This project contains a simple Node.js **express** server to study middleware chains.

The _/user_ endpoint path allows to experiment the executed middleware chain according to both middleware stack and sub-stacks. Play with user id 0 and other values to explore how conditionally created middleware chain are assembled. These tests also allow to better understand the effects of `next("route")` and `next("router")`.

The _/error_ endpoint path allows to explore how error flows in an express application, distinguishing between the case of synchronous and asynchronous route handlers producing errors for triggering the error middleware chain.
