import { MissingVendorInformationError } from '../../custom-errors';
import { Vendor } from '../../lib/mongoose/models/vendor';

type VendorEntityInput = Pick<Vendor, 'name' | 'type'>;
type VendorEntityOutput = Pick<Vendor, 'name' | 'type'>;

export type VendorEntity = (
  input: VendorEntityInput,
) => Promise<VendorEntityOutput>;

const entity = (): VendorEntity => {
  return async function vendor({ name, type }) {
    if (!name) {
      throw new MissingVendorInformationError(`Please input name`);
    }

    if (!type) {
      throw new MissingVendorInformationError(`Please input type`);
    }

    return {
      name,
      type,
    };
  };
};

export default entity;
