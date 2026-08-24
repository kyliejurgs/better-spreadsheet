# Development Seed Data

This directory contains development-only seed data for Better Spreadsheet.

Seed data represents application-domain data independently of the frontend and backend implementations. Application code should not depend directly on these files. Frontend and backend development tooling may load this data through the same application and persistence boundaries used by normal application data.

## Goals

- Provide realistic, deterministic data for development and testing.
- Keep development data separate from production application code.
- Allow seed data to be replaced by persisted or synchronized data without changing UI behavior.
- Keep the dataset usable by both frontend and backend development tooling.

## Structure

- `data/` contains technology-neutral seed datasets.

The seed format and individual datasets will be added as the corresponding domain models and loading boundaries are defined.
