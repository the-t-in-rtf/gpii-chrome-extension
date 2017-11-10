/*
 * GPII Chrome Extension for Google Chrome
 *
 * Copyright 2016 RtF-US
 * Copyright 2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this license.
 *
 * You may obtain a copy of the license at
 * https://github.com/GPII/gpii-chrome-extension/blob/master/LICENSE.txt
 */

 /* global module */

"use strict";

module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-stylus");
    grunt.loadNpmTasks("grunt-crx");
    grunt.loadNpmTasks("grunt-jsonlint");

    var files = {
        extensionLib: [
            "node_modules/infusion/src/framework/core/js/jquery.standalone.js",
            "node_modules/infusion/src/framework/core/js/Fluid.js",
            "node_modules/infusion/src/framework/core/js/FluidDebugging.js",
            "node_modules/infusion/src/framework/core/js/FluidIoC.js",
            "node_modules/infusion/src/framework/core/js/DataBinding.js",
            "node_modules/infusion/src/framework/core/js/ModelTransformation.js",
            "node_modules/infusion/src/framework/core/js/ModelTransformationTransforms.js"
        ],

        contentScriptsLib: [
            "node_modules/infusion/src/lib/jquery/core/js/jquery.js",
            "node_modules/infusion/src/framework/core/js/Fluid.js",
            "node_modules/infusion/src/framework/core/js/FluidDocument.js",
            "node_modules/infusion/src/framework/core/js/FluidIoC.js",
            "node_modules/infusion/src/framework/core/js/DataBinding.js",
            "node_modules/infusion/src/framework/core/js/FluidView.js",
            "node_modules/infusion/src/framework/core/js/ModelTransformation.js",
            "node_modules/infusion/src/framework/core/js/ModelTransformationTransforms.js",
            "node_modules/infusion/src/framework/core/js/FluidDOMUtilities.js",
            "node_modules/infusion/src/framework/core/js/FluidRequests.js",
            "node_modules/infusion/src/lib/fastXmlPull/js/fastXmlPull.js",
            "node_modules/infusion/src/framework/renderer/js/fluidParser.js",
            "node_modules/infusion/src/framework/renderer/js/fluidRenderer.js",
            "node_modules/infusion/src/framework/renderer/js/RendererUtilities.js",
            "node_modules/infusion/src/framework/enhancement/js/ContextAwareness.js",
            "node_modules/infusion/src/framework/enhancement/js/ProgressiveEnhancement.js",
            "node_modules/infusion/src/components/tableOfContents/js/TableOfContents.js",
            "node_modules/infusion/src/framework/preferences/js/Enactors.js"
        ],
        adjustersLib: [
            // not concatenating all the individual files because there was an issue when including
            // "node_modules/infusion/src/framework/preferences/js/PrefsEditor.js" that caused
            // the distributeOptions to not pass along the configuration to the messageLoader and
            // templateLoader
            "node_modules/infusion/dist/infusion-all.js",
            "extension/src/lib/portBinding.js",
            "extension/src/lib/PrefsEditor.js",
            "extension/src/lib/PrefsEditorInstantiation.js"
        ],
        templates: [
            "node_modules/infusion/src/components/tableOfContents/html/TableOfContents.html",
            "node_modules/infusion/src/framework/preferences/html/PrefsEditorTemplate-textSize.html",
            "node_modules/infusion/src/framework/preferences/html/PrefsEditorTemplate-lineSpace.html",
            "node_modules/infusion/src/framework/preferences/html/PrefsEditorTemplate-contrast.html",
            "node_modules/infusion/src/framework/preferences/html/PrefsEditorTemplate-layout.html",
            "node_modules/infusion/src/framework/preferences/html/PrefsEditorTemplate-enhanceInputs.html",
            "node_modules/infusion/src/framework/preferences/html/PrefsEditorTemplate-speak.html"
        ],
        messages: [
            "node_modules/infusion/src/framework/preferences/messages/*.json"
        ],
        fonts: [
            "node_modules/infusion/src/framework/preferences/fonts/*",
            "node_modules/infusion/src/lib/fonts/*.ttf"
        ],
        images: [
            "node_modules/infusion/src/framework/preferences/images/default/*"
        ],
        css: [
            "node_modules/infusion/src/lib/normalize/css/normalize.css",
            "node_modules/infusion/src/framework/core/css/fluid.css",
            "node_modules/infusion/dist/assets/src/framework/preferences/css/PrefsEditor.css",
            "node_modules/infusion/dist/assets/src/framework/preferences/css/SeparatedPanelPrefsEditorFrame.css"
        ],
        infusionTesting: [
            "node_modules/infusion/src/framework/enhancement/js/ContextAwareness.js",
            "node_modules/infusion/tests/test-core/utils/js/IoCTestUtils.js"
        ],
        extension: [
            "extension/src/lib/chromeEvented.js",
            "extension/src/lib/chromeNotification.js",
            "extension/src/lib/domSettingsApplier.js",
            "extension/src/lib/extensionHolder.js",
            "extension/src/lib/highContrast.js",
            "extension/src/lib/chromeSettings.js",
            "extension/src/lib/wsConnector.js",
            "extension/src/lib/zoom.js"
        ]
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        manifest: grunt.file.readJSON("extension/manifest.json"),
        jsonlint: {
            all: [
                "*.json",
                "extension/**/*.json",
                "tests/**/*.json"
            ]
        },
        eslint: {
            all: [
                "*.js",
                "extension/**/*.js",
                "tests/**/*.js"
            ]
        },
        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                }
                // sourceMap options set in buildDev task definition
            },
            all: {
                files: {
                    "dist/<%= pkg.name %>-all.min.js" : [].concat(
                        files.extensionLib,
                        files.extension
                    ),
                    "dist/<%= pkg.name %>-contentScriptsLib.min.js" : [].concat(
                        files.contentScriptsLib
                    ),
                    "dist/<%= pkg.name %>-adjustersLib.min.js" : [].concat(
                        files.adjustersLib
                    )
                }
            }
        },
        stylus: {
            build: {
                options: {
                    compress: true,
                    relativeDest: "../../build/css"
                },
                files: [{
                    expand: true,
                    src: ["extension/stylus/*.styl"],
                    ext: ".css"
                }]
            }
        },
        copy: {
            main: {
                files: [
                    {
                        src: ["extension/manifest.json"],
                        dest: "build/manifest.json"
                    },
                    {
                        src: ["extension/src/background.js"],
                        dest: "build/src/background.js"
                    },
                    {
                        src: ["extension/src/lib/adjusterScriptLoader.js"],
                        dest: "build/src/adjusterScriptLoader.js"
                    },
                    {
                        expand: true,
                        cwd: "extension/css/",
                        src: "*",
                        dest: "build/css/"
                    },
                    {
                        expand: true,
                        cwd: "extension/html/",
                        src: "*",
                        dest: "build/html/"
                    },
                    {
                        expand: true,
                        cwd: "extension/templates/",
                        src: "*",
                        dest: "build/templates/"
                    },
                    {
                        expand: true,
                        cwd: "extension/messages/",
                        src: "*",
                        dest: "build/messages/"
                    },
                    {
                        src: [].concat(
                            files.templates
                        ),
                        dest: "build/templates/",
                        expand: true,
                        flatten: true
                    },
                    {
                        src: [].concat(
                            files.messages
                        ),
                        dest: "build/messages/",
                        expand: true,
                        flatten: true
                    },
                    {
                        src: [].concat(
                            files.fonts
                        ),
                        dest: "build/fonts/",
                        expand: true,
                        flatten: true
                    },
                    {
                        src: [].concat(
                            files.images
                        ),
                        dest: "build/images/",
                        expand: true,
                        flatten: true
                    },
                    {
                        src: [].concat(
                            files.css
                        ),
                        dest: "build/css/",
                        expand: true,
                        flatten: true
                    },
                    {
                        expand: true,
                        cwd: "extension/images/",
                        src: "*",
                        dest: "build/images/"
                    },
                    {
                        expand: true,
                        cwd: "extension/src/content_scripts/",
                        src: "*",
                        dest: "build/content_scripts/"
                    },
                    {
                        src: ["dist/*.min.js*"],
                        dest: "build/"
                    }
                ]
            }
        },
        clean: {
            all: {
                src: ["dist/", "build/", "*.crx"]
            }
        },
        crx: {
            "build": {
                "src": [
                    "build/**/*"
                ],
                "dest": "./gpii-chrome-extension.crx",
                "options": {
                    "privateKey": "./key.pem"
                }
            }
        }
    });

    grunt.registerTask("lint", "Lint the source code", ["jsonlint", "eslint"]);
    grunt.registerTask("bundle", "Bundle dependencies and source code into a single .min.js file", ["uglify"]);
    grunt.registerTask("build", "Build the extension so you can start using it unpacked", ["clean", "bundle", "stylus", "copy"]);
    grunt.registerTask("buildPkg", "Create a .crx package ready to be distributed", ["lint", "build", "crx"]);

    grunt.registerTask("buildDev", "Build the extension so you can start using it unpacked and with a sourceMap", function () {
        grunt.config.set("uglify.options.sourceMap.includeSources", true);
        grunt.task.run("build");
    });
};
