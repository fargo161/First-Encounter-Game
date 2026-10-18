# Owner clarification during the R3 review

The user directed this review to distinguish browser-reproducible defects from failures requiring manually fabricated, internally contradictory browser geometry. A synthetic width of 1,000 in a 920-wide viewport with simultaneously contained edge coordinates is not a blocker by itself.

The user required either native browser/normal-application reproduction or a realistic production browser/API path before classifying that case as blocking. Otherwise it is a non-blocking hardening limitation, with the failing test preserved unchanged. The user expressly directed continued realistic display-boundary and wider M3 regression review, and a READY FOR NEXT SCOPE verdict if no browser-reproducible or realistically reachable blocker remains. Scope still ends at M3.

This direct user instruction governs classification of IR3-25. Its assertion, failing result and complete reproducer are retained. It was not removed, skipped or weakened. No production source was changed.
