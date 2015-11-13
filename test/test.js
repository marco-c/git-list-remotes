'use strict';

var assert = require('assert');
var expect = require('chai').expect;
var childProcess = require('child_process');
var temp = require('temp').track();

var gitRemotes = require('../index.js');

describe('git-remotes', function() {
  var oldWD = process.cwd();

  beforeEach(function() {
    var dirPath = temp.mkdirSync('git-remotes');
    process.chdir(dirPath);
  });

  afterEach(function() {
    process.chdir(oldWD);
  });

  it('returns the correct remotes when there\'s a single remote', function() {
    childProcess.execSync('git init');
    childProcess.execSync('git remote add origin https://github.com/marco-c/git-remote-url.git');

    return gitRemotes('./').then(function(remotes) {
      expect(remotes).to.have.length(1);
      expect(remotes).to.include('origin');
    });
  });

  it('returns the correct URLs when there are multiple remotes', function() {
    childProcess.execSync('git init');
    childProcess.execSync('git remote add origin https://github.com/marco-c/git-remote-url.git');
    childProcess.execSync('git remote add upstream https://github.com/marco-c/ahahah.git');

    return gitRemotes('./').then(function(remotes) {
      expect(remotes).to.have.length(2);
      expect(remotes).to.include('origin');
      expect(remotes).to.include('upstream');
    });
  });

  it('returns the correct URLs when there\'s no origin remote', function() {
    childProcess.execSync('git init');
    childProcess.execSync('git remote add remote1 https://github.com/marco-c/remote1.git');
    childProcess.execSync('git remote add remote2 https://github.com/marco-c/remote2.git');

    return gitRemotes('./').then(function(remotes) {
      expect(remotes).to.have.length(2);
      expect(remotes).to.include('remote1');
      expect(remotes).to.include('remote2');
    });
  });

  it('fails when the directory isn\'t a git repository', function() {
    return gitRemotes('./').then(function() {
      expect(false).to.be.true;
    }, function() {
      expect(true).to.be.true;
    });
  });

  it('returns an empty array when the repository doesn\'t have remotes', function() {
    childProcess.execSync('git init');

    return gitRemotes('./').then(function(remotes) {
      expect(remotes).to.have.length(0);
    });
  });
});
