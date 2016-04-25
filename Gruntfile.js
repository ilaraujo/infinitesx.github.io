module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				// options here to override JSHint defaults
				globals: {
					validthis: true,
					laxcomma: true,
					laxbreak: true,
					browser: true,
					eqnull: true,
					debug: true,
					devel: true,
					boss: true,
					expr: true,
					asi: true
				}
			},
			production: ['Gruntfile.js', './source/js/*.js', './source/js/locales/*.json'],
		},
		concat: {
			options: {
				separator: '\n;'
			},
			vendors: {
				src: ['./source/js/libs/jquery.min.js', './source/js/libs/bootstrap-tooltip.js', './source/js/libs/bootstrap-popover.js', './source/js/libs/bootstrap-modal.js', './source/js/libs/mustache.js', './source/js/libs/date.js', './source/js/libs/gauge.js', './source/js/libs/i18next-1.7.1.js'],
				dest: './public/js/vendors.js'
			},
		},
		uglify: {
			production: {
				files: {
					'./public/js/vendors.min.js': ['./public/js/vendors.js']
				}
			}
		},
		replace: {
			date: {
				options: {
					patterns: [{
						match: 'timestamp',
						replacement: '<%= grunt.template.today() %>'
					}]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['./source/js/upscuits.js'],
					dest: './public/js/'
				}]
			},
			version: {
				options: {
					patterns: [{
						match: 'version',
						replacement: '<%= pkg.version %>'
					}]
				},
				files: [{
					expand: true,
					flatten: true,
					src: ['./source/index.html'],
					dest: './public/'
				}]
			}
		},
		less: {
			development: {
				options: {
					yuicompress: false
				},
				files: {
					'./public/css/upscuits.css': './source/less/upscuits.less'
				}
			},
			production: {
				options: {
					yuicompress: true
				},
				files: {
					'./public/css/upscuits.min.css': './source/less/upscuits.less'
				}
			}
		},
		watch: {
			js: {
				files: ['./source/js/upscuits.js', './source/js/locales/*.json', './source/index.html'],
				tasks: ['replace', 'jshint', 'copy']
			},
			less: {
				files: ['./source/less/*.less', './source/index.html'],
				tasks: ['replace', 'less', 'copy']
			}
		},
	
		copy: {
			translation: {
				files: [{
					expand: true,
					cwd: './source/js/locales/',
					src: ['**'],
					dest: './public/js/locales',
					filter: 'isFile'
				}]
			}
		},

		bump: {
			options: {
				commit: true,
				commitMessage: 'Version bump to v%VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false
			}
		},

		connect: {
			options: {
				hostname: 'localhost'
			},
			dist: {
				options: {
					port: 8000,
					base: 'public'
				}
			},
			test: {
				options: {
					port: 8001,
					base: ['test', 'public']
				}
			},
		},

		mocha: {
			test: {
				options: {
					run: true,
					urls: [ 'http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/test.html' ],
				},
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-mocha');

	// Default task(s).
	grunt.registerTask('default', ['js', 'less', 'copy']);
	grunt.registerTask('js', ['jshint', 'concat', 'replace', 'uglify']);
	grunt.registerTask('test', ['default', 'connect:test', 'mocha']);

	grunt.registerTask('heroku', ['js', 'less', 'copy']);

};