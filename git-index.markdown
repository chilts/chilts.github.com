---
layout: default
title: Git Index
---

Other Git pages:

* [Using Different Remotes](git-using-different-remotes.html)
* [Converting from SVN](git-converting-from-svn.html)

Some helper Git things I always forget:

## Branching

Create a new branch (called 'packaging') which you then push to the origin:

    $ git branch packaging
    $ git checkout packaging
    $ git push origin packaging

Creating a new branch which follows a remote branch (in this case 'packaging'):

    $ git branch -a
    * master
      origin/master
      origin/packaging
    
    $ git branch --track packaging origin/packaging
    Branch packaging set up to track remote branch refs/remotes/origin/packaging.
    
    $ git checkout packaging
    Switched to branch "packaging"

To remove a remote branch, firstly delete the local branch, then push it:

    $ git branch -a
      master
    * packaging
      tbd
      origin/HEAD
      origin/master
      origin/tbd
      origin/packaging
    $ git branch -D packaging
    $ git push origin :packaging
    To git@github.com:andychilton/zaapt.git
     - [deleted]         debian

## Remotes

To add a new remote:

    $ git remote add debian ssh://git.debian.org/git/collab-maint/zaapt.git
    
    $ git remote show debian
    * remote debian
      URL: ssh://git.debian.org/git/collab-maint/zaapt.git
      New remote branches (next fetch will store in remotes/debian)
        master upstream
    
    $ git fetch debian
    warning: no common commits
    remote: Counting objects: 474, done.
    remote: Compressing objects: 100% (250/250), done.
    remote: Total 474 (delta 226), reused 449 (delta 212)
    Receiving objects: 100% (474/474), 200.12 KiB | 68 KiB/s, done.
    Resolving deltas: 100% (226/226), done.
    From ssh://git.debian.org/git/collab-maint/zaapt
     * [new branch]      master     -> debian/master
     * [new branch]      upstream   -> debian/upstream
    remote: Counting objects: 2, done.
    remote: Compressing objects: 100% (2/2), done.
    remote: Total 2 (delta 0), reused 0 (delta 0)
    Unpacking objects: 100% (2/2), done.
    From ssh://git.debian.org/git/collab-maint/zaapt
     * [new tag]         debian/0.1.0-1 -> debian/0.1.0-1
     * [new tag]         upstream/0.1.0 -> upstream/0.1.0

## Removing Your Last Commit

(Presuming you haven't pushed this branch anywhere yet.)

Firstly, show the latest commit to make sure it's the one you want to reset, then reset it:

    $ git show
    $ git reset --hard HEAD~1

Note: `git reset --hard HEAD^` also does the same thing.

(Ends)
