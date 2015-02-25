var Deferred = require('deferred');
var Browser = require('zombie');

module.exports = function(email, password, url) {
  
  var browser = new Browser({
    //debug:true,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36'
  });
  
  var def = Deferred();
  console.log(url);

  browser.visit(url).then(function(){
    
    if(browser.query('#txtPassword')){
      
      browser.fill('txtUsername', email);
      browser.fill('txtPassword', password);
      browser.pressButton('Log In', function(){
        
        if(browser.query('#header_errors li')){
          def.reject('WRONG_CREDENTIALS')
        }

        var html = browser.html();
        var match = html.match(/Documents you have uploaded \((\d+)\)/);
        if(match === null || !match[1]) {
          def.reject('WRONG_URL')
        }

        var docs = parseInt(match[1], 10);
        
        browser.close();
        browser = null;
        def.resolve(docs);
      });  
    } 
  });

  return def.promise;
};

/*
  browser.visit(url).then(function(){
    console.log('abriu pag\n');
    if(browser.query('#txtPassword')){
      console.log('preenchendo form');
      browser.fill('txtUsername', email);
      browser.fill('txtPassword', password);
      return browser.pressButton('Log In');  
    } 
  }).then(function(){
    console.log("tentou logar!\n");
    if(browser.query('#header_errors li')){
      def.reject('WRONG_CREDENTIALS')
    }

    var html = browser.html();
    var match = html.match(/Documents you have uploaded \((\d+)\)/);
    if(match === null || !match[1]) {
      def.reject('WRONG_URL')
    }

    var docs = parseInt(match[1], 10);
    
    browser.close();
    browser = null;
    def.resolve(docs);
  });

  return def.promise;
};
*/