/*eslint-disable */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/index';

import { Vendor } from '../src/lib/mongoose/models/vendor';

chai.use(chaiHttp);

const request = () => chai.request(server.callback());

describe('POST /vendors', () => {
  afterEach(() => {
    return Vendor.deleteMany({});
  });

  beforeEach(() => {
    return Vendor.deleteMany({});
  });

  it('should successfully insert a vendor', async () => {
    const main = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(main.status).to.eqls(201);
  });

  it('should throw an error if no id is given', async () => {
    const main = await request().post('/vendors').send({
      _id: null,
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(main.status).to.eqls(400);
  });

  it('should throw an error if no name is given', async () => {
    const main = await request().post('/vendors').send({
      _id: '154151546',
      name: null,
      type: 'SEAMLESS',
    });

    expect(main.status).to.eqls(400);
  });

  it('should throw an error if no type is given', async () => {
    const main = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: null,
    });

    expect(main.status).to.eqls(400);
  });

  it('should throw an error if invalid type is given', async () => {
    const main = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'qwe',
    });

    expect(main.status).to.eqls(400);
  });

  it('should throw an error if id already exists', async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(main.status).to.eqls(400);
  });
});

describe('GET /vendors', () => {
  afterEach(() => {
    return Vendor.deleteMany({});
  });

  beforeEach(() => {
    return Vendor.deleteMany({});
  });

  it('should return list of vendors', async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().get('/vendors');

    expect(main.status).to.eqls(200);
    expect(main.body.view.length).to.eqls(1);
  });
});

describe('GET /vendors/:id', () => {
  afterEach(() => {
    return Vendor.deleteMany({});
  });

  beforeEach(() => {
    return Vendor.deleteMany({});
  });

  it('should return vendor by ID', async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().get('/vendors/154151546');

    expect(main.status).to.eqls(200);
  });

  it(`should throw an error if ID of the Vendor doesn't exist`, async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().get('/vendors/154151547');

    expect(main.status).to.eqls(400);
  });
});

describe('PUT /vendors/:id', () => {
  afterEach(() => {
    return Vendor.deleteMany({});
  });

  beforeEach(() => {
    return Vendor.deleteMany({});
  });

  it('should successfully update a vendor', async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().put('/vendors/154151546').send({
      name: 'Luis Angelo Belmonte',
      type: 'TRANSFER',
    });

    expect(main.status).to.eqls(204);
  });

  it(`should throw an error if ID does'nt exist`, async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().put('/vendors/154151547').send({
      name: 'Luis Angelo Belmonte',
      type: 'TRANSFER',
    });

    expect(main.status).to.eqls(400);
  });

  it(`should throw an error if no name is provided`, async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().put('/vendors/154151546').send({
      name: null,
      type: 'TRANSFER',
    });

    expect(main.status).to.eqls(400);
  });

  it(`should throw an error if no type is provided`, async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().put('/vendors/154151546').send({
      name: 'Luis Angelo Belmonte',
      type: null,
    });

    expect(main.status).to.eqls(400);
  });

  it(`should throw an error if invalid type is provided`, async () => {
    const mock = await request().post('/vendors').send({
      _id: '154151546',
      name: 'Luis Angelo Belmonte',
      type: 'SEAMLESS',
    });

    expect(mock.status).to.eqls(201);

    const main = await request().put('/vendors/154151546').send({
      name: 'Luis Angelo Belmonte',
      type: 'qwe',
    });

    expect(main.status).to.eqls(400);
  });

  describe('DELETE /vendors/:id', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });

    beforeEach(() => {
      return Vendor.deleteMany({});
    });

    it('should delete vendor by id', async () => {
      const mock = await request().post('/vendors').send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });

      expect(mock.status).to.eqls(201);

      const main = await request().delete('/vendors/154151546');

      expect(main.status).to.eqls(200);
      expect(main.body.deleted).to.be.true;
    });

    it(`should throw an error if id doensn't exist`, async () => {
      const mock = await request().post('/vendors').send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });

      expect(mock.status).to.eqls(201);

      const main = await request().post('/vendors').send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });

      expect(main.status).to.eqls(400);
    });
  });
});