import LiveChecker from "./liveChecker";
import ReadyChecker from "./readyChecker";
import MetaGetter from "./metaGetter";
import OpenidConfigurationGetter from "./openidConfigurationGetter";

const misc = (client) => {
  return {
    liveChecker: () => new LiveChecker(client),
    readyChecker: () => new ReadyChecker(client),
    metaGetter: () => new MetaGetter(client),
    openidConfigurationGetter: () => new OpenidConfigurationGetter(client),
  };
};

export default misc;
