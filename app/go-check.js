var checker = require('./checker');
var mailer = require('./mailer');
var async = require('async');
var moment = require('moment');

var nullCbFn = function(callback) { callback(null); };

module.exports = function(db, concurrency, partition) {
  console.log('Starting check with partition ' + partition + '...');

  var users = db.get('users');

  var NYTIME = moment().subtract('hours', 5)
  var hours = NYTIME.hours();
  var weekday = NYTIME.weekday();
  var minutes = NYTIME.minutes();

  users.find({done: false}, function(err, all){

    // filters
    if(weekday === 6 || weekday === 0) {
      // on sat&sun, only check every 4 hours
      if(hours % 4 !== 0){
        console.log('Weekend skip.');
        process.exit(0);
      }
    } else {
      // on weekdays, 
      if(hours == 23 ||  hours == 1 || hours == 3 ||  hours == 5) {
        console.log('Weekday late night skip.');
        process.exit(0);
      }
    }

    if(partition === undefined || partition === null) {
      partition = parseInt(minutes/10);
    } else {
      partition = parseInt(partition);
    }
    
    var total = all.length;
    var per = Math.ceil(total/6);
    var min = partition*per;
    var max = (partition+1)*per;

    console.log('Starting check with users from partition ' + partition + '...');

    var tasks = all.map(function(user, i){

      if(i < min || i > max) {
        // console.log('Skipping user ' + user.email + ' (' + i + ') for now.');
        //return nullCbFn;
      }

      if(user.n === null || user.n === undefined){
        user.n = 1;
      }
      return function(callback){
        console.log('Checking user ' + user.email + ' (' + user.n + ')');
        checker(user.email, user.password, user.url).then(function(n){
          console.log('Checked  user ' + user.email + ' (' + n + ')');
          if(n > user.n){
            console.log('Sending mail to user ' + user.email)
            mailer({
              to: user.email,
              subject: "Acho que seu TOA chegou... - TOAnsioso",
              html: '<b>Acho que seu TOA chegou...</b> '+
                'Ou algum outro documento foi adicionado no seu Grantee. '+
                'Acesse o <a href="https://mycusthelp.info/IIE/_cs/Login.aspx">portal do Grantee</a> para vê-lo. :) <br/>'+
                'Atenção: você foi descadastrado do TOAnsioso. Se o documento que chegou não foi o TOA, ' +
                'lembre-se de <a href="http://toansioso.herokuapp.com/">cadastrar novamente</a>. '+
                'Mas fique atento ao número de documentos!'
            }).then(function(){
              // mail sent
              console.log('Mail sent, removing user ' + user.email);
              users.remove({_id: user._id}, function(err){
                console.log('User removed.');
                callback(null);
              });
            }, function(){
              // mail error
              console.error('ERROR! Mail not sent, keeping user ' + user.email);
              callback(null);
            })
          } else {
            callback(null);
          }
        }, function(){
          console.error('ERROR while checking user ' + user.email);
          callback(null);
        });
      }
    });

    async.parallelLimit(tasks, concurrency, function(){
      console.log('Done!');
      process.exit(0);
    });
  });
};
