{
  description = "フルスタ打 development shell";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = nixpkgs.lib.genAttrs systems;
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.just
              pkgs.git
              pkgs.curl
              pkgs.cacert
            ];
            shellHook = ''
              for dir in "$HOME/.vite-plus/bin" "$HOME/.local/share/vite-plus/bin"; do
                if [ -d "$dir" ]; then
                  export PATH="$dir:$PATH"
                fi
              done
              if command -v vp >/dev/null 2>&1; then
                eval "$(vp env print 2>/dev/null)" || true
              else
                echo "vp がありません。次を実行してください: curl -fsSL https://vite.plus | bash"
              fi
            '';
          };
        }
      );
    };
}
