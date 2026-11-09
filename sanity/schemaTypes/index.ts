import { objectTypes } from "./objects";
import { documentTypes, singletonTypes } from "./documents";
import { guide, guideSource } from "./guide";

export const schemaTypes = [...objectTypes, guideSource, ...documentTypes, guide];
export { singletonTypes };
