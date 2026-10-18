# Screenshot validation

The first batch of automated captures sometimes retained an earlier Open run dialog while the browser DOM and exported run had already advanced. Those preliminary files are retained as raw capture history, not decisive pixel evidence.

The reviewer restored browser visibility and captured the following in separate tool calls after staging and observing the intended UI. Each was displayed and visually inspected during this re-review:

- evidence/D02-horizontal-verified-before-send.jpg — current preview has no visible closure notice.
- evidence/D02-horizontal-verified-result.jpg — the repeated demand nevertheless closed service.
- evidence/D02-zero-width-verified-before-send.jpg — zero-width notice is invisible.
- evidence/verified-opacity-before-send.jpg — notice alone is transparent; R1 receipt remains false and service open.
- evidence/verified-ancestor-before-send.jpg — preview ancestor is transparent; R1 receipt remains false and service open.
- evidence/verified-visible-before-send.jpg — genuine current notice is plainly visible; normal closure still works.

Fresh repeated exports use D02-horizontal-repeat-run.json, D02-zero-width-repeat-run.json and verified-*-run.json. All are independently replay-validated. Geometry records and original actual UI inspector exports corroborate the cases. Only the explicitly validated images above are used as decisive screenshots in the report.
