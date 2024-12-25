import { MainElectronEventApiHandlers } from "../../shared/api";

export const mainEventApi : MainElectronEventApiHandlers = {
  doSomethingInMain: (ev, a) => console.log(`[doSomethingInMain] got ${a} (from frame ${ev.senderFrame?.url})`),
};
