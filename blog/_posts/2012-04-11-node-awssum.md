---
category: blog
layout: post
title: Introducing Node AwsSum
tagline: "'O' is for AwsSum"
published: true
tags : [amazon, aws, nodejs, javascript, webapi, awssum]
---
Over on my [author page on NPM](http://search.npmjs.org/#/_author/Andrew%20Chilton) I now have 7 packages available to
download and install. However, the one I've put the most time into is the
[AwsSum](https://github.com/appsattic/node-awssum/) package. It is a set of modules to talk to lots of Web Service
APIs.

At the moment, it mainly talks to many of the Amazon Web Services APIs but I have an [OAuth
branch](https://github.com/appsattic/node-awssum/tree/oauth) which is nearing completion. Whilst this won't be feature
complete for all of the services I'm trailing (Yahoo! OAuth/ContactsAPI, Twitter OAuth/API, Xero OAuth/API and Tumblr
OAuth/API) it will give a very good idea how to talk to any OAuth service out there with AwsSum.

It also helps with the situation where the OAuth provider and a OAuth enabled service it provides are completely
different. For example, you use the Twitter OAuth enpoints to authorise data from Twitter - this is straighforward. But
in the case of Yahoo! Contacts, you need to use a central Yahoo! OAuth endpoint. This will also be the case for Google
and all of their APIs as well as other large providers where the number of APIs they provide are greater than one.

**The future's bright, the future's AwsSum!**

(Ends)
