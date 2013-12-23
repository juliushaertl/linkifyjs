module.exports = function (grunt) {

	"use strict";

	grunt.initConfig({

		// Import package manifest
		pkg: grunt.file.readJSON("package.json"),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			jquery: {
				files: {
					"build/jquery.linkify.js": [
						"src/linkified.js",
						"src/jquery.linkify.js"
					]
				}
			}
		},

		// Wrap files
		wrap: {
			jquery: {
				expand: true,
				src: ['build/jquery.linkify.js'],
				dest: 'build/',
				options: {
					wrapper: [
						'<%= meta.banner %>\n;(function ($, window, document, undefined) {\n"use strict";',
						'})(jQuery, window, document)\n'
					]
				}
			}
		},

		// Lint definitions
		jshint: {
			files: ["src/*"],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		// Minify definitions
		uglify: {
			dist: {
				src: ["dist/jquery.linkify.js"],
				dest: "dist/jquery.linkify.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

		copy: {
			build: {
				expand: true,
				flatten: true,
				src: "build/build/*",
				dest: "dist/"
			},
			demo: {
				src: "dist/*",
				dest: "demo/"
			},
		},

		connect: {
			server: {
				options: {
					keepalive: true
				}
			}
		},

		"gh-pages": {
			options: {
				base: "demo"
			},
			src: ["**"]
		},

		bumper: {
			options: {
				tasks: [
					"default",
					"gh-pages"
				]
			},
			push: {
				files: [
					"package.json",
					"bower.json"
				],
				updateConfigs: ["pkg"],
				releaseBranch: ["master"]
			}
		},

		clean: [
			".grunt/grunt-gh-pages/gh-pages",
			"build/*"
		]

	});

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-wrap");
	grunt.loadNpmTasks("grunt-gh-pages");
	grunt.loadNpmTasks("grunt-bumper");

	grunt.registerTask("default", [
		"jshint",
		"concat",
		"wrap",
		"copy:build",
		"uglify",
		"copy:demo",
		"clean"
	]);

	grunt.registerTask("travis", ["jshint"]);
	grunt.registerTask("release", ["bumper", "clean"]);
	grunt.registerTask("release:minor", ["bumper:minor", "clean"]);
	grunt.registerTask("release:major", ["bumper:major", "clean"]);

};
