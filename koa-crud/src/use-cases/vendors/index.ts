import { eVendor } from '../../entities/vendor';

import { dVendors } from '../../data-access/mongoose/vendors';

import selectAllVendors from './select-all-vendors';
import selectOneVendor from './select-one-vendor';
import insertVendor from './insert-vendor';
import updateVendor from './update-vendor';

const uSelectAllVendors = selectAllVendors({ dVendors });
const uSelectOneVendor = selectOneVendor({ dVendors });
const uInsertVendor = insertVendor({ dVendors, eVendor });
const uUpdateVendor = updateVendor({ dVendors, eVendor });

export { uSelectAllVendors, uSelectOneVendor, uInsertVendor, uUpdateVendor };
