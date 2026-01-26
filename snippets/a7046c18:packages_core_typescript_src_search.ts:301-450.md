# a7046c18:packages_core_typescript_src_search.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        w[3] === 105 && // i
        w[4] === 110 && // n
        w[5] === 103) || // g (inning)
        (w[0] === 111 && // o
          w[1] === 117 && // u
          w[2] === 116 && // t
          w[3] === 105 && // i
          w[4] === 110 && // n
          w[5] === 103) || // g (outing)
        (w[0] === 101 && // e
          w[1] === 120 && // x
          w[2] === 99 && // c
          w[3] === 101 && // e
          w[4] === 101 && // e
          w[5] === 100))) || // d (exceed)
    (l === 7 &&
      ((w[0] === 99 && // c
        w[1] === 97 && // a
        w[2] === 110 && // n
        w[3] === 110 && // n
        w[4] === 105 && // i
        w[5] === 110 && // n
        w[6] === 103) || // g (canning)
        (w[0] === 104 && // h
          w[1] === 101 && // e
          w[2] === 114 && // r
          w[3] === 114 && // r
          w[4] === 105 && // i
          w[5] === 110 && // n
          w[6] === 103) || // g (herring)
        (w[0] === 101 && // e
          w[1] === 97 && // a
          w[2] === 114 && // r
          w[3] === 114 && // r
          w[4] === 105 && // i
          w[5] === 110 && // n
          w[6] === 103) || // g (earring)
        (w[0] === 112 && // p
          w[1] === 114 && // r
          w[2] === 111 && // o
          w[3] === 99 && // c
          w[4] === 101 && // e
          w[5] === 101 && // e
          w[6] === 100) || // d (proceed)
        (w[0] === 115 && // s
          w[1] === 117 && // u
          w[2] === 99 && // c
          w[3] === 99 && // c
          w[4] === 101 && // e
          w[5] === 101 && // e
          w[6] === 100))) // d (succeed)
  ) {
    let exp2Out = "";
    for (let i = 0; i < l; ++i) exp2Out += String.fromCharCode(w[i]);
    return exp2Out;
  }
  // Step_1b
  let ll =
    // l (length) without the -ly ending
    l >= 2 && w[l - 1] === 121 && w[l - 2] === 108 ? l - 2 : l;
  if (ll >= 3) {
    if (w[ll - 3] === 101 && w[ll - 2] === 101 && w[ll - 1] === 100) {
      // eed
      if (ll >= r1 + 3) l = ll - 1; // eed eedly -> ee (if in R1)
    } else {
      // ll without: ed edly ing ingly (-1 if not found)
      if (w[ll - 2] === 101 && w[ll - 1] === 100)
        ll -= 2; // ed
      else if (w[ll - 3] === 105 && w[ll - 2] === 110 && w[ll - 1] === 103)
        ll -= 3; // ing
      else ll = -1;
      if (ll >= 0 && rv <= ll) {
        l = ll;
        if (l >= 2) {
          if (
            (w[l - 1] === 116 && w[l - 2] === 97) || // at
            (w[l - 1] === 108 && w[l - 2] === 98) || // bl
            (w[l - 1] === 122 && w[l - 2] === 105) // iz
          ) {
            // at -> ate   bl -> ble   iz -> ize
            w[l] = 101;
            ++l;
          } else if (w[l - 2] === w[l - 1] && isDouble(w[l - 1])) {
            --l;
          } else if (r1 >= l && isShortV(w, l)) {
            // <shortv> -> e
            w[l] = 101;
            ++l;
          }
        }
      }
    }
  }
  // Step_1c
  if (l >= 3 && (w[l - 1] === 89 || w[l - 1] === 121) && !isV(w[l - 2]))
    w[l - 1] = 105; // i
  // Step_2
  if (l >= r1 + 2) {
    switch (w[l - 1]) {
      case 108: // l
        if (
          l >= r1 + 6 &&
          w[l - 2] === 97 && // a
          w[l - 3] === 110 && // n
          w[l - 4] === 111 && // o
          w[l - 5] === 105 && // i
          w[l - 6] === 116 // t (tional)
        ) {
          if (l >= 7 && w[l - 7] === 97) {
            // a (ational)
            if (l >= r1 + 7) {
              // ational -> ate
              l -= 4;
              w[l - 1] = 101; // e
            }
          } else {
            l -= 2; // tional -> tion
          }
        }
        break;
      case 110: // n
        if (
          l >= r1 + 5 &&
          w[l - 2] === 111 && // o
          w[l - 3] === 105 && // i
          w[l - 4] === 116 && // t
          w[l - 5] === 97 // a (ation)
        ) {
          if (l >= 7 && w[l - 6] === 122 && w[l - 7] === 105) {
            // iz (ization)
            if (l >= r1 + 7) {
              // ization -> ize
              l -= 4;
              w[l - 1] = 101; // e
            }
          } else {
            // ation -> ate
            l -= 2;
            w[l - 1] = 101; // e
          }
        }
        break;
      case 114: // r
        if (l >= r1 + 4) {
          if (w[l - 2] === 101) {
            // e (er)
            if (w[l - 3] === 122 && w[l - 4] === 105) --l; // izer -> ize
          } else if (w[l - 2] === 111) {
            // o (or)
            if (w[l - 3] === 116 && w[l - 4] === 97) {
```