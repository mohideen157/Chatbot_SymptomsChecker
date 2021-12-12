var i18n = require('i18n');

i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['en', 'ta','ar', 'ar-sa','ch', 'cz','de', 'es','es-mx', 'es-xl',
  'et', 'fr','hi', 'hr','it', 'ka','ms', 'nl','pl', 'pt',
  'pt-br', 'ro','ru', 'si-lk','sk','uk','tr'],

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/locales',
  
  defaultLocale: 'en',
  
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});

module.exports = function(req, res, next) {
  i18n.init(req, res);
   //console.log(res);
  //res.local('__', res.__);
  res.locals.__= res.__;

 // var current_locale = i18n.getLocale();

  return next();
};