{
  description = "Tine The Introspector is not Eliza TypeScript Project Flake";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShell = pkgs.mkShell {
          # Shell environment setup for development
          buildInputs = [
            pkgs.nodejs-23_x
	          pkgs.nodePackages.pnpm
            pkgs.nodePackages.typescript
          ];

          # Optional: Set some environment variables if needed
          shellHook = ''
            PS1="[tine-node-nix]: "

            echo "Welcome to the Node.js TypeScript development shell!"
          '';
        };

        # Build process: You can customize this if you have specific build steps
        packages.default = pkgs.stdenv.mkDerivation {
          pname = "tine";
          version = "1.0.0";

          # Use the project directory (might be good to limit this to just source at some point)
          src = ./.;

          # Build dependencies for building the production package
          buildInputs = [
            pkgs.nodejs
            pkgs.nodePackages.typescript
            pkgs.cacert
          ];

          # NPM install and TypeScript compile
          buildPhase = ''
            # Need for NPM to work
            mkdir -p tmp-npm
            HOME=tmp-npm

            pnpm install
            pnpm run build
          '';

          # Out the things we need to the output
          installPhase = ''
            mkdir -p            $out/lib/
            cp -r out           $out/lib/
            cp    package.json  $out/lib/
            cp -r node_modules  $out/lib/
          '';

          # Set metadata
          meta = with pkgs.lib; {
            description = "A Node.js TypeScript project built with Nix";
            license = licenses.mit;
            platforms = platforms.all;
          };

          # Fixed output derivation. Means we can do impure things like access the internet (for NPM to work) as long as we lock down the output hash
          outputHashAlgo = "sha256";
          outputHashMode = "recursive";
	  #          outputHash = "sha256-Zah7U1zkOQdeIduKrWN3/Yryxa4wS+MK20FQIgUvjSA=";
        };
      });
}
