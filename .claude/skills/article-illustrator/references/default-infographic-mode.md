# Default Infographic Mode

## Goal

Define the default **body-illustration** contract for `article-illustrator`.

This file exists to make one thing explicit:

`article-illustrator` body images should now default to **business hand-drawn high-information-density infographics**, not atmosphere-first article decoration.

## Applies To

- Body illustrations inserted into article content
- Default behavior when user does **not** explicitly pass `--style`
- Articles that are knowledge-heavy, methodology-heavy, business-analysis-heavy, or framework-heavy

## Does Not Apply To

- WeChat cover images
- Explicit user style overrides such as `--style warm`, `--style watercolor`, `--style minimal`
- Cases where the user clearly wants mood art, scene art, or low-density decorative visuals

## Default Visual Contract

Body images should preferentially become:

- structure diagrams
- comparison diagrams
- decision diagrams
- process diagrams
- module maps
- compact conceptual infographics

And they should visually feel like:

- business whiteboard diagrams drawn by hand
- hand-organized rather than software-typeset
- energetic and technical, not sterile and corporate-template-like

The default image should help the reader answer:

`这一段到底在讲什么判断？`

Not just:

`这一段大概是什么氛围？`

## Density Rules

- Information density: medium to high
- Hierarchy must remain clear
- The image should still be skimmable on first glance
- The image should still have screenshot value
- Prefer one image = one clear judgment, not one image = one whole chapter
- Hand-drawn feeling is mandatory, not optional
- Chinese typography should look handwritten, not printed
- Slight wobble, stroke variation, and lightly imperfect geometry are desirable if readability remains intact

## Placement Density Contract

- Default body-image placement target: roughly **1 body illustration per 400 characters**
- Use article length and judgment density together; do **not** rely on heading count alone
- If a long-form article has few headings but many dense judgments, still place enough images to maintain reading rhythm
- Prefer more judgment-specific images over too few overloaded images
- The goal is not decoration frequency; the goal is to keep each image tightly mapped to one meaningful judgment while maintaining article pacing

## Recommended Structures

Prefer these layouts by default:

- two-column comparison
- before / after contrast
- flow or pipeline
- decision tree
- funnel
- module aggregation
- layered framework
- timeline with explicit judgment

## Anti-Patterns

Avoid these as the default body-image output:

- empty mood art
- pure decorative metaphor art
- large whitespace with too little information
- vague conceptual images with no clear takeaway
- images that look elegant but do not help the reader understand the argument faster
- images that look like sterile corporate charts or clean slide templates
- typography that feels typeset instead of hand-written

## Writing Prompt Guidance

When writing prompts for default body illustrations, include language equivalent to:

- high-information-density infographic
- commercial hand-drawn infographic
- visible sketch lines
- marker-like outlines
- handwritten Chinese labels
- logic clear
- skimmable
- screenshot-friendly
- clear hierarchy
- avoid hollow atmosphere art

## Handwritten Typography Reminder

Chinese text should feel like it was written directly onto the diagram by a person using a whiteboard marker or felt-tip pen.

Do not optimize for typographic neatness.
Optimize for readable hand-written energy.

## Pass / Fail Boundary

### Pass

The default body-image output passes only when all of the following are true:

- a reader can tell at first glance that this is a hand-drawn knowledge diagram
- a reader can tell at first glance what judgment, comparison, structure, or process the image is explaining
- the image is still skimmable and screenshot-worthy
- handwritten Chinese feels natural rather than typeset

### Fail

Treat the output as failed default execution if any of the following happens:

- the judgment is clear, but the image still reads like a clean corporate infographic first
- the hand-drawn feeling exists only as subtle texture or minor wobble on top of a software-typeset layout
- the image looks like a polished slide-template diagram
- the image is elegant but does not feel visibly human-drawn
- typography feels printed, poster-like, or template-based instead of handwritten

The default body-image mode is not satisfied by “high density only”.
It is also not satisfied by “hand-drawn only”.
The pass condition is the combination of both.

## Boundary With Cover

Cover image is the exception.

Cover should:

- stay lower density
- keep more whitespace
- keep one dominant visual focus
- reserve headline overlay area

Do not reuse body-density assumptions when composing the WeChat cover.

## Related Reference

See also: `references/business-handdrawn-mode.md`
