module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    sass:
      styles:
        options:
          style: 'expanded'
          bundleExec: true
          sourcemap: 'none'
        files:
          'styles/subtasks.css': 'styles/subtasks.scss'

    coffee:
      options:
        bare: true
      spec:
        files:
          'spec/subtasks-spec.js': 'spec/subtasks-spec.coffee'
      subtasks:
        files:
          'lib/subtasks.js': [
            'src/subtasks.coffee'
            'src/autolink.coffee'
          ]

    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
      scripts:
        files: ['src/*.coffee', 'spec/*.coffee']
        tasks: ['coffee', 'umd']
      jasmine:
        files: [
          'styles/subtasks.css'
          'lib/subtasks.js'
          'specs/*.js'
        ],
        tasks: 'jasmine'

    jasmine:
      terminal:
        src: ['lib/subtasks.js']
        options:
          specs: 'spec/subtasks-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/jasmine-jquery/lib/jasmine-jquery.js'
            'vendor/bower/simple-module/lib/module.js'
            'vendor/bower/simple-util/lib/util.js'
            'vendor/bower/simple-checkbox/lib/checkbox.js'
          ]
      test:
        src: ['lib/subtasks.js']
        options:
          outfile: 'spec/index.html'
          styles: 'styles/subtasks.css'
          specs: 'spec/subtasks-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/jasmine-jquery/lib/jasmine-jquery.js'
            'vendor/bower/simple-module/lib/module.js'
            'vendor/bower/simple-util/lib/util.js'
            'vendor/bower/simple-checkbox/lib/checkbox.js'
          ]
    umd:
      all:
        src: 'lib/subtasks.js'
        template: 'umd.hbs'
        amdModuleId: 'simple-subtasks'
        objectToExport: 'subtasks'
        globalAlias: 'subtasks'
        deps:
          'default': ['$', 'SimpleModule']
          amd: ['jquery', 'simple-module']
          cjs: ['jquery', 'simple-module']
          global:
            items: ['jQuery', 'SimpleModule']
            prefix: ''


  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['sass', 'coffee', 'umd', 'jasmine', 'watch']
  grunt.registerTask 'test', ['sass', 'coffee', 'umd', 'jasmine:terminal']

