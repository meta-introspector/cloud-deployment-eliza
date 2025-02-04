# {
#   inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
#   inputs.flake-utils.url = "github:numtide/flake-utils";
#   outputs = { self, nixpkgs, flake-utils }:
#     flake-utils.lib.eachDefaultSystem (system:
#       let
#         pkgs = nixpkgs.legacyPackages.${system};
#         inherit (import ./default.nix { inherit pkgs; })     sources package shell nodeDependencies;
#       in {
#         nodeDependencies = nodeDependencies;
#         inherit overlays;
#       });
# }
{
  inputs = {
    # nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };
  outputs =
    { systems, nixpkgs, ... }@inputs:
    let
      eachSystem = f: nixpkgs.lib.genAttrs (import systems) (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs
            # You can set the major version of Node.js to a specific one instead
            # of the default version
            # pkgs.nodejs-22_x
            # Comment out one of these to use an alternative package manager.
            # pkgs.yarn
            # pkgs.pnpm
            # pkgs.bun
            #pkgs.nodePackages.typescript
            #pkgs.nodePackages.typescript-language-server
          ];
        };
      });
    };
}
