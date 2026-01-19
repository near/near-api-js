---
"near-api-js": patch
---

Speed up some `Account` methods by merging sequential `Promises` into `Promise.all()` for slightly better performance
