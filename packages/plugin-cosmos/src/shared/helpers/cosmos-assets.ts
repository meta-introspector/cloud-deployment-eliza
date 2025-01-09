import type { AssetList } from "@chain-registry/types";

export const getAvailableAssets = (
  _assets: AssetList[],
  _customAssets: AssetList[]
) => [
  //  7:8  error  Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError  no-unsafe-optional-chaining

    // ...assets?.filter(
    //     (asset) =>
    //         !(customAssets ?? [])
    //             ?.map((customAsset) => customAsset.chain_name)
    //             ?.includes(asset.chain_name)
    // ),
    // ...(customAssets ?? []),
];
