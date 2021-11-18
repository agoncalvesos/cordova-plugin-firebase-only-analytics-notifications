var fs = require("fs");
var path = require("path");
var utils = require("../../configurations/utilities");

function rootBuildGradleExists() {
  var target = path.join("platforms", "android", "build.gradle");
  return fs.existsSync(target);
}

/*
 * Helper function to read the build.gradle that sits at the root of the project
 */
function readRootBuildGradle() {
  var target = path.join("platforms", "android", "build.gradle");
  return fs.readFileSync(target, "utf-8");
}

/*
 * Added a dependency on 'com.google.gms' based on the position of the know 'com.android.tools.build' dependency in the build.gradle
 */
function addDependencies(buildGradle, context) {
  
  // find and modify the actual line
  return buildGradle.replace(/([\S|\s]*)(classpath[\S|\s]*)/m, (match,g1,g2)=>{
    // modify the line to add the necessary dependencies
    let googlePlayDependency = 'classpath \'com.google.gms:google-services:4.3.10\' // google-services dependency from cordova-plugin-firebase';
    let fabricDependency = ' classpath \'com.google.firebase:firebase-crashlytics-gradle:2.3.0\' // crashlytics dependency from cordova-plugin-firebase'
    return g1 + googlePlayDependency + '\n\t\t' + fabricDependency + '\n\t\t' + g2
  });
}

/*
 * Helper function to write to the build.gradle that sits at the root of the project
 */
function writeRootBuildGradle(contents) {
  var target = path.join("platforms", "android", "build.gradle");
  fs.writeFileSync(target, contents);
}

module.exports = {

  modifyRootBuildGradle: function(context) {
    // be defensive and don't crash if the file doesn't exist
    if (!rootBuildGradleExists) {
      return;
    }

    var buildGradle = readRootBuildGradle();

    // Add Google Play Services Dependency
    buildGradle = addDependencies(buildGradle, context);
  
    writeRootBuildGradle(buildGradle);
  },

  restoreRootBuildGradle: function(context) {
    // be defensive and don't crash if the file doesn't exist
    if (!rootBuildGradleExists) {
      return;
    }

    var buildGradle = readRootBuildGradle();

    // remove any lines we added
    buildGradle = buildGradle.replace(/(?:^|\r?\n)(.*)cordova-plugin-firebase*?(?=$|\r?\n)/g, '');
  
    writeRootBuildGradle(buildGradle);
  }
};