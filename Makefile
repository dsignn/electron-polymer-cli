## help:				List command
help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

## Build typescript project
tsc:
	./node_modules/.bin/tsc

## rsync-sideline:		Run rsync on sideline project
rsync-player: tsc
	 rsync -axv --exclude .idea --exclude node_modules --exclude ./git  . ../electron-polymer/node_modules/@dsign/player-cli/
