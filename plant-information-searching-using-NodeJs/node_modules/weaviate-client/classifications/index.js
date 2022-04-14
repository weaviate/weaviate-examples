import Scheduler from "./scheduler";
import Getter from "./getter";

const data = (client) => {
  return {
    scheduler: () => new Scheduler(client),
    getter: () => new Getter(client),
  };
};

export default data;
