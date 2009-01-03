---
layout: default
title: Git - Using Different Remotes
---

This quick guide is to help me when using different remotes. It was also written for Victor though since I'm still fairly new to Git I'm also using this as an exercise for myself.

## Cloning your 'Writeable' Repo

Firstly, let's assume you will initiall clone from the remote to which you will automatically push. This is assumed so that `git push` automatically goes to the right place. In this case we're using a GitHub Private Clone URL:

     $ cd /tmp
     $ git clone git@github.com:username/repo.git
     Initialized empty Git repository in /tmp/repo/.git/
     remote: Counting objects: 216, done.
     remote: Compressing objects: 100% (109/109), done.
     remote: Total 216 (delta 70), reused 210 (delta 69)
     Receiving objects: 100% (216/216), 653.03 KiB | 146 KiB/s, done.
     Resolving deltas: 100% (70/70), done.
     
     $ git remote
     origin
     $ git remote show origin
     * remote origin
       URL: git@github.com:username/repo.git
       Remote branch(es) merged with 'git pull' while on branch master
         master
       Tracked remote branches
         master

## Adding your 'Readonly' Repo as Another Remote

However, you actually want to pull from a different place. This could be anywhere but for this exercise we're assuming it's from a GitHub Public Clone URL (and shall call the remote `public`):

     $ git remote add public git://github.com/username/repo.git
     $ git remote
     origin
     public

## Fetching from the Readonly Remote

Now, you can fetch everything from your new 'public' remote:

     $ git fetch public
     From git://github.com/username/repo
      * [new branch]      master     -> public/master

View all the branches you can see/use:

     $ git branch -a
     * master
       origin/HEAD
       origin/master
       public/master

## Rebasing your Work onto the Readonly Remote

If you want to rebase your currently checked out branch branch onto 'public/master', then do:

     $ git rebase public/master
     Current branch master is up to date.

Which makes sense :-)

## Changing a File and Pushing

Once you have made some changes, commit as usual:

     $ git commit -m 'Changed blah blah...' file1.txt
     Created commit fffd3fa: Changed blah blah...
      1 files changed, 15 insertions(+), 0 deletions(-)
      create mode 100644 file1.txt

And push. Since you cloned from your writeable repo, this push defaults to the right place:

     $ git push
     Counting objects: 4, done.
     Compressing objects: 100% (3/3), done.
     Writing objects: 100% (3/3), 569 bytes, done.
     Total 3 (delta 1), reused 0 (delta 0)
     To git@github.com:username/repo.git
        ee021ac..fffd3fa  master -> master

Then, you probably have/want to rebase back onto your readable repo:

     $ git fetch 
     From git://github.com/username/repo
        ee021ac..fffd3fa  master     -> public/master
     $ git rebase public/origin
     Current branch master is up to date.

(Hmm, maybe this isn't needed at this very moment in time, but will be if you are pushing from physically different repos.)

## Notes

There are probably ways to automatically fetch and rebase using the readable repo, but that is left as either an exercise or a patch for the user :-)

## Patches

Patches and/or Other Techniques Welcome. Tell me where to pull from :-)

(Ends)
