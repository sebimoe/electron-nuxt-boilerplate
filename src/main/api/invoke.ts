import { MainElectronInvokeApiHandlers } from "../../shared/api";

export const mainInvokeApi : MainElectronInvokeApiHandlers = {
  invokeSomethingInMain: async (ev, a) => `Hello from main, got ${a} from frame ${ev.senderFrame?.url}!`
}
