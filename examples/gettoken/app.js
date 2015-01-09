var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , TradeGeckoStrategy = require('../../lib/index.js').Strategy;

// Application ID from https://go.tradegecko.com/oauth/applications/????
//var TRADEGECKO_CLIENT_ID = "--insert-tradegecko-client-id-here--"
// Secret from https://go.tradegecko.com/oauth/applications/????
//var TRADEGECKO_CLIENT_SECRET = "--insert-tradegecko-client-secret-here--";


var TRADEGECKO_CLIENT_ID = "6393765383e8fc1a8b4e5ead100b4add51cdc791a3c17bc26f2ffdbc709710be"

var TRADEGECKO_CLIENT_SECRET = "231e5e00f1be67500088dc92e77982f38a5e046fe0b93ae5d99909801dec958b";


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete TradeGecko profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the TradeGeckoStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and TradeGecko
//   profile), and invoke a callback with a user object.
passport.use(new TradeGeckoStrategy({
    clientID: TRADEGECKO_CLIENT_ID,
    clientSecret: TRADEGECKO_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/tradegecko/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      console.log('Here is the access_token:');
      console.log(accessToken);

      // To keep the example simple, the user's TradeGecko profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the TradeGecko account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));




var app = express.createServer();

// configure Express
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
//  console.log(req);
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});

// GET /auth/tradegecko
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in TradeGecko authentication will involve redirecting
//   the user to tradegecko.com.  After authorization, TradeGecko will redirect the user
//   back to this application at /auth/tradegecko/callback
app.get('/auth/tradegecko',
  passport.authenticate('tradegecko'),
  function(req, res){
    // The request will be redirected to TradeGecko for authentication, so this
    // function will not be called.
  });

// GET /auth/tradegecko/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/tradegecko/callback', 
  passport.authenticate('tradegecko', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req);

    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
