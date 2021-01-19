import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import bcrypt from 'bcrypt';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { enrollToPromoUseCase } from '../../../src/use-cases/promo-enrollment-requests';

import { Member } from '../../../src/lib/mongoose/models/member';
import { Promo } from '../../../src/lib/mongoose/models/promo';
import { PromoEnrollmentRequest } from '../../../src/lib/mongoose/models/promo-enrollment-request';

import { initializeDatabase } from '../../../src/lib/mongoose';

import {
  PromoTemplate,
  PromoStatus,
  RequiredMemberFields,
} from '../../../src/types';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Promo Enrollment Use Cases', function () {
  before(async function () {
    await initializeDatabase();
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;

    this.randomString = () => chance.word();

    const member = await Member.create({
      username: this.randomString(),
      password: await bcrypt.hash(this.randomString(), 10),
      realName: this.randomString(),
      email: this.randomString(),
      bankAccount: this.randomString(),
      balance: 26,
    });

    this.member = member;
  });

  after(() => {
    return Member.deleteMany({});
  });

  describe('Enroll Member to a Promo', () => {
    before(async function () {
      const depositMock = await Promo.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await Promo.create({
        name: this.randomString(),
        template: PromoTemplate.SignUp,
        title: this.randomString(),
        description: this.randomString(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
        status: PromoStatus.Active,
      });
      this.depositMockId = depositMock._id;
      this.signUpMockId = signUpMock._id;
    });

    after(() => {
      return Promo.deleteMany({});
    });

    afterEach(() => {
      return PromoEnrollmentRequest.deleteMany({});
    });

    beforeEach(() => {
      return PromoEnrollmentRequest.deleteMany({});
    });

    describe('Given valid member to enroll to a deposit promo', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock)).to.eventually.fulfilled
          .and.be.true;
      });
    });

    describe('Given valid member to enroll to a sign promo', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock)).to.eventually.fulfilled
          .and.be.true;
      });
    });

    describe('Given no promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: '',
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith('Please input promo ID');
      });
    });

    describe('Given non existent promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.randomString(),
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith('Promo not found');
      });
    });

    describe('Given non existent promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.randomString(),
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith('Promo not found');
      });
    });

    describe('Given enrolled already promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await enrollToPromoUseCase(this.mock);

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith('You are already enrolled in this promo');
      });
    });

    describe('Given member with not enough balance to enroll to a deposit promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          { balance: 24 },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(
          `You don't have enough balance to enroll in this promo`,
        );
      });
    });

    describe('Given member with no email to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          {
            realName: this.randomString(),
            email: null,
            bankAccount: this.randomString(),
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(`Required member field EMAIL is missing`);
      });
    });

    describe('Given member with no real name to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          {
            realName: null,
            email: this.randomString(),
            bankAccount: this.randomString(),
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(
          `Required member field REAL_NAME is missing`,
        );
      });
    });

    describe('Given member with no bank account to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          {
            realName: this.randomString(),
            email: this.randomString(),
            bankAccount: null,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(
          `Required member field BANK_ACCOUNT is missing`,
        );
      });
    });

    describe('Given inactive promo', () => {
      it('should throw an error', async function () {
        await Promo.findOneAndUpdate(
          { _id: this.signUpMockId },
          {
            status: PromoStatus.Inactive,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(`Promo is not active`);
      });
    });

    describe('Given draft promo', () => {
      it('should throw an error', async function () {
        await Promo.findOneAndUpdate(
          { _id: this.signUpMockId },
          {
            status: PromoStatus.Draft,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(`Promo is not active`);
      });
    });

    describe('Given not set minimum balance deposit promo', () => {
      it('should throw an error', async function () {
        await Promo.findOneAndUpdate(
          { _id: this.depositMockId },
          {
            minimumBalance: null,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await expect(
          enrollToPromoUseCase(this.mock),
        ).to.eventually.rejectedWith(`Minimum balance not set in the promo`);
      });
    });
  });
});