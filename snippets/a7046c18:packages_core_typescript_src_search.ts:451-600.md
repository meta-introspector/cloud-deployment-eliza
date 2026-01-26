# a7046c18:packages_core_typescript_src_search.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
              // ator
              --l;
              w[l - 1] = 101; // e
            }
          }
        }
        break;
      case 115: // s
        if (
          l >= r1 + 7 &&
          w[l - 2] === 115 && // s
          w[l - 3] === 101 && // e
          w[l - 4] === 110 && // n (ness)
          ((w[l - 5] === 108 && w[l - 6] === 117 && w[l - 7] === 102) || // fulness
            (w[l - 5] === 115 && w[l - 6] === 117 && w[l - 7] === 111) || // ousness
            (w[l - 5] === 101 && w[l - 6] === 118 && w[l - 7] === 105)) // iveness
        ) {
          l -= 4; // fulness -> ful   ousness -> ous   iveness -> ive
        }
        break;
      case 109: // m
        if (
          l >= r1 + 5 &&
          w[l - 2] === 115 && // s
          w[l - 3] === 105 && // i
          w[l - 4] === 108 && // l
          w[l - 5] === 97 // a (alism)
        )
          l -= 3; // alism -> al
        break;
      case 105: // i
        if (w[l - 2] === 99) {
          // c (ic)
          if (
            l >= r1 + 4 &&
            (w[l - 4] === 101 || w[l - 4] === 97) &&
            w[l - 3] === 110
          ) {
            // enci anci
            w[l - 1] = 101; // enci -> ence   anci -> ance
          }
        } else if (w[l - 2] === 103) {
          // g (gi)
          if (
            l >= r1 + 3 &&
            l >= 4 &&
            w[l - 2] === 103 &&
            w[l - 3] === 111 &&
            w[l - 4] === 108
          )
            // logi
            --l; // ogi -> og (if preceded by l)
        } else if (w[l - 2] === 116) {
          // t (ti)
          if (l >= r1 + 5 && w[l - 3] === 105) {
            // iti
            if (w[l - 4] === 108) {
              // liti
              if (l >= 6 && w[l - 5] === 105 && w[l - 6] === 98) {
                // biliti
                if (l >= r1 + 6) {
                  // biliti -> ble
                  l -= 3;
                  w[l - 2] = 108; // l
                  w[l - 1] = 101; // e
                }
              } else if (w[l - 4] === 108 && w[l - 5] === 97) {
                // aliti
                l -= 3; // aliti -> al
              }
            } else if (w[l - 4] === 118 && w[l - 5] === 105) {
              // iviti
              // iviti -> ive
              l -= 2;
              w[l - 1] = 101; // e
            }
          }
        } else if (w[l - 2] === 108 && l >= 3) {
          // l (li)
          if (w[l - 3] === 98) {
            // bli
            if (l >= 4 && w[l - 4] === 97) {
              // abli
              if (l >= r1 + 4) w[l - 1] = 101; // abli -> able
            } else if (l >= r1 + 3) {
              w[l - 1] = 101; // bli -> ble
            }
          } else {
            // Remove li
            if (w[l - 3] === 108) {
              // lli
              if (l >= 5 && w[l - 4] === 117 && w[l - 5] === 102) {
                // fulli
                if (l >= r1 + 5) l -= 2; // fulli -> ful
              } else if (l >= r1 + 4 && w[l - 4] === 97) {
                // alli
                l -= 2; // alli -> al
              }
            } else if (w[l - 3] === 115) {
              // sli
              if (
                l >= 6 &&
                w[l - 4] === 115 &&
                w[l - 5] === 101 &&
                w[l - 6] === 108
              ) {
                // lessli
                if (l >= r1 + 6) l -= 2; // lessli -> less
              } else if (l >= r1 + 5 && w[l - 4] === 117 && w[l - 5] === 111) {
                // ousli
                l -= 2; // ousli -> ous
              }
            } else if (
              l >= 5 &&
              w[l - 3] === 116 &&
              w[l - 4] === 110 &&
              w[l - 5] === 101
            ) {
              // entli
              if (l >= r1 + 5) l -= 2; // entli -> ent
            } else if (isValidLi(w[l - 3])) {
              l -= 2;
            }
          }
        }
    }
  }
  // Step_3
  if (l >= r1 + 3) {
    switch (w[l - 1]) {
      case 108: // l
        if (w[l - 3] === 99) {
          // cal
          if (l >= r1 + 4 && w[l - 4] === 105 && w[l - 2] === 97) l -= 2; // ical -> ic
        } else if (w[l - 3] === 102) {
          // ful
          if (w[l - 2] === 117) l -= 3; // ful -> <delete>
        } else if (w[l - 3] === 110) {
          // nal
          if (
            l >= r1 + 6 &&
            w[l - 2] === 97 && // a
            w[l - 4] === 111 && // o
            w[l - 5] === 105 && // i
            w[l - 6] === 116 // t (tional)
          ) {
            if (l >= 7 && w[l - 7] === 97) {
              // ational
              if (l >= r1 + 7) {
                // ational -> ate
```