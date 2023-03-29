import type { IWeaviateClient } from "weaviate-ts-client";

export type FilterInput = {
  languageIdsSelected: number[];
  allLanguageIds: number[];
  availableLanguagesSelected: [number, number];
  searchType: string;
  popularitySelected: [number, number];
  popularityMinMax: [number, number];
};

export type Result = {
  text: string;
  title: string;
};

const searchWeaviate = (
  client: IWeaviateClient,
  query: string,
  filterInput: FilterInput
): Promise<Result[]> => {
  let filter = buildFilter(filterInput);
  let q = client.graphql
    .get()
    .withClassName("Articles")
    .withFields("title text")
    .withLimit(10);

  if (filter) {
    q = q.withWhere(filter);
  }

  switch (filterInput.searchType) {
    case "Lexical":
      q = q.withBm25({
        query: query,
      });
      break;
    case "Hybrid":
      q = q.withHybrid({
        query: query,
        alpha: 0.7,
      });
      break;
    case "Semantic":
      q = q.withNearText({
        concepts: [query],
      });
      break;
    default:
      throw new Error("unrecognized search type");
  }

  return q.do().then((res: any) => {
    if (res.errors) {
      throw new Error(res.errors);
    }

    return res.data.Get.Articles.map((obj: any) => {
      let out: Result = {
        text: typeof obj.text === "string" ? obj.text : "",
        title: typeof obj.text === "string" ? obj.title : "",
      };
      return out;
    });
  });
};

export default searchWeaviate;

const buildFilter = (input: FilterInput): object | undefined => {
  let operands: object[] = [];

  if (languagesRestricted(input)) {
    operands.push(buildLanguageFilter(input));
  }

  if (popularityRestricted(input)) {
    operands.push(buildPopularityFilter(input));
  }

  if (availableLanguagesRestricted(input)) {
    operands.push(buildAvailableLanguagesFilter(input));
  }

  if (operands.length === 0) {
    return undefined;
  }

  return wrapInAnd(operands);
};

const buildLanguageFilter = (input: FilterInput): object => {
  let ops: object[] = input.languageIdsSelected.map((id) => ({
    valueInt: id,
    operator: "Equal",
    path: ["lang_id"],
  }));

  return wrapInOr(ops);
};

const buildPopularityFilter = (input: FilterInput): object => {
  let ops: object[] = [];

  if (input.popularitySelected[0] !== input.popularityMinMax[0]) {
    ops.push({
      operator: "GreaterThanEqual",
      valueInt: input.popularitySelected[0],
      path: ["views"],
    });
  }

  if (input.popularitySelected[1] !== input.popularityMinMax[1]) {
    ops.push({
      operator: "LessThanEqual",
      valueInt: input.popularitySelected[1],
      path: ["views"],
    });
  }

  return wrapInAnd(ops);
};

const buildAvailableLanguagesFilter = (input: FilterInput): object => {
  let ops: object[] = [];

  if (input.availableLanguagesSelected[0] !== -1) {
    ops.push({
      operator: "GreaterThanEqual",
      valueNumber: input.availableLanguagesSelected[0],
      path: ["num_langs"],
    });
  }

  if (input.availableLanguagesSelected[1] !== -1) {
    ops.push({
      operator: "LessThanEqual",
      valueNumber: input.availableLanguagesSelected[1],
      path: ["num_langs"],
    });
  }

  return wrapInAnd(ops);
};

const wrapIn = (operands: object[], op: string): object => {
  if (operands.length === 1) {
    return operands[0];
  }

  return {
    operator: op,
    operands: operands,
  };
};

const wrapInAnd = (operands: object[]): object => wrapIn(operands, "And");

const wrapInOr = (operands: object[]): object => wrapIn(operands, "Or");

const languagesRestricted = (input: FilterInput): boolean =>
  input.languageIdsSelected.length !== input.allLanguageIds.length;

const popularityRestricted = (input: FilterInput): boolean =>
  input.popularitySelected[0] !== input.popularityMinMax[0] ||
  input.popularitySelected[1] !== input.popularityMinMax[1];

const availableLanguagesRestricted = (input: FilterInput): boolean =>
  input.availableLanguagesSelected[0] !== -1 ||
  input.availableLanguagesSelected[1] !== -1;
