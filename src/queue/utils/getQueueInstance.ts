import { BaseQueue } from "../AbstractBaseQueue";
import { EQUEUE_NAMES } from "../constants";

// memoization of queue instance to avoid excessive connections
const queueNameToInstance = {};

export function getQueueInstance(name: EQUEUE_NAMES): BaseQueue {
  // memoization
  if (!queueNameToInstance[name]) {
    queueNameToInstance[name] = new BaseQueue(name);
  }

  return queueNameToInstance[name];
}
