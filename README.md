# favicon-crawler
A nodeJS webservice fetching icon from websites.

This webservice is using an optional cache system with [redis](http://redis.io). A seven day cache is used before refreshing the cache icon.

## usage
You need to install [Node](http://nodejs.org/) and [Grunt](http://gruntjs.com/) in order to download dependencies and run the server via the command line.
Optionnaly [redis](http://redis.io) is used to cache icons from domains.

1. [Fork and clone the repo](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `favicon-crawler` folder
3. Run `npm install` to install dependencies
4. Run `grunt` to run the server
5. Run `curl htpp://127.0.0.1:1515/get?domain=esri.com`

## Requirements
to run the command line tools
* [Node](http://nodejs.org/)
* [Grunt](http://gruntjs.com/)

##Licensing
Licensed under the MIT License

A copy of the license is available in the repository's [LICENSE](LICENSE) file.
