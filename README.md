TOA Checker
===========

Checks for your TOA in the Brazilian Scientific Mobility Program website.


Deploy
------

This is a guide to deploying this app on AWS EC2 instance using Amazon Linux AMI.

Create a free MongoDB database using a [mongolab](mongolab.com) sandbox account.

Connect to your instance using SSH.

Using the following commands, install node and git.

```
sudo yum update
sudo yum install nodejs npm --enablerepo=epel
sudo yum install git
```

Create a new directory called `w3` inside `/var` and change its permission using `chmod -R 755`.

Inside `/var/w3`, clone this project into a new directory (you may name it `toansioso`).

To configure the database connection, create a file named `dburi.txt` on `/var/w3`. Inside this file, paste the MongoDB database URI.

To configure the email account, first update the e-mail address info that you`re going to use on `app/mailer.js`, then create a file named `mailpw.txt` on `/var/w3`. Inside this file, paste the e-mail account password.

Change your working directory to `/var/w3/toansioso` and run the following command to install the required Node packages.
```
sudo npm install async body-parser deferred express moment mongodb monk nodemailer zombie
```

Add the worker process to the crontab using `crontab -e`. The following line will execute the process every hour:
```
00 * * * * /usr/bin/node /var/w3/toansioso/bin/worker
```

Run `app.js` using
```
node app.js
```

Alternatively, in order to keep Node running continuously, you may install and use the forever package.
```
sudo npm install forever -g
```
Then,
```
sudo forever start app.js
```
