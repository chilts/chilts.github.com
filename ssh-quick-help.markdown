---
layout: default
title: SSH Quick Help
---

## Generating Keys

From: a{http://kimmo.suominen.com/docs/ssh/}a

This will prompt you for a filename:

 $ cd ~/.ssh/
 $ ssh-keygen -t rsa
 [yournewkey_rsa]

## SSH to Other Machines

Add your new key to the other machines' authorized_keys file:

 $ ssh remote
 $ cat >> ~/.ssh/authorized_keys
 ...your new [whatever]_rsa.pub key here...

## Keeping your Key in Memory

Do this on the local machine:

 $ ssh-add
 ...passphrase...

(Ends)
