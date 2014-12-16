module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    web_folder: 'www',
    build_folder: '<%=web_folder %>/build',

    jshint: {
      build: ['<%=web_folder %>/js/babycam.js']
    }, 

    clean: ['<%=build_folder %>'],

    uglify: {
      build: {
        files: {
          '<%=build_folder %>/babycam.min.js': ['<%=web_folder %>/js/d3.js', '<%=web_folder %>/js/babycam.js']
        }
      }
    },

    cssmin: {
      build: {
        options: {
          relativeTo: '<%=web_folder %>', // Fix for finding the correct font files
          target: '<%=web_folder %>/build', // Fix for finding the correct font files
        },
        files: [{
          src: ['<%=web_folder %>/css/bootstrap.min.css', '<%=web_folder %>/css/babycam.css'],
          dest: '<%=build_folder %>/babycam.min.css'
        }]
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
            { src: '<%=web_folder %>/index.html', dest: '<%=build_folder %>/index.html' },
            { cwd: '<%=web_folder %>', src: 'fonts/*', dest: '<%=build_folder %>/', expand: true }
          ]
      }
    },

    usemin: {
      html: '<%=build_folder %>/index.html',
      options: {
        assetsDirs: ['<%=build_folder %>'],
        blockReplacements: {
          inlinecss: function (block) {
              return '<style>' + grunt.file.read("www/build/" + block.dest) + '</style>';
          },
          inlinejs: function (block) {
              return '<script><!-- ' + grunt.file.read("www/build/" + block.dest) + ' --></script>';
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
    },

    imagemin: {
      build: {
        files: [{
          expand: true,                       // Enable dynamic expansion
          cwd: '<%=web_folder %>/images/',     // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],        // Actual patterns to match
          dest: '<%=build_folder %>/images/'  // Destination path prefix
        }]
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'copy:build',
    'uglify:build',
    'cssmin:build',
    'filerev:build',
    'usemin:html',
    'htmlmin:build',
    'imagemin:build'
  ]);
};
