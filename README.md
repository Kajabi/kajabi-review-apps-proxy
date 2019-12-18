Kajabi Review Apps Proxy
------------------------

This is a proxy deployed to fly.io under the name `kajabi-review-apps`. Its purpose is to proxy nice-looking, SSL-enabled wildcard hostnames to Kajabi's Review Apps, which by default are given non-descriptive randomized URLs.

### Example:

Given a Review App attached to PR 123

    https://app.pr-123.kajabi-staging.com
    https://checkout.pr-123.kajabi-staging.com
    https://mysite.pr-123.mykajabi-staging.com

would all be proxied to (for example)

    https://kajabi-pipeline-rev-abc123.herokuapp.com

The proxy expects a CNAME to be available in the above example at `pr-123.kajabi-staging.com` which specifies the Heroku hostname associated with the Review App. This CNAME, and the others required to route to Fly, are added during the postdeploy rake task of the Review Apps.
