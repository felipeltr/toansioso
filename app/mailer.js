var nodemailer = require('nodemailer');
var Deferred = require('deferred')

var mailpw = require('fs').readFileSync('/var/w3/mailpw.txt','utf8');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'toansioso2@gmail.com',
        pass: mailpw
    }
});


module.exports = function(opts) {
  var def = Deferred();

  opts.from = '<TOAnsioso> toansioso2@gmail.com';

  transporter.sendMail(opts, function(error, info){
      if(error){
          console.log(error);
          def.reject(error);
      }else{
          def.resolve(info.response);
          console.log('Message sent: ' + info.response);
      }
  });

  return def.promise;

};
