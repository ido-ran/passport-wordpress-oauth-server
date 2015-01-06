/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;


/**
 * `Strategy` constructor.
 *
 * The Wordpress authentication strategy authenticates requests by delegating
 * to Wordpress using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Wordpress application's client id
 *   - `clientSecret`  your Wordpress application's client secret
 *   - `wordpressUrl`  Your Wordpress application's URL
 *   - `callbackURL`   URL to which Wordpress will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new WordpressStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         wordpressUrl: 'http://your-wp.com'
 *         callbackURL: 'https://www.example.net/auth/wordpress/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  if (!options.wordpressUrl) throw new Error('WordPress OAuth Server Passport Strategy requires a wordpressUrl option');

  options.authorizationURL = options.authorizationURL || options.wordpressUrl + '/oauth/authorize/';
  options.tokenURL = options.tokenURL || options.wordpressUrl + '/oauth/token/';
  this.profileUrl = options.profileUrl || options.wordpressUrl + '/oauth/me/'; // Note: Must add slash at the end, otherwise 301 will be returned
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'wordpress';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Wordpress.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `wordpress`
 *   - `id`               the user's ID
 *   - `displayName`      the user's username
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.useAuthorizationHeaderforGET(true);
    
  this._oauth2.get(this.profileUrl, accessToken, function (err, body, res) {      
    if (err) { return done(err); }

    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'WordPress-OAuth-Server' };
      profile.id = json.ID;
      profile.displayName = json.display_name;
      profile.emails = [{ value: json.user_email }];
      
      profile._raw = body;
      profile._json = json;
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/** The default oauth2 strategy puts the access_token into Authorization: header AND query string
  * witch is a violation of the RFC so lets override and not add the header and supply only the token for qs.
  */
Strategy.prototype.get = function(url, access_token, callback) {
  this._oauth2._request("GET", url, {}, "", access_token, callback );
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
