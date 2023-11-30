import { A, EVENT_NAMES } from "./app";
import { EventEmitter } from "events";
import { Log } from "viem";

it("should watch an event", async () => {
  const a = new A();
  const emitter = new EventEmitter();
  const mock = ({ onLogs }: { onLogs: (a: Array<Log>) => void }) => {
    emitter.on("log", onLogs);
    return () => {
      emitter.removeAllListeners("log");
    };
  };

  jest.spyOn(a._publicClient, "watchContractEvent").mockImplementation(mock);
  const emitEvents = () => {
    emitter.emit("log", [{ transactionHash: "1" }]);
    emitter.emit("log", [{ transactionHash: "2" }]);
  };
  const event = await Promise.all([
    a.watchEvent("0x00", EVENT_NAMES.AAA, "2"),
    emitEvents(),
  ]);
  expect(event[0]).toStrictEqual({ transactionHash: "2" });
});
