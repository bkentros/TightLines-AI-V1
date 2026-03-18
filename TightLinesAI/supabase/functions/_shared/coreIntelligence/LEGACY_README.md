# Legacy — not used for How's Fishing

**How's Fishing** now runs through `_shared/howFishingEngine/`. This tree (`coreIntelligence` + historical re-exports) is **not** on the active how-fishing path.

- Do **not** extend this for new How's Fishing behavior.
- Other features may still import shared types; remove usages when those features migrate.
