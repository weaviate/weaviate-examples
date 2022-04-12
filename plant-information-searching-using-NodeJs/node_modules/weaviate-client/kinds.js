export const validateKind = (kind) => {
  if (kind != KIND_THINGS && kind != KIND_ACTIONS) {
    throw new Error("invalid kind: " + kind);
  }
};

export const KIND_THINGS = "things";
export const KIND_ACTIONS = "actions";
export const DEFAULT_KIND = KIND_THINGS;

export default {
  KIND_THINGS,
  KIND_ACTIONS,
  DEFAULT_KIND,
  validateKind: validateKind,
};
