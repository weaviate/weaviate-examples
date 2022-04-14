import ExtensionCreator from "./extensionCreator";
import ConceptsGetter from "./conceptsGetter";

const c11y = (client) => {
  return {
    conceptsGetter: () => new ConceptsGetter(client),
    extensionCreator: () => new ExtensionCreator(client),
  };
};

export default c11y;
