"use client";

/**
 * Sanity Studio, embedded at /cms. Copper theme, grouped sidebar, a site
 * settings singleton that cannot be duplicated or deleted.
 */
import { buildLegacyTheme, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes, singletonTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { StudioIcon } from "./sanity/StudioIcon";

const theme = buildLegacyTheme({
  "--black": "#161824",
  "--white": "#ffffff",
  "--gray": "#6b7280",
  "--gray-base": "#6b7280",
  "--component-bg": "#ffffff",
  "--component-text-color": "#161824",
  "--brand-primary": "#bb6e3d",
  "--default-button-color": "#6b7280",
  "--default-button-primary-color": "#bb6e3d",
  "--default-button-success-color": "#2e7d32",
  "--default-button-warning-color": "#c58a1b",
  "--default-button-danger-color": "#c0392b",
  "--state-info-color": "#bb6e3d",
  "--state-success-color": "#2e7d32",
  "--state-warning-color": "#c58a1b",
  "--state-danger-color": "#c0392b",
  "--main-navigation-color": "#0b1421",
  "--main-navigation-color--inverted": "#ffffff",
  "--focus-color": "#bb6e3d",
});

export default defineConfig({
  name: "capital-investment-llc",
  title: "Capital Investment LLC",
  basePath: "/cms",
  projectId,
  dataset,
  icon: StudioIcon,
  theme,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType) ? input.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action)) : input,
  },
});
