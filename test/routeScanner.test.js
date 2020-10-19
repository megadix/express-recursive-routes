const expect = require('chai').expect;
const path = require('path');
const mockFs = require('mock-fs');

const index = require('../src/index');
const routeScanner = require('../src/routeScanner');

describe('routeScanner', function() {
  afterEach(function() {
    mockFs.restore();
  });

  function verifyRoutes(controllers) {
    const checkRoutes = new Map();
    controllers.forEach(controller => {
      const src = path.relative('./routes', controller.src).replace(/\\/g, '/');
      checkRoutes.set(controller.path, src);
    });

    return checkRoutes;
  }

  describe('scanRoutes()', function() {
    it('default parameters', function() {
      mockFs({
        'routes': {
          'test-1': {
            'test-1.1': {
              'index.js': '',
              'other.js': ''
            },
            'index.js': ''
          },
          'test-2': {
            'controller-1.js': '',
            'controller-2.js': ''
          },
          'index.js': '',
          'other.js': ''
        }
      });

      const controllers = routeScanner.scanRoutes(index.DEFAULT_ROOT_DIR, index.DEFAULT_BASE_PATH, index.DEFAULT_FILTER);
      expect(controllers.length).to.equal(7);

      const checkRoutes = verifyRoutes(controllers);

      expect(checkRoutes.get('/')).to.equal('index.js');
      expect(checkRoutes.get('/other')).to.equal('other.js');
      expect(checkRoutes.get('/test-1/')).to.equal('test-1/index.js');
      expect(checkRoutes.get('/test-1/test-1.1/')).to.equal('test-1/test-1.1/index.js');
      expect(checkRoutes.get('/test-1/test-1.1/other')).to.equal('test-1/test-1.1/other.js');
      expect(checkRoutes.get('/test-2/controller-1')).to.equal('test-2/controller-1.js');
      expect(checkRoutes.get('/test-2/controller-2')).to.equal('test-2/controller-2.js');
    });

    describe('custom rootDir and basePath', function() {
      const doTest = (realRootDir, rootDir, basePath) => () => {
        mockFs({
          [realRootDir]: {
            'test-1': {
              'test-1.1': {
                'index.js': '',
                'other.js': ''
              },
              'index.js': ''
            },
            'test-2': {
              'controller-1.js': '',
              'controller-2.js': ''
            },
            'index.js': '',
            'other.js': ''
          }
        });

        const controllers = routeScanner.scanRoutes(rootDir, basePath, index.DEFAULT_FILTER);
        expect(controllers.length).to.equal(7);

        const checkRoutes = verifyRoutes(controllers);

        expect(checkRoutes.get('/customPath/')).to.equal('../test/sunny-day/index.js');
        expect(checkRoutes.get('/customPath/other')).to.equal('../test/sunny-day/other.js');
        expect(checkRoutes.get('/customPath/test-1/')).to.equal('../test/sunny-day/test-1/index.js');
        expect(checkRoutes.get('/customPath/test-1/test-1.1/')).to.equal('../test/sunny-day/test-1/test-1.1/index.js');
        expect(checkRoutes.get('/customPath/test-1/test-1.1/other')).to.equal('../test/sunny-day/test-1/test-1.1/other.js');
        expect(checkRoutes.get('/customPath/test-2/controller-1')).to.equal('../test/sunny-day/test-2/controller-1.js');
        expect(checkRoutes.get('/customPath/test-2/controller-2')).to.equal('../test/sunny-day/test-2/controller-2.js');
      };

      it('correct parameters - 1', doTest('test/sunny-day', './test/sunny-day', '/customPath'));

      it('correct parameters - 2', doTest('test/sunny-day', 'test/sunny-day', '/customPath'));

      it('not-so-correct parameters', doTest('test/sunny-day', 'test/sunny-day/', '/customPath/'));

    });

  });
});