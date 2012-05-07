---
category: blog
layout: post
title: Using async.queue() as a State Machine
tagline: "Hopping from one state to another"
published: true
tags : [awssum, amazon, s3, async, nodejs, queue]
---

Earlier today I finished a small little project which is an example program for
[AwsSum](https://github.com/appsattic/node-awssum/). It's a program called
[amazon-s3-sync.js](https://github.com/appsattic/node-awssum-scripts/blob/master/bin/amazon-s3-sync.js) and it lives in
my [node-awssum-scripts](https://github.com/appsattic/node-awssum-scripts/) repo.

Firstly, let me tell you what it does, then I'll tell you how it does it and after that what the next thing it will do
is.

## Syncing your Buckets ##

Ok, imagine you have a bucket in Amazon S3 called 'my-photos'. And on your laptop you have a directory called
'my-photos'. What you want to do is sync those photos up to each other so that you have them on your laptop and in the
cloud (using 99.9999% reliability). So let's run a command to do that:

    $ cd my-photos
    $ amazon-s3-sync.js -b my-photos

The program does two things and only two things (currently it only does one, but we'll come on to the 2nd thing later).

The first thing it does is download any files you have in your bucket which you don't have on disk and saves them into
your 'my-photos' directory.

The second thing it will do in the future is to upload any files you have on disk which you don't already have in S3.

And there is one final thing which it explicitely does not do. If a file exists on disk AND in S3 and they are not the
same (different length, different MD5) the program tells you about it and DOES NOTHING AT ALL to fix it. That's your
job! ;)

## How does it do it ##

The program consists only of an initial step and then five queues. The first step is to query S3 for all of the items
it knows about in the bucket. This may consist of one or more requests since you only get items back in batches of
1000.

Once we have the entire list we start shuffling those items around in queues. As I said, there are five queues:

* "Check Item is Local" Queue - checks to see if the item has a corresponding file on disk
    * if so, then the item is pushed onto the "Check Local Dir Exists" Queue
    * if not, then push the item onto the "For Download" Queue
    * Note: if it does exist but is of the wrong length, a message is given to a user to resolve the conflict
* "Check Local Dir Exists" Queue - just checks that directories exist for keys such as 'path/to/file.txt'
    * if it does exist, the item is pushed onto the "Check MD5's are the Same" Queue
    * if it doesn't the dir is created and the item pushed onto the "Create Tmp File" Queue
* "Check MD5's are the Same" Queue - checks that the MD5s are the same for the Key and the File
    * if so, then do nothing with the item (the item and file mirror each other)
    * if not, then inform the user to resolve the conflict
* "Create Tmp File" Queue - just create a tmp file in /tmp/ so that we can write to it when downloading the file
    * once created, the item is pushed onto the "For Download" Queue
* "For Download" Queue - downloads the item to a temporary file and renames it into place in your directory

This may all sound a bit crazy, but there are a couple of reasons for all this.

By using queues, we can push items onto different queues from a number of places. Remember that all of this is
asynchronous and generally there are also multiple items in every queue being concurrently processed. Each item may
traverse the queues in different ways but this gives us a highly flexible system to be able to skip code and/or move
from any state to any other state.

Finally, even though we have a lot of queues, the most complicated part is the state diagram. The code on the other
hand is really simple. When downloading a file, the first version of the program created a directory (if not there),
created a tmp file, downloaded the file, wrote the file to disk, closed the file and finally renamed it to it's final
destination. By doing all of this in one function I ended up with 5 levels of callbacks within callbacks.

By using queues, each queue only has one response function and each one does only one thing. By keeping each bit of
processing separate, each function is small and only one or two levels of callback deep! :)

It also means that to increase or decrease the concurrency of any parts of the system, I can just pass in a concurrency
value on the command line, such as checking for 5 existing files, checking 5 MD5s or downloading 5 things at once:

    $ amazon-s3-sync.js -b my-photos -c 5

Easy as pie!

## Why I wrote this Program ##

Usually I write stuff to expand on what I know but in this case there were three reasons:

1. playing with [async](https://github.com/caolan/async) has been awesome and very enlightening
1. it shows off what you can do with [AwsSum](http://github.com/appsattic/node-awssum/)
1. it is one step further along the road in my quest to [conquer to world](awssums-overall-plan.html)

Anyway, have fun and happy hacking. :)

- Chilts

(Ends)
