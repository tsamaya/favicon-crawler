/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['src/**/*.js']
    },
    jasmine: {

    },
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'src/server.js'
        }
      },
      prod: {
        options: {
          script: 'dist/server.js',
          node_env: 'production'
        }
      }
    },
    watch: {
      express: {
        files: ['**/*.js'],
        tasks: ['jshint', 'express:dev'],
        options: {
          spawn: false
        }
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            cwd: 'src/',
            src: ['**'],
            dest: 'dist/'
          }
        ],
      },
    },
    // clean the output directory before each build
    clean: {
      build: ['dist']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('hint', ['jshint']);

  grunt.registerTask('build', ['clean', 'hint', 'copy']);

  grunt.registerTask('server', ['hint', 'express:dev', 'watch']);

  grunt.registerTask('default', ['server']);

};
