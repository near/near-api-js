---
"near-api-js": patch
---

Correctly expose the new `Actions` interface, which simplify creating actions, and hide the old `Action` class, which needs a lot of manual work and is incredibly confusing. Importantly, `Action` (and its different instances) are still being exported as a type, to devs can figure out how to distinguis between different `Action`s.
