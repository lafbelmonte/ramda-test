import { UseCase, VendorStore } from '../../types';

const deleteOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorStore;
}): UseCase => {
  return async function useCase({ id }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    await vendorsStore.deleteOneVendor({ _id: id });

    return {
      message: `Vendor with ID: ${id} is deleted`,
      data: id,
    };
  };
};

export default deleteOneVendor;
