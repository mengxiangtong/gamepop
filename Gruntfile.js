/**
 * Created by meathill on 14-1-24.
 */

module.exports = function (grunt) {
  var isWeb = this.cli.tasks.length === 1 && this.cli.tasks[0] === 'web'
    , config = grunt.file.readJSON('grunt-config.json')
    , BUILD =  config.build
    , TEMP = config.temp
    , target = 'index.html'
    , CSS_REG = /<link rel="stylesheet" href="(\S+)">/g
    , JS_REG = /<script src="(\S+)"><\/script>/g
    , TEMPLATE_REG = /<script( \S+)+ id="([\w\-]+)">([\S\s]+?)<\/script>/g
    , WEB_REG = /<!-- .* begin -->[\S\s]+?<!-- .* end -->/g
    , csses = []
    , libs = []
    , jses = []
    , SHARE_POP_REG = /<div class="share-modal">([\S\s]+?)<div class="content">/g;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      start: [BUILD, '../popo.<%= pkg.version %>.zip'],
      end: [TEMP]
    },
    index: {
      index: 'index.html'
    },
    copy: { // 复制
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
    compass: { // 将sass文件编译compass成css
      css: {
        options: {
          environment: 'production',
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'css/',
          src: ['*.sass'],
          dest: 'css/', // 压缩最终目录
          ext: '.css' // 更改后缀名
        }]
      }

    },
    imagemin: { // 图片压缩模块
      img: {
        files: [{
          expand: true,
          cwd: 'img/',
          src: ['*.{png,jpg,gif}'],
          dest: BUILD + 'img/'
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
    uglify: { // 压缩以及合并javascript文件  压缩代码，用于减少文件体积
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
      web: {
        files: [{
          src: jses,
          dest: TEMP + 'index.js'
        }]
      },
      ios: {
        files: [{
          src: ['js/polyfill/iOS.js'],
          dest: TEMP + 'ios.js'
        }]
      },
      android: {
        files: [{
          src: ['js/polyfill/Android.js'],
          dest: TEMP + 'android.js'
        }]
      }
    },
    cssmin: { // minify用于压缩css文件，combine用于将多个css文件合并一个文件
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        report: 'gzip'
      },
      web: {
        src: [csses, 'css/web.css'],
        dest: BUILD + 'css/style.css'
      },
      android: { // android样式
        src: [csses, 'css/android.css'],
        dest: TEMP + 'css/android/style.css'
      },
      ios: {
        src: [csses, 'css/iOS.css'],
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
          expand: true,
          cwd: TEMP,
          src: ['*.js'],
          dest: TEMP,
          filter: 'isFile'
        }, {
          src: 'template/config.html',
          dest: TEMP + 'config.html'
        }]
      }
    },
    concat: { // 合并文件，不仅可以合并JS文件，还可以合并CSS文件
      options: {
        separator: ';\n',
        stripBanners: {
          block: true,
          line: true
        },
        process: function (src) {
          return src.replace(/\/\/[#@]\s.+/, '');
        }
      },
      web: {
        src: libs,
        dest: BUILD + 'js/index.js'
      },
      android: {
        src: [libs, TEMP + 'android.js'],
        dest: TEMP + 'js/android/index.js'
      },
      ios: {
        src: [libs, TEMP + 'ios.js'],
        dest: TEMP + 'js/ios/index.js'
      },
      fix: {
        options: {
          separator: '\n'
        },
        files: [{
          src: [BUILD + 'css/style.css', 'css/background-fix.css'],
          dest: BUILD + 'css/style.css'
        }, {
          src: [TEMP + 'css/android/style.css', 'css/background-fix.css'],
          dest: TEMP + 'css/android/style.css'
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
          src: TEMP + target,
          dest: BUILD + target
        }]
      },
      template: {
        files: [{
          expand: true,
          cwd: 'template/',
          src: ['*.html', '!config.html', '!*-web.html'],
          dest: BUILD + 'template/'
        }, {
          src: TEMP + 'config.html',
          dest: BUILD + 'template/config.html'
        }]
      }
    },
    compress: { // 压缩打包
      android: {
        options: {
          archive: '../android.<%= pkg.version %>.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: BUILD,
          src: ['**', '!css/style.css', '!js/index.js'],
          dest: ''
        }, {
          expand: true,
          cwd: TEMP + 'css/android',
          flatten: true,
          src: ['**'],
          dest: 'css/',
          filter: 'isFile'
        }, {
          expand: true,
          flatten: true,
          filter: 'isFile',
          cwd: TEMP + 'js/android',
          src: ['**'],
          dest: 'js'
        }]
      },
      ios: {
        options: {
          archive: '../ios.<%= pkg.version %>.zip',
          mode: 'zip',
          pretty: true
        },
        files: [{
          expand: true,
          cwd: BUILD,
          src: ['**', '!css/style.css', '!js/index.js'],
          dest: ''
        }, {
          src: config.version,
          dest: 'VERSION'
        }, {
          expand: true,
          flatten: true,
          filter: 'isFile',
          cwd: TEMP + 'css/ios',
          src: ['**'],
          dest: 'css'
        }, {
          expand: true,
          flatten: true,
          filter: 'isFile',
          cwd: TEMP + 'js/ios',
          src: ['**'],
          dest: 'js'
        }]
      }
    }
  });

  if (isWeb) { // 网页版需要一些特殊的操作
    grunt.config.merge({
      'imagemin': {
        img: {
          files: [{
            expand: true,
            cwd: 'img/',
            src: ['**/*.{png,jpg,gif}'],
            dest: BUILD + 'img/'
          }]
        }
      },
      'cssmin': {
        web: {
          src: [csses, 'css/web.css'],
          dest: BUILD + 'css/style.css'
        },
        'android': {
          src: 'css/android.css',
          dest: BUILD + 'css/android.css'
        }
      },
      'htmlmin': {
        web: {
          files: [{
            src: 'template/config-comment-web.html',
            dest: BUILD + 'template/config-comment.html'
          }]
        },
        comment: {
          src: 'comment.html',
          dest: BUILD + 'comment.html'
        }
      },
      uglify: {
        web:{
          files: [{
            src: ['js/WxShare.js'],
            dest: BUILD + 'js/WxShare.js'
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
    var html = grunt.file.read(this.data)
      , map = grunt.file.readJSON('bower-cdn-map.json');
    // 取CSS
    html = html.replace(CSS_REG, function (match, src) { // 页面中含有css
      if (isWeb) {
        for (var key in map) {
          var reg = new RegExp(key);
          if (reg.test(src)) {
            return match.replace(src, map[key]);
          }
        }
      }
      csses.push(src);
      return '';
    });
    // 取JS
    html = html.replace(JS_REG, function (match, src) {
      var isLib = src.substr(0, 2) !== 'js';
      if (src.indexOf('define.js') !== -1) {
        return '';
      }
      if (isWeb) {
        for (var key in map) {
          var reg = new RegExp(key);
          if (reg.test(src)) {
            return match.replace(src, map[key]);
          }
        }
      }
      src = src.replace('handlebars.min', 'handlebars.runtime.min');
      isLib ? libs.push(src) : jses.push(src);
      return /index\.js/.test(src) ? match : '';
    });
    jses.unshift('js/templates.js'); // 预编译的模板
    libs.push(TEMP + 'index.js');
    // 取模板
    html = html.replace(TEMPLATE_REG, function (match, other, id, content) {
      // 取POPUP的HTML，在非WEB模式下不加载此DOM
      if (!isWeb) {
        content = content.replace(SHARE_POP_REG,"<div class='content'>")
      }

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
  grunt.registerTask('apps-json', 'create apps.json file for web', function () {
    var apps = {
      apps: [],
      device_id: 'web-version',
      version: grunt.config.get('pkg').version + '.' + grunt.template.today('mmddhhMM')
    };
    grunt.file.write(BUILD + 'apps.json', JSON.stringify(apps));
  });

  grunt.registerTask('default', [
    'clean:start',
    'index',
    'copy',
    'compass',
    'imagemin',
    'handlebars',
    'uglify',
    'cssmin',
    'replace',
    'concat',
    'htmlmin',
    'compress',
    'version',
    'clean:end'
  ]);
  grunt.registerTask('web', [
    'clean:start',
    'index',
    'copy:svg',
    'compass',
    'imagemin',
    'handlebars',
    'uglify',
    'cssmin',
    'replace',
    'concat',
    'htmlmin',
    'version',
    'apps-json',
    'clean:end'
  ]);
};