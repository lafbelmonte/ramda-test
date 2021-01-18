import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { Promo } from '../../../src/lib/mongoose/models/promo';

import { promosStore } from '../../../src/data-access/mongoose/promos';

import { initializeDatabase } from '../../../src/lib/mongoose';

import {
  PromoTemplate,
  RequiredMemberFields,
  PromoStatus,
} from '../../../src/types';

chai.use(chaiAsPromised);

const chance = new Chance();

const {
  insertOnePromo,
  selectAllPromos,
  selectOnePromoByFilters,
} = promosStore;

describe('Promo Store', () => {
  before(async function () {
    this.mock = null;
    this.randomName = () => chance.name({ middle: true });
    this.randomTitle = () => chance.word();
    this.randomDescription = () => chance.word();
    this.randomBalance = () => chance.floating();
    this.mockedId = mongoose.Types.ObjectId().toString();
    await initializeDatabase();
  });

  describe('Insert one Promo', () => {
    afterEach(() => {
      return Promo.deleteMany({});
    });

    beforeEach(() => {
      return Promo.deleteMany({});
    });

    describe('GIVEN correct inputs and deposit template', () => {
      it('should be fulfilled and have status of DRAFT', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        };
        await expect(
          insertOnePromo(this.mock),
        ).to.eventually.fulfilled.property('status', PromoStatus.Draft);
      });
    });

    describe('Given correct input and sign up template', () => {
      it('should be fulfilled and have status of DRAFT', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.SignUp,
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [
            RequiredMemberFields.BankAccount,
            RequiredMemberFields.Email,
            RequiredMemberFields.Realname,
          ],
        };
        await expect(
          insertOnePromo(this.mock),
        ).to.eventually.fulfilled.property('status', PromoStatus.Draft);
      });
    });

    describe('Given no name', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: '',
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        };
        await expect(insertOnePromo(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given no title', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: '',
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        };
        await expect(insertOnePromo(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given no description', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: '',
          minimumBalance: this.randomBalance(),
        };
        await expect(insertOnePromo(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given erroneous required fields member and sign up template', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.SignUp,
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [this.randomDescription()],
        };
        await expect(insertOnePromo(this.mock)).to.eventually.rejected;
      });
    });
  });

  describe('Select All Promos', () => {
    after(() => {
      return Promo.deleteMany({});
    });

    before(async function () {
      await Promo.deleteMany({});
      this.mock = await Promo.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      });
    });

    it('should return a list of promos', async () => {
      await expect(selectAllPromos()).eventually.fulfilled.and.have.length(1);
    });
  });

  describe('Select One Promo', () => {
    after(() => {
      return Promo.deleteMany({});
    });

    before(async function () {
      await Promo.deleteMany({});
      this.mock = await Promo.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      });
    });

    describe('GIVEN existent filters', () => {
      it('should return the promo', async function () {
        await expect(
          selectOnePromoByFilters({ _id: this.mock._id }),
        ).to.eventually.fulfilled.property('_id', this.mock._id);
      });
    });

    describe('GIVEN non existent filters', () => {
      it('should return null', async function () {
        await expect(selectOnePromoByFilters({ _id: this.mockedId })).to
          .eventually.fulfilled.and.null;
      });
    });
  });
});
