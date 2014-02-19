/**
 * Created by meathill on 14-1-24.
 */
module.exports = function (grunt) {
  var config = grunt.file.readJSON('grunt-config.json')
    , BUILD = config.build
    , TEMP = config.temp
    , CSS_REG = /<link rel="stylesheet" href="(\S+)">/g
    , JS_REG = /<script src="(\S+)"><\/script>/g
    , csses = []
    , libs = []
    , jses = []
    , html = grunt.file.read('index.html');

  // 取CSS
  html = html.replace(CSS_REG, function (match, src) {
    csses.push(src);
    return src.substr(0, 3) === 'css' ? match : '';
  });
  html = html.replace(JS_REG, function (match, src) {
    var isLib = src.substr(0, 2) !== 'js';
    if (src.indexOf('define.js') !== -1) {
      return '';
    }
    isLib ? libs.push(src) : jses.push(src);
    return src.indexOf('index.js') !== -1 ? match : '';
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      start: [BUILD, '../popo.*.zip'],
      end: [TEMP]
    },
    copy: {
      font: {
        files: [{
          expand: true,
          cwd: 'bower_components/font-awesome/fonts/',
          src: ['*.{ttf,otf}'],
          dest: BUILD + 'fonts/'
        }]
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true
      },
      index: {
        files: [{
          expand: true,
          cwd: TEMP,
          src: ['index.html'],
          dest: BUILD
        }]
      },
      template: {
        files: [{
          expand: true,
          cwd: 'template/',
          src: ['all.html', 'offline.html'],
          dest: BUILD + 'template/'
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: {
          global_defs: {
            'DEBUG': false,
            'PHONEGAP': false
          },
          dead_code: true
        },
        report: 'gzip'
      },
      js: {
        files: [{
          src: jses,
          dest: TEMP + 'index.js'
        }]
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      minify: {
        files: [
          {
            src: csses,
            dest: BUILD + 'css/style.css'
          }
        ]
      }
    },
    concat: {
      options: {
        separator: ';\n'
      },
      js: {
        src: libs.concat(TEMP + 'index.js'),
        dest: BUILD + 'js/index.js'
      }
    },
    imagemin: {
      img: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['**/*.{png,jpg}'],
          dest: BUILD + 'img/'
        }]
      }
    },
    compress: {
      app: {
        options: {
          archive: '../popo.<%= pkg.version %>.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: BUILD,
          src: ['**'],
          dest: ''
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('index', 'make index html', function () {
    html = html.replace('<title>', '<link rel="stylesheet" href="css/style.css"><title>')
    grunt.file.write(TEMP + 'index.html', html);
  });
  grunt.registerTask('version', 'create a version file', function () {
    var version = 'Version: ' + grunt.config.get('pkg').version + '\nbuild at: ' + grunt.template.today('yyyy-mm-dd hh:MM:ss');
    grunt.file.write(config.version, version);
  });

  grunt.registerTask('default', [
    'clean:start',
    'copy',
    'cssmin',
    'imagemin',
    'uglify',
    'concat',
    'index',
    'htmlmin',
    'compress',
    'version',
    'clean:end'
  ]);
};