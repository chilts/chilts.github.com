all:

update:
	wget http://controljs.googlecode.com/svn-history/trunk/control.js -O s/js/control.js

minimise-js: update
	js-min.pl s/js/control.js > s/js/control.min.js

lint:
	# find all the files and check the YAML

clean:
	find . -name '*~' -exec rm {} ';'

.PHONY: clean
