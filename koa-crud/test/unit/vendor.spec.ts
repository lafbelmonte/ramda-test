import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';
import { vendorEntity } from '../../src/entities/vendor';

const chance = new Chance();

chai.use(chaiAsPromised);

describe('Vendor Entity', () => {
  describe('Given expected input', () => {
    it('should return the expected output', async () => {
      const mock = {
        name: chance.name({ middle: true }),
        type: 'SEAMLESS',
        dateTimeCreated: new Date(),
        dateTimeUpdated: new Date(),
      };

      await expect(vendorEntity(mock)).to.eventually.fulfilled.and.have.keys(
        'name',
        'type',
        'dateTimeCreated',
        'dateTimeUpdated',
      );
    });
  });

  describe('Given no name', () => {
    it('should throw an error', async () => {
      const mock = {
        name: '',
        type: 'SEAMLESS',
        dateTimeCreated: new Date(),
        dateTimeUpdated: new Date(),
      };

      await expect(vendorEntity(mock)).to.eventually.rejectedWith(
        'Please input name',
      );
    });
  });

  describe('Given no type', () => {
    it('should throw an error', async () => {
      const mock = {
        name: chance.name({ middle: true }),
        type: '',
        dateTimeCreated: new Date(),
        dateTimeUpdated: new Date(),
      };

      await expect(vendorEntity(mock)).to.eventually.rejectedWith(
        'Please input type',
      );
    });
  });
});
