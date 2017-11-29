const _ = require('lodash');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('recursiveRoutes', function () {

    const sandbox = sinon.createSandbox();
    const mock_app = {};

    beforeEach(function () {
        mock_app.use = sinon.spy();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('sunny day execution path', function () {

        it('default values', function () {
            const recursiveRoutes = require('../src/index');
            recursiveRoutes.mountRoutes(mock_app);

            const app_use_calls = mock_app.use.getCalls();

            const checkRoutes = new Set(
                _(app_use_calls)
                    .map('args')
                    .map(args => args[0])
                    .value()
            );

            expect(checkRoutes.size).to.equal(5);
            expect(checkRoutes.has('/')).to.be.true;
            expect(checkRoutes.has('/other')).to.be.true;
            expect(checkRoutes.has('/test-1/')).to.be.true;
            expect(checkRoutes.has('/test-2/controller-1')).to.be.true;
            expect(checkRoutes.has('/test-2/controller-2')).to.be.true;
        });

        describe('custom rootDir and basePath', function () {

            let rootDir;
            let basePath;

            beforeEach(function () {
                const checkRoutes = new Set();
            });

            it('correct parameters - 1', function () {
                rootDir = './test/sunny-day';
                basePath = '/customPath';
            });

            it('correct parameters - 2', function () {
                rootDir = 'test/sunny-day';
                basePath = '/customPath';
            });

            it('not-so-correct parameters', function () {
                rootDir = 'test/sunny-day/';
                basePath = '/customPath/';
            });

            afterEach(function () {
                const recursiveRoutes = require('../src/index');
                recursiveRoutes.mountRoutes(mock_app, rootDir, basePath);

                const app_use_calls = mock_app.use.getCalls();

                const checkRoutes = new Set(
                    _(app_use_calls)
                        .map('args')
                        .map(args => args[0])
                        .value()
                );

                expect(checkRoutes.size).to.equal(5);
                expect(checkRoutes.has('/customPath/')).to.be.true;
                expect(checkRoutes.has('/customPath/other')).to.be.true;
                expect(checkRoutes.has('/customPath/test-1/')).to.be.true;
                expect(checkRoutes.has('/customPath/test-2/controller-1')).to.be.true;
                expect(checkRoutes.has('/customPath/test-2/controller-2')).to.be.true;
            });

        });
    });

    it('empty dir', function () {
        const recursiveRoutes = require('../src/index');
        recursiveRoutes.mountRoutes(mock_app, './test/empty');
        expect(mock_app.use.getCalls().length).to.equal(0);
    });

});