## Start with a spatial question

A geographic information system organizes information by location. In this project, that can mean a mapped feature, a dated photograph, an observation tied to coordinates or a model drawn over an area. Geospatial analysis asks how those things relate across space and time. Geospatial intelligence adds interpretation for a particular question; an attractive map alone does not supply the evidence for that interpretation.

Start with a bounded question: which registered products cover an area, what dates two images represent, or whether an observation lies near a mapped feature. Define the place, time window and acceptable uncertainty before choosing layers. GEV's [source inventory](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/DATA_SOURCES.md) identifies the kinds of inputs available in the reviewed application.

## Separate observations from interpretation

An observation reports something a source measured or received. A model estimates a quantity using assumptions and inputs. An inference connects evidence to an explanation. Keep those steps visible.

For example, a dated satellite image can show a difference between two views, but cloud, season, sensor characteristics or capture geometry can affect that comparison. A propagated satellite position is calculated from orbital inputs, not a direct measurement of its location at every display frame. A GNSS integrity anomaly can motivate further investigation without proving its cause.

Use the per-value **Live**, **Refreshed**, **Simulated**, **Estimated** or **Static** label, then ask about source, timestamp, coverage and independent health. Several colored layers agreeing visually are not necessarily independent evidence if they depend on the same upstream input.

## Match scale, time and coverage

A camera's field of view, an air-quality station and a satellite product describe different spatial footprints. A point symbol can hide uncertainty or represent a station whose measurement applies to a wider area. Zooming in changes the display scale; it does not create finer source resolution.

Compare compatible dates and products. Recent Imagery's HLS and VIIRS options have different resolution and coverage behavior, and the existing workflow limits areas and dates. Read the [reviewed Recent Imagery description](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/docs/CURRENT-STATE.md#recent-imagery-september-2026) before interpreting a change. Retain gaps instead of filling them with an assumed zero or a decorative animation.

## Keep a short evidence trail

Record the question, source product, capture or observation date, area, relevant limitations and the reasoning connecting evidence to a claim. Distinguish a documentation review date from an observation time. When using a reconstructed event, identify which parts are observed, estimated or presented only as a demonstration.

A globe share link can communicate supported view state. It is not an archive of the underlying live observations and does not establish a historical replay. Preserve citations and provider attribution when sharing an interpretation, and check reuse rights separately from the code license.

## Bound the use

This local project supports exploration and learning. Its [responsible-use expectations](https://github.com/bilawalsidhu/gods-eye-view/blob/064d51f7be2675f1c69e16068e9c49d1a60144d1/SECURITY.md#responsible-use) do not provide an operational-use guarantee. Do not use incomplete map coverage as a safety-critical assurance.

Keep analysis about events, assets and systems. The project's scope excludes named-person search, face recognition, plate recognition and tracking individuals. The ALPR layer maps tagged camera locations; it does not recognize plates or expose plate histories.
