/**
 * Created by meathill on 14-1-24.
 */
module.exports = function (grunt) {
  var build = '../platforms/assets/www'
    , temp = 'temp/';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      start: [build],
      end: [temp]
    }
  });

  grunt.registerTask('default', [
    'clean:start',
    'copy',
    'cssmin',
    'imagemin',
    'uglify',
    'clean:end'
  ]);
}