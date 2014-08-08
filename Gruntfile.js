/**
 * Created by meathill on 14-1-24.
 */

module.exports = function (grunt) {
  var isSingle = this.cli.tasks.length === 1 && this.cli.tasks[0] === 'single'
    , isWeb = this.cli.tasks.length === 1 && this.cli.tasks[0] === 'web'
    , config = grunt.file.readJSON('grunt-config.json')
    , BUILD =  config[isSingle ?  'single': 'build']
    , TEMP = config.temp
    , target = isSingle ? 'single.html' : 'index.html'
    , CSS_REG = /<link rel="stylesheet" href="(\S+)">/g
    , JS_REG = /<script src="(\S+)"><\/script>/g
    , TEMPLATE_REG = /<script( \S+)+ id="([\w\-]+)">([\S\s]+?)<\/script>/g
    , WEB_REG = /<!-- .* begin -->[\S\s]+<!-- .* end -->/g
    , csses = []
    , libs = []
    , jses = [];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      start: [BUILD, '../popo.<%= pkg.version %>.zip', '../single.<%= pkg.version %>.zip'],
      end: [TEMP]
    },
    index: {
      index: 'index.html',
      single: 'single.html'
    },
    copy: {
      font: {
        files: [{
          expand: true,
          cwd: 'bower_components/font-awesome/fonts/',
          src: ['*.svg'],
          dest: BUILD + 'fonts/'
        }]
      },
      svg: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['*.svg'],
          dest: BUILD + 'img/'
        }]
      }
    },
    compass: {
      css: {
        options: {
          environment: 'production',
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.sass'],
          dest: 'css/',
          ext: '.css'
        }]
      }

    },
    imagemin: {
      img: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['*.{png,jpg,gif}'],
          dest: BUILD + 'img/'
        }]
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: {
          global_defs: {
            'DEBUG': false,
            'PHONEGAP': false,
            'WEB': isWeb
          },
          dead_code: true,
          unused: true,
          drop_console: true
        },
        report: 'gzip'
      },
      js: {
        files: [{
          src: jses,
          dest: TEMP + (isSingle ? 'single' : 'index') + '.js'
        }]
      }
    },
    cssmin: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      css: {
        src: csses,
        dest: BUILD + 'css/style.css'
      },
      android: {  //android样式
        src: [csses, 'css/android.css'],
        dest: TEMP + 'css/android/style.css'
      },
      ios: {
        src: [csses, 'css/ios.css'],
        dest: TEMP + 'css/ios/style.css'
      }
    },
    replace: {
      version: {
        options: {
          patterns: [{
            match: 'version',
            replacement: '<%= pkg.version %>'
          }]
        },
        files: [{
          src: [TEMP + 'index.js'],
          dest: TEMP + 'index.js'
        }]
      }
    },
    handlebars: {
      compile: {
        options: {
          partialsUseNamespace: true,
          namespace: 'TEMPLATES',
          compilerOptions:{
            knownHelpers: {
              'if': true,
              'each': true,
              'unless': true
            },
            knownHelpersOnly: true
          },
          processName: function (filePath) {
            console.log(filePath);
            return filePath.slice(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
          }
        },
        files: {
          'js/templates.js': [TEMP + 'handlebars/*.hbs']
        }
      }
    },
    concat: {
      js: {
        options: {
          separator: ';\n'
        },
        src: libs,
        dest: BUILD + 'js/' + (isSingle ? 'single' : 'index') + '.js'
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
          src: TEMP + target,
          dest: BUILD + target
        }]
      },
      template: {
        files: [{
          expand: true,
          cwd: 'template/',
          src: ['search.html', 'no-guide.html'],
          dest: BUILD + 'template/'
        }]
      }
    },
    compress: {
      web: {
        options: {
          archive: '../' + (isSingle ? 'single' : 'popo') + '.<%= pkg.version %>.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: BUILD,
          src: ['**'],
          dest: ''
        }]
      },
      android: {
        options: {
          archive: '../' + (isSingle ? 'single' : 'android') + '.<%= pkg.version %>.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: BUILD,
          src: ['**','!css/style.css'],
          dest: ''
        },{
          expand: true,
          cwd: TEMP + 'css/android',
          flatten: true,
          src: ['**'],
          dest: 'css/',
          filter: 'isFile'
        }]
      },
      ios: {
        options: {
          archive: '../' + (isSingle ? 'single' : 'ios') + '.<%= pkg.version %>.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: BUILD,
          src: ['**','!css/style.css'],
          dest: ''
        },{
          expand: true,
          cwd: TEMP + 'css/ios',
          flatten: true,
          src: ['**'],
          dest: 'css/',
          filter: 'isFile'
        }]
      }
    }
  });

  if (isWeb) {
    grunt.config.merge({
      'copy' : {
        web: {
          src: 'mocks/web.json',
          dest: BUILD + '/apps.json'
        }
      },
      'imagemin': {
        img: {
          files: [{
            expand: true,
            cwd: 'img/',
            src: ['**/*.{png,jpg,gif}'],
            dest: BUILD + 'img/'
          }]
        }
      }
    });
  }

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-replace');
  grunt.registerMultiTask('index', 'make index html', function () {
    var html = grunt.file.read(this.data);
    // 取CSS
    html = html.replace(CSS_REG, function (match, src) {
      csses.push(src);
      return '';
    });
    // 取JS
    html = html.replace(JS_REG, function (match, src) {
      var isLib = src.substr(0, 2) !== 'js';
      if (src.indexOf('define.js') !== -1) {
        return '';
      }
      src = src.replace('handlebars.min', 'handlebars.runtime.min');
      isLib ? libs.push(src) : jses.push(src);
      return /index|single\.js/.test(src) ? match : '';
    });
    libs.push('js/templates.js'); // 预编译的模板
    libs.push(TEMP + (isSingle ? 'single' : 'index') + '.js');
    // 取模板
    html = html.replace(TEMPLATE_REG, function (match, other, id, content) {
      content = content.replace(/\s{2,}|\n|\r/g, '');
      grunt.file.write(TEMP + 'handlebars/' + id + '.hbs', content);
      return '';
    });
    // 为client导出时，不需要各种适配
    if (!isWeb) {
      html = html.replace(WEB_REG, '');
    }
    html = html.replace('<title>', '<link rel="stylesheet" href="css/style.css"><title>');
    grunt.file.write(TEMP + this.data, html);
  });
  grunt.registerTask('version', 'create a version file', function () {
    var version = {
      version: grunt.config.get('pkg').version,
      build: grunt.template.today('yyyy-mm-dd hh:MM:ss')
    };
    grunt.file.write(config.version, JSON.stringify(version));
  });

  grunt.registerTask('default', [
    'clean:start',
    'index:index',
    'copy',
    'compass',
    'imagemin',
    'uglify',
    'cssmin',
    'replace',
    'handlebars',
    'concat',
    'htmlmin',
    'compress',
    'version',
    'clean:end'
  ]);
  grunt.registerTask('single', [
    'clean:start',
    'index:single',
    'copy',
    'compass',
    'imagemin',
    'uglify',
    'replace',
    'concat',
    'htmlmin',
    'compress',
    'version',
    'clean:end'
  ]);
  grunt.registerTask('web', [
    'clean:start',
    'index:index',
    'copy',
    'compass',
    'imagemin',
    'uglify',
    'cssmin',
    'replace',
    'handlebars',
    'concat',
    'htmlmin',
    'version',
    'clean:end'
  ]);
};