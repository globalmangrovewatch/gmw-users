# Test fixtures

| File                 | Used by                                               | Contents                                                                                                                           |
| -------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `site-area.kml`      | `unit/library/transformer`                            | One placemark, "Test site", with a square polygon from (100, 1) to (101, 2).                                                       |
| `site-area.zip`      | `unit/library/transformer`                            | Zipped shapefile (`.shp`, `.shx`, `.dbf`, `.prj`) with the same square polygon, a `name` attribute of "Test site", and WGS84.      |
| `sectionAnswers.ts`  | `unit/library/mapDataForApi`, `unit/forms/validation` | One valid answer payload per form section, keyed like `questionMapping`, using the values the forms hold in memory.                |
| `validationCases.ts` | `unit/forms/validation`                               | Table of payloads and the errors the form schema reports for them. Written so the same table can run against a replacement schema. |

The shapefile was written by hand in the ESRI Shapefile binary format, so it holds exactly one polygon and no generator dependency is needed. To inspect it, unzip it and open `site-area.shp` in QGIS, or parse it with `shpjs`.
