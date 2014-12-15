module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    build_folder: 'build',

    clean: ['<%=build_folder %>'],

    uglify: {
      build: {
        files: {
          '<%=build_folder %>/babycam.min.js': ['js/d3.js', 'js/babycam.js']
        }
      }
    },

    cssmin: {
      build: {
        files: {
          '<%=build_folder %>/babycam.min.css': ['css/bootstrap.min.css', 'css/babycam.css']
        }
      }
    },

    filerev: {
      build: {
        src: ['<%=build_folder %>/*.{js,css}']
      }
    },

    copy: {
      build: {
          files: [
            { src: 'index.html', dest: '<%=build_folder %>/index.html' }
          ]
      }
    },

    usemin: {
      html: '<%=build_folder %>/index.html',
      options: {
        assetsDirs: ['<%=build_folder %>'],
        blockReplacements: {
          inlinecss: function (block) {
              return '<style>' + grunt.file.read("build/" + block.dest) + '</style>';
          },
          inlinejs: function (block) {
              return '<script><!-- ' + grunt.file.read("build/" + block.dest) + ' --></script>';
          }
        }
      }
    },

    htmlmin: {                                     // Task
      build: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          '<%=build_folder %>/index.html': '<%=build_folder %>/index.html'     // 'destination': 'source'
        }
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default task(s).
  grunt.registerTask('default', [
    'clean',
    'uglify:build',
    'cssmin:build',
    'filerev:build',
    'copy:build',
    'usemin:html',
    'htmlmin:build'
  ]);
};
