module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      css: ['css/combined.css'],
      js:  ['js/bootstrap.js', 'js/combined.js', 'js/combined.min.js', 'js/source-map.js']
    },
    recess: {
      lint: {
        options: {
          noOverqualifying: false
        },
        src: [
          'less/style.less'
        ]
      },
      development: {
        options: {
          compile: true
        },
        files: {
            'css/combined.css': ['less/bootstrap.less', 'less/style.less']
        }
      },
      build: {
        options: {
          compile: true,
          compress: true
        },
        files: {
            'css/combined.css': ['less/bootstrap.less', 'less/style.less']
        }
      }
    },
    jshint: {
      gruntfile: ['GruntFile.js'],
      development: ['js/**/*.js', '!js/vendors/**/*.js', '!js/bootstrap.js', '!js/bootstrap/**/*.js'],
      build: ['js/**/*.js', '!js/vendors/**/*.js', '!js/bootstrap/**/*.js']
    },
    concat: {
      options: {
        separator: ';',
      },
      bootstrap: {
        src: [
          'js/bootstrap/transition.js',
          'js/bootstrap/alert.js',
          'js/bootstrap/button.js',
          'js/bootstrap/carousel.js',
          'js/bootstrap/collapse.js',
          'js/bootstrap/dropdown.js',
          'js/bootstrap/modal.js',
          'js/bootstrap/tooltip.js',
          'js/bootstrap/popover.js',
          'js/bootstrap/crollspy.js',
          'js/bootstrap/tab.js',
          'js/bootstrap/affix.js'
        ],
        dest: 'js/bootstrap.js'
      },
      development: {
        src: ['js/**/*.js', '!js/vendors/**/*.js', '!js/bootstrap/**/*.js', '!js/bootstrap.js'],
        dest: 'js/combined.js',
      },
      build: {
        src: ['js/vendors/**/*.js', 'js/bootstrap/**/*.js', 'js/**/*.js'],
        dest: 'js/combined.js',
      }
    },
    uglify: {
      build: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          sourceMap: 'js/source-map.js',
          dead_code: true,
          mangle: {
            except: ['jQuery']
          }
        },
        src: 'js/combined.js',
        dest: 'js/combined.min.js'
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
      development_html: {
        files: ['**/*.html'],
        options: {
          // Start a live reload server on the default port 35729
          livereload: true,
        },
      },
      development_css: {
        files: ['less/**/*.less'],
        tasks: ['clean:css', 'recess:lint', 'recess:development'],
        options: {
          // Start a live reload server on the default port 35729
          livereload: true,
        },
      },
      development_js: {
        files: ['js/**/*.js', '!js/combined.js', '!js/combined.min.js', '!js/bootstrap.js'],
        tasks: ['clean:js', 'jshint:development', 'concat:bootstrap', 'concat:development'],
        options: {
          // Start a live reload server on the default port 35729
          livereload: true,
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-recess');

  // Default task.
  grunt.registerTask('default', ['clean:css', 'clean:js', 'recess:lint', 'recess:development', 'jshint:development', 'concat:bootstrap', 'concat:development']);

  // Watch task.
  grunt.registerTask('development', ['watch:html', 'watch:css', 'watch:js']);

  // Build task.
  grunt.registerTask('build', ['clean:css', 'clean:js','recess:lint', 'recess:build', 'jshint:build', 'concat:build', 'uglify:build']);

};