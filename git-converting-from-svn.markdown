---
layout: default
title: Git - Converting from Subversion
---

This little helper script can be used to convert an SVN repository into a Git
one. It also shows how you can then push your new repo somewhere, for example,
your own server.

## Set up some Vars

    export REPO=mysvnrepo
    export VER=7
    export REMOTE=servername
    export RDIR=/var/lib/git

This sets up the SVN (and hence the Git) repository name, the version `trunk/`
is currently on and the server and directory to which this repo should be
pushed:

Firstly, initialise a local Git repo:

    cd /tmp
    mkdir $REPO
    cd $REPO
    git-svn init svn+ssh://$REMOTE/$REPO/trunk --no-metadata

Then import the SVN repo from commit 2 onwards (commit #1 was probably the
creation of the trunk, branches and tags directories):

    git-svn fetch -r 2:$VER

Now, clone this repo locally, but make it a bare one since this is the one we
will be pushing to the server:

    cd ../
    git clone --bare --local $REPO/.git $REPO.git 
    chmod +x $REPO.git/hooks/post-update
    vim $REPO.git/description

Now push the bare repository to the server and then clone it in the place
you'll do your work:

    scp -r $REPO.git $REMOTE:$RDIR
    cd ~/src/git/
    git clone ssh+git://$REMOTE$RDIR/$REPO.git

Tidy up those temp dirs you created earlier:

    rm -rf /tmp/$REPO
    rm -rf /tmp/$REPO.git

(Ends)
