---
layout: default
title: Bash Index
---

Just some funky bits and pieces for bash that I should remember (presuming I have forgotten that is).

## General

    C-g        - abort
    C-l        - clear screen

## History

    C-r<str>   - reverse search history containing <str> (repeat C-r for previous instances)
    C-s<str>   - forward search history
    C-p        - recall previous command
    C-n        - recall next command
    C-o        - execute this command and automatically put the relative next on the command line

## Movements

    C-a        - beginning of line
    C-e        - end of line
    C-f        - forward char
    C-b        - backward char
    M-f        - forward word
    M-b        - backward word

## Deleting Text

    C-u        - delete from cursor to start of line
    C-k        - delete from cursor to end of line
    C-w        - delete previous word
    M-d        - delete next word

## Modifying Text

    C-t        - transpose letters (cursor-1, cursor)
    M-t        - transpose words

## Inserting Text

    C-M-y      - insert first arg of previous command (n'th if argument modifier)
    M-.        - insert last arg of previous command
    M-C-e      - expand the current line as the shell does

(Ends)
