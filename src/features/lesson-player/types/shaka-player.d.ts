// Minimal type declarations for shaka-player used in this project.
// The full shaka namespace is declared globally in shaka-player.ui.d.ts,
// but since it is not included in tsconfig types, we define only what we need.

declare namespace ShakaPlayer {
  interface Request {
    headers: Record<string, string>;
  }

  enum RequestType {
    LICENSE = 2,
  }

  type RequestFilter = (type: RequestType, request: Request) => void;

  interface NetworkingEngine {
    registerRequestFilter(filter: RequestFilter): void;
  }

  interface PlayerConfig {
    drm?: {
      servers?: Record<string, string>;
    };
  }

  interface Player {
    getNetworkingEngine(): NetworkingEngine | null;
    configure(config: PlayerConfig): void;
    load(assetUri: string): Promise<void>;
    destroy(): Promise<void>;
  }

  interface PlayerConstructor {
    new (element: HTMLVideoElement): Player;
    isBrowserSupported(): boolean;
  }

  interface Polyfill {
    installAll(): void;
  }

  interface ShakaModule {
    Player: PlayerConstructor;
    polyfill: Polyfill;
    net: {
      NetworkingEngine: {
        RequestType: typeof RequestType;
      };
    };
  }
}
