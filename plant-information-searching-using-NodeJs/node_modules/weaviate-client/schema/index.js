import ClassCreator from "./classCreator";
import ClassDeleter from "./classDeleter";
import PropertyCreator from "./propertyCreator";
import Getter from "./getter";

const schema = (client) => {
  return {
    classCreator: () => new ClassCreator(client),
    classDeleter: () => new ClassDeleter(client),
    getter: () => new Getter(client),
    propertyCreator: () => new PropertyCreator(client),
  };
};

export default schema;
