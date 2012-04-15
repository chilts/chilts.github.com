---
category: blog
layout: post
title: Things to Remember about Amazon EC2
published: true
tags: [ ec2, aws ]
---
I've been knocking around with Amazon EC2 again over the past few months and am learning a few tricks which I need to write down so I don't forget them. Using my [AwsSum](https://github.com/appsattic/awssum) library, here's a few bits and pieces:

Starting a new server (Ubuntu Lucid AMD64 in region 'us-east', availability zone 'us-east-1a'):

    KEYFILE=$HOME/.ssh/id_rsa.pub
    REGION=us-east-1
    AZ=us-east-1a
    AMI=ami-3202f25b # Ubuntu Lucid LTS, 64-bit, EBS Boot (from http://alestic.com/)
    TYPE=t1.micro

    ./bin/awssum Amazon:EC2 RunInstances \
        --Region $REGION \
        --ImageId $AMI \
        --MinCount 1 \
        --MaxCount 1 \
        --KeyName $KEYNAME \
        --InstanceType $TYPE \
        --Placement.AvailabilityZone $AZ \
        --DisableApiTermination true \
        --InstanceInitiatedShutdownBehavior stop \
        --BlockDeviceMapping.0.DeviceName /dev/sda1 \
        --BlockDeviceMapping.0.Ebs.VolumeSize 20 \
        --BlockDeviceMapping.0.Ebs.DeleteOnTermination false

What we're saying here is to create an Elastic Block Store backed micro instance. We've actually asked for 20GB worth of storage on the root filesystem.

However, when we log on to that new instance, you can see that there only seems to be about 10G on /dev/sda1. Hmm, what's going on here?

    $ df -kh
    Filesystem            Size  Used Avail Use% Mounted on
    /dev/sda1             7.9G  1.1G  6.5G  15% /
    none                  285M  108K  284M   1% /dev
    none                  318M     0  318M   0% /dev/shm
    none                  318M   56K  318M   1% /var/run
    none                  318M     0  318M   0% /var/lock
    none                  318M     0  318M   0% /lib/init/rw

What's happening is that the Amazon Machine Image (AMI) has been set up to use 10G worth of storage, so that's all that we can see here. However, if you look at your list of EBS volumes, you can see that' you're being charged for 20G (which is what you asked for in the first place)!

    $ ./bin/awssum Amazon:EC2 DescribeVolumes
    {
       "xmlns" : "http://ec2.amazonaws.com/doc/2010-08-31/",
       "_awssum" : {
          "ok" : 1
       },
       "requestId" : "c569ff82-9ad5-4e39-9313-22f7079fe5da",
       "volumeSet" : [
          {
             "volumeId" : "vol-xxxxxxxx",
             "status" : "in-use",
             "attachmentSet" : [
                {
                   "volumeId" : "vol-xxxxxxxx",
                   "instanceId" : "i-xxxxxxxx",
                   "status" : "attached",
                   "deleteOnTermination" : "false",
                   "attachTime" : "2011-05-21T08:13:39.000Z",
                   "device" : "/dev/sda1"
                }
             ],
             "availabilityZone" : "us-east-1a",
             "createTime" : "2011-05-21T08:13:21.000Z",
             "snapshotId" : "snap-xxxxxxxx",
             "size" : "20"
          }
       ]
    }

Ok, let's make sure you're making full use of that 20G you're paying for. Log back onto your instance and perform the following command:

    $ sudo resize2fs /dev/sda1
    resize2fs 1.41.11 (14-Mar-2010)
    Filesystem at /dev/sda1 is mounted on /; on-line resizing required
    old desc_blocks = 1, new_desc_blocks = 2
    Performing an on-line resize of /dev/sda1 to 5242880 (4k) blocks.
    The filesystem on /dev/sda1 is now 5242880 blocks long.

Cool, it seems to have worked. Let's just check:

    $ df -kh
    Filesystem            Size  Used Avail Use% Mounted on
    /dev/sda1              20G  1.1G   18G   6% /
    none                  285M  108K  284M   1% /dev
    none                  318M     0  318M   0% /dev/shm
    none                  318M   56K  318M   1% /var/run
    none                  318M     0  318M   0% /var/lock
    none                  318M     0  318M   0% /lib/init/rw

Excellent, we've got our other 10G that we're paying for. Until next time.
