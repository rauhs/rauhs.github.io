################################################################################
# Vars
# $< Dependency (right)
# $@ Target (left)
################################################################################
# VARS
BS_DIR:=bootstrap_tmp

UNAME_S := $(shell uname -s)
# Lowercase seems to be more hacky so explicit solution:
ifeq ($(UNAME_S),Linux)
    PLAT=linux
endif
ifeq ($(UNAME_S),Darwin)
    PLAT=darwin
endif

#HUGO=./hugo/hugo_0.14_$(PLAT)_amd64
HUGO=hugo

# Or just adjust path:
NODE:=node
NPM:=npm
JSX:=jsx

# Add node stuff to path.
export PATH := $(abspath node/bin):/usr/bin:/bin:$(PATH)

.PHONY: def_target setup watch push dl-node watch-bs view pub

def_target : watch

# http://blog.jgc.org/2015/04/the-one-line-you-should-add-to-every.html
# Allows:
# make print-SOURCE_FILEE
print-%: ; @echo $*=$($*)

# Needs to be run manually if we change the CSS/Less source
clean :
	rm -rf public/

# The JSX binary:
install-react :
	$(NPM) install react-tools

install-jsx :
	$(NPM) install -g uglify-js
	$(NPM) install -g react-tools

# Silly npm folks hard code node and ubuntu uses nodejs... Sigh
# Install it locally:
dl-node :
	@mkdir -p node
	curl http://nodejs.org/dist/v0.12.2/node-v0.12.2-linux-x64.tar.gz | \
	  tar xz --directory node --strip-components=1

# Compiles the JSX files. Run locally only
watch-jsx :
	$(JSX) --watch jsx-src/ static/jsx/

###################################################
# Git shortcuts for the lazy
push :
	git commit -a -m 'lazy commit' && git push

# You prob wont be able to run this so just copy it manually
create-gohugo-user :
	adduser --system --group gohugo


###################################################
# Hugo things
watch :
	$(HUGO) server --watch --bind=127.0.0.1 --port=1314 --buildDrafts --buildFuture

pub :
	$(HUGO) server --watch --bind=0.0.0.0 --port=80 --buildDrafts --buildFuture

###################################################
# Hooks
hook-pull :
	git pull
	$(HUGO) 

# Same as hook-pull but also deletes all the public dir. This is (rarely)
# necessary if stuff gets moves around.
hook-pull-reset :
	git pull
	make clean
	$(HUGO) 

