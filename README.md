# Passport-TradeGecko

[Passport](http://passportjs.org/) strategy for authenticating with [TradeGecko](https://tradegecko.com/)
using the OAuth 2.0 API.

This module lets you authenticate using TradeGecko in your Node.js applications.
By plugging into Passport, TradeGecko authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

That said, after working with this a bit, I think you'd be more likely to use the simple Privileged Access Token from TradeGecko rather than all this complicatedness, especially if you are dealing with running your code from the server side.

When you authenticate to the TradeGecko site, you are auth'ing based on the TradeGecko account, not for a specific TradeGecko user.  My feeling is passport is more for user level auth tasks, not server to server auth.

Anywho, I got to play a bit with Passport.  Use the Privileged Access Token, only store it on your server, and you should be as secure as you can expect to be. 


## Usage

#### Configure Strategy

The TradeGecko authentication strategy authenticates users using a TradeGecko account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

    passport.use(new TradeGeckoStrategy({
        clientID: TRADEGECKO_CLIENT_ID,
        clientSecret: TRADEGECKO_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/tradegecko/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ tradegeckoId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'tradegecko'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/tradegecko',
      passport.authenticate('tradegecko'));

    app.get('/auth/tradegecko/callback', 
      passport.authenticate('tradegecko', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Examples

For a complete, working example, refer to the [login example](https://github.com/EdHubbell/passport-tradegecko/tree/master/examples/login).

## Credits

  - A blatant copy/past hack job initiated by [Ed Hubbell](http://github.com/edhubbell) based on the GitHub auth method created by [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
