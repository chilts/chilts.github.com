---
layout: page
title: Hello, World!
---
## ToDo ##

See my [blog](/blog/) for now. :)

## All Posts ##

<ul class="posts">
{% for post in site.posts %}
    <li>{{ post.category }}</li>
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>

(Ends)
