import { Abi, Log, PublicClient } from "viem";

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const PNetworkHubAbi: Abi = [];

export enum EVENT_NAMES {
  AAA = "AAA",
}

export class A {
  _publicClient: PublicClient;
  constructor() {
    this._publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
  }

  public async watchEvent(
    _hubAddress: string,
    _eventName: EVENT_NAMES,
    _operationId: string,
    _pollingTime = 1000
  ): Promise<Log> {
    return await new Promise<Log>((resolve) => {
      const stopWatching = this._publicClient.watchContractEvent({
        address: _hubAddress as `0x${string}`,
        abi: PNetworkHubAbi,
        pollingInterval: _pollingTime,
        eventName: _eventName,
        onLogs: (logs) => {
          const targetLog = logs.find(
            (log: Log) => log.transactionHash === _operationId
          );
          if (targetLog) {
            resolve(targetLog);
            stopWatching();
          }
        },
        onError: (error) => console.error(error),
      });
    });
  }
}
