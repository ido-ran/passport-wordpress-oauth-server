# OAuth2-Complete-For-WordPress

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [OAuth2 Complete For WordPress Plugin](https://wordpress.org/plugins/oauth2-provider/) using the OAuth 2.0 API.

## Install

    $ npm install passport-oauth2-complete-for-wordpress

## Usage

#### Configure Strategy

The OAuth2 Complete For WordPress Plugin authentication strategy authenticates users using a Wordpress
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a client ID, client secret, and callback URL.

    passport.use(new WordpressStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        wordpressUrl: 'http://your-wp.com'
        callbackURL: 'http://localhost:5000/auth/wordpress/callback'
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ WordpressId: profile.id }, function (err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authorize()`, specifying the `'Wordpress'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/wordpress',
      passport.authorize('wordpress'));

    app.get('/auth/wordpress/callback', 
      passport.authorize('wordpress', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

## Based on

  This plugin is built based on [passport-wordpress](https://github.com/mjpearson/passport-wordpress)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013 Michael Pearson <[http://github.com/mjpearson](http://github.com/mjpearson)>  
Copyright (c) 2014-2015 Ido Ran <[http://github.com/ido-ran](http://github.com/ido-ran)>
