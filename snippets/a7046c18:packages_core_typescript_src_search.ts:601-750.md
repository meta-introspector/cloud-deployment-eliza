# a7046c18:packages_core_typescript_src_search.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                l -= 4;
                w[l - 1] = 101; // e
              }
            } else {
              l -= 2; // tional -> tion
            }
          }
        }
        break;
      case 101: // e
        if (w[l - 2] === 122) {
          // ze
          if (
            l >= r1 + 5 &&
            w[l - 3] === 105 &&
            w[l - 4] === 108 &&
            w[l - 5] === 97
          )
            l -= 3; // alize -> al
        } else if (w[l - 2] === 116) {
          // te
          if (
            l >= r1 + 5 &&
            w[l - 3] === 97 &&
            w[l - 4] === 99 &&
            w[l - 5] === 105
          )
            l -= 3; // icate -> ic
        } else if (w[l - 2] === 118) {
          // ve
          if (
            l >= r2 + 5 &&
            w[l - 3] === 105 &&
            w[l - 4] === 116 &&
            w[l - 5] === 97
          )
            l -= 5; // ative -> <delete> (if in R2)
        }
        break;
      case 105: // i
        if (
          l >= r1 + 5 &&
          w[l - 2] === 116 && // t
          w[l - 3] === 105 && // i
          w[l - 4] === 99 && // c
          w[l - 5] === 105 // i (iciti)
        )
          l -= 3; // iciti -> ic
        break;
      case 115: // s
        if (
          l >= r1 + 4 &&
          w[l - 2] === 115 &&
          w[l - 3] === 101 &&
          w[l - 4] === 110
        )
          l -= 4; // ness -> <delete>
    }
  }
  // Step_4
  if (l >= r2 + 2) {
    switch (w[l - 1]) {
      case 110: // n
        if (
          l >= r2 + 3 &&
          w[l - 2] === 111 && // o
          w[l - 3] === 105 && // i (ion)
          (w[l - 4] === 115 || w[l - 4] === 116) // s or t
        )
          l -= 3; // ion -> <delete> (if preceded by s or t)
        break;
      case 108: // l
        if (w[l - 2] === 97) l -= 2; // al
        break;
      case 114: // r
        if (w[l - 2] === 101) l -= 2; // er
        break;
      case 99: // c
        if (w[l - 2] === 105) l -= 2; // ic
        break;
      case 109: // m
        if (l >= r2 + 3 && w[l - 2] === 115 && w[l - 3] === 105) l -= 3; // ism
        break;
      case 105: // i
        if (l >= r2 + 3 && w[l - 2] === 116 && w[l - 3] === 105) l -= 3; // iti
        break;
      case 115: // s
        if (l >= r2 + 3 && w[l - 2] === 117 && w[l - 3] === 111) l -= 3; // ous
        break;
      case 116: // t
        if (l >= r2 + 3 && w[l - 2] === 110) {
          // nt
          if (w[l - 3] === 97) {
            // ant
            l -= 3; // ant
          } else if (w[l - 3] === 101) {
            // ent
            if (l >= 4 && w[l - 4] === 109) {
              // ment
              if (l >= 5 && w[l - 5] === 101) {
                // ement
                if (l >= r2 + 5) l -= 5; // ement
              } else if (l >= r2 + 4) {
                l -= 4; // ment
              }
            } else {
              l -= 3; // ent
            }
          }
        }
        break;
      case 101: // e
        if (w[l - 2] === 99) {
          // ce
          if (
            l >= r2 + 4 &&
            w[l - 3] === 110 &&
            (w[l - 4] === 97 || w[l - 4] === 101)
          )
            l -= 4; // ance  ence
        } else if (w[l - 2] === 108) {
          // le
          if (
            l >= r2 + 4 &&
            w[l - 3] === 98 &&
            (w[l - 4] === 97 || w[l - 4] === 105)
          )
            l -= 4; // able  ible
        } else if (w[l - 2] === 116) {
          // te
          if (l >= r2 + 3 && w[l - 3] === 97) l -= 3; // ate
        } else if (
          l >= r2 + 3 &&
          (w[l - 2] === 118 || w[l - 2] === 122) &&
          w[l - 3] === 105
        ) {
          // ive ize
          l -= 3; // ive  ize
        }
    }
  }
  // Step_5
  if (
    l >= r1 + 1 && // r1 is >= 1
    ((l >= r2 + 1 && w[l - 1] === 108 && w[l - 2] === 108) || // ll
      (w[l - 1] === 101 && (l >= r2 + 1 || !isShortV(w, l - 1)))) // e
  )
    --l;
  let out = "";
  if (yFound) {
```