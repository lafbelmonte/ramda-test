import {
  selectAllVendorsUseCase,
  insertVendorUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../use-cases/vendors';

const Query = {
  vendors: async () =>
    selectAllVendorsUseCase({ id: null, info: null, source: null }),
  vendor: async (obj, args) =>
    selectOneVendorUseCase({ id: args.id, info: null, source: null }),
};

const Mutation = {
  createVendor: async (obj, args) =>
    insertVendorUseCase({ id: null, info: args.input, source: null }),
  updateVendor: async (obj, args) =>
    updateVendorUseCase({ id: args.input.id, info: args.input, source: null }),
  deleteVendor: async (obj, args) =>
    deleteOneVendorUseCase({ id: args.id, info: null, source: null }),
};

export default {
  Query,
  Mutation,
};
