---
category: blog
layout: post
title: AwsSum's Overall Plan
tagline: "Data Liberation"
published: true
tags : [amazon, aws, nodejs, javascript, webapi, awssum]
---
In my [previous article](node-awssum.html), I introduced AwsSum even though it's been around for about 6 months
now. It's maturing nicely, let's put it that way. But apart from adding more and more Web APIs to AwsSum, what plans do
I have in mind for it in general.

## The Overall Plan ##

There are two main purposes of the AwsSum library. Firstly is so that you can talk to all of these Web APIs in a
simple, clean and consistent manner (this will be the subject of an upcoming blog post).

The 2nd is less obvious but very important, so listen carefully.

## Data Liberation ##

I want to produce a tool - a magical tool - which gets you all of YOUR data from any and all of these
services. Obviously it's limited to what the vendor allows via the API but it should be able to get you everything
available.

It won't prescribe what you do with that data afterwards, but it will be intended so that at least you **can** do
something with it and it won't be hiding in the cloud.

I'm not sure what it'll be called yet, but something like 'liberate-my-data' would be appropriate. :)

## Example using Amazon S3 ##

So, if I'm lucky I'll just run a command like:

    $ liberate-my-data Amazon:S3

It it'll go off and get everything you have from there. It'll create directories for your buckets and download all of
your files into each of these directories. It'll tell you if there is information there it can't get or represent and
it'll also be re-runnable at any stage in the future.

So you may end up with a set of directories and files such as this:

    + mydata
      + amazon
        + s3
          + bucket1
            - file.txt
            - image.jpg
            - index.html
          + my-other-bucket
            - cat.jpg
            - lolcat.jpg
            - .jpg

So essentially every service has a 'provider/service' pair much like the AwsSum libraries (in the case of Twitter it
would be 'twitter/twitter') and then each data liberation script would organise it's own backup directory in the
appropriate way for each service. In some cases it might be directories and files (as above), in others it might be a
JSON, CSV or XML file (or more). Think 'tweets.json', 'friends.json', 'direct_messages.json', 'images/\*' and various
other created files.

As I said, it wouldn't prescribe what you do with that data, but just that you can get it. After that, moving to more
open services would make more sense. Oh, and ones that subscribe to the [Franklin Street
Statement](http://autonomo.us/2008/07/franklin-street-statement/).

**What a wonderful world that would be!**

(Ends)
