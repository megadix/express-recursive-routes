const _ = require('lodash');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');
const sinon = require('sinon');

const testUtils = require('./testUtils');

describe('recursiveRoutes', function() {

  // mocks
  const sandbox = sinon.createSandbox();
  const mock_app = {};
  const mock_fs = {};

  // component under test
  let recursiveRoutes;

  beforeEach(function() {
    mock_app.use = sandbox.spy();
    mock_fs.readdirSync = sandbox.stub().throws(Error('Please specify a stubbed behavior for readdirSync()'));
    mock_fs.statSync = sandbox.stub().throws(Error('Please specify a stubbed behavior for statSync()'));
    recursiveRoutes = proxyquire(
      '../src/index',
      {'fs': mock_fs}
    );
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('sunny day execution path', function() {

    it('default values', function() {
      recursiveRoutes.mountRoutes(mock_app);

      const app_use_calls = mock_app.use.getCalls();

      const checkRoutes = new Set(
        _(app_use_calls)
          .map('args')
          .map(args => args[0])
          .value()
      );

      expect(checkRoutes.size).to.equal(7);
      expect(checkRoutes.has('/')).to.be.true;
      expect(checkRoutes.has('/other')).to.be.true;
      expect(checkRoutes.has('/test-1/')).to.be.true;
      expect(checkRoutes.has('/test-1/test-1.1/')).to.be.true;
      expect(checkRoutes.has('/test-1/test-1.1/other')).to.be.true;
      expect(checkRoutes.has('/test-2/controller-1')).to.be.true;
      expect(checkRoutes.has('/test-2/controller-2')).to.be.true;
    });

    describe('custom rootDir and basePath', function() {

      let rootDir;
      let basePath;

      it('correct parameters - 1', function() {
        rootDir = './test/sunny-day';
        basePath = '/customPath';
      });

      it('correct parameters - 2', function() {
        rootDir = 'test/sunny-day';
        basePath = '/customPath';
      });

      it('not-so-correct parameters', function() {
        rootDir = 'test/sunny-day/';
        basePath = '/customPath/';
      });

      afterEach(function() {
        recursiveRoutes.mountRoutes(mock_app, rootDir, basePath);

        const app_use_calls = mock_app.use.getCalls();

        const checkRoutes = new Set(
          _(app_use_calls)
            .map('args')
            .map(args => args[0])
            .value()
        );

        expect(checkRoutes.size).to.equal(7);
        expect(checkRoutes.has('/customPath/')).to.be.true;
        expect(checkRoutes.has('/customPath/other')).to.be.true;
        expect(checkRoutes.has('/customPath/test-1/')).to.be.true;
        expect(checkRoutes.has('/customPath/test-1/test-1.1/')).to.be.true;
        expect(checkRoutes.has('/customPath/test-1/test-1.1/other')).to.be.true;
        expect(checkRoutes.has('/customPath/test-2/controller-1')).to.be.true;
        expect(checkRoutes.has('/customPath/test-2/controller-2')).to.be.true;
      });

    });

  });

  function mock_fs_methods(fs_specs) {
    mock_fs.readdirSync.returns(_.map(fs_specs, _.first));

    const isDirectory = {isDirectory: () => true, isFile: () => false};
    const isFile = {isDirectory: () => false, isFile: () => true};

    _.map(fs_specs, _.last).forEach((stat, i) => {
      if (stat === 'dir') {
        mock_fs.statSync.onCall(i).returns(isDirectory);
      } else if (stat === 'file') {
        mock_fs.statSync.onCall(i).returns(isFile);
      }
    });
  }

  it('custom basePath only', function() {
    mock_fs_methods([
      ['index.js', 'file'],
      ['other.js', 'file'],
      ['test-1', 'dir'],
      ['index.js', 'file'],
      ['test-1.1', 'dir'],
      ['index.js', 'file'],
      ['other.js', 'file'],
      ['test-2', 'dir'],
      ['controller-1.js', 'file'],
      ['controller-2.js', 'file']
    ]);

    recursiveRoutes.mountRoutes(mock_app, null, '/customPath');

    const app_use_calls = mock_app.use.getCalls();

    const checkRoutes = new Set(
      _(app_use_calls)
        .map('args')
        .map(args => args[0])
        .value()
    );

    expect(checkRoutes.size).to.equal(7);
    expect(checkRoutes.has('/customPath/')).to.be.true;
    expect(checkRoutes.has('/customPath/other')).to.be.true;
    expect(checkRoutes.has('/customPath/test-1/')).to.be.true;
    expect(checkRoutes.has('/customPath/test-1/test-1.1/')).to.be.true;
    expect(checkRoutes.has('/customPath/test-1/test-1.1/other')).to.be.true;
    expect(checkRoutes.has('/customPath/test-2/controller-1')).to.be.true;
    expect(checkRoutes.has('/customPath/test-2/controller-2')).to.be.true;
  });

  describe('filtering', function() {

    let rootDir;
    let filter;
    let expectedRoutes;

    it('.route.js', function() {
      rootDir = 'test/filter1';
      filter = '.route.js';
      expectedRoutes = new Set([
        '/',
        '/include-me',
        '/folder1/',
        '/folder1/include-me'
      ]);
    });

    it('route.', function() {
      rootDir = 'test/filter2';
      filter = 'route.';
      expectedRoutes = new Set([
        '/',
        '/include-me',
        '/folder1/',
        '/folder1/include-me'
      ]);
    });

    afterEach(function() {
      recursiveRoutes.mountRoutes(mock_app, rootDir, null, filter);

      const app_use_calls = mock_app.use.getCalls();

      const checkRoutes = new Set(
        _(app_use_calls)
          .map('args')
          .map(args => args[0])
          .value()
      );

      expect(testUtils.eqSet(checkRoutes, expectedRoutes)).to.be.true;
    });

  });

});