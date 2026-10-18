# V03.2 Gear/Accessory Catalog Repair

The 25 catalogs previously marked `visual_review_required` have been mechanically repaired from the existing authoring plates. Clothing, footwear, character pixels, and guide marks were removed from the gear/accessory inventories. Components that were genuinely rendered separately were recovered even when they fell outside the original coarse gear crop. Declared accessories that exist only on the dressed character are reported as `missing_source_isolation` rather than fabricated. No character or item art was regenerated. See `metadata/gear_accessory_catalog_repair_v03_2.json` and the QA sheets in `qa/`.

# V03.1 Despill Correction

The 44 rebuilt composites and 44 character-specific body-calibration PNGs have been corrected for the known #FF00FF matte. Alpha coverage, dimensions, alignment, identities, clothing, and silhouettes are unchanged. Transparent texture padding is included for bilinear filtering and mipmaps. See `qa/despill_metrics_v03_1.json` for the before/after measurements.

# V03.1 Despill Correction

The 44 rebuilt composites and 44 character-specific body-calibration PNGs have been corrected for the known #FF00FF matte. Alpha coverage, dimensions, alignment, identities, clothing, and silhouettes are unchanged. Transparent texture padding is included for bilinear filtering and mipmaps. See `qa/despill_metrics_v03_1.json` for the before/after measurements.

# V03.1 Despill Correction

The 44 rebuilt composites and 44 character-specific body-calibration PNGs have been corrected for the known #FF00FF matte. Alpha coverage, dimensions, alignment, identities, clothing, and silhouettes are unchanged. Transparent texture padding is included for bilinear filtering and mipmaps. See `qa/despill_metrics_v03_1.json` for the before/after measurements.

# Neutral Character Modular Rebuild V03

This package reconstructs all 44 neutral characters around eight canonical fit classes:
male/female × short/tall × slim/wide.

## Four-domain construction contract

1. Identity: head, face, permanent hair/facial hair, and identity skin assignment.
2. Body fit: one of eight canonical classes plus a character-specific calibration reference.
3. Clothing: tops, midlayers, outerwear, bottoms/dresses/skirts, and footwear.
4. Gear/accessories: eyewear, jewelry, watches, belts, scarves/ties, badges, protective/tactical equipment, pouches, radios, gloves, helmets, holsters, worn tools, and similar removable items.

Hands remain empty in the neutral state. Handheld items belong to the grip/hold system, not any composite.

## Production status

- `rebuilt_composites/`: 44 standardized 1024×1536 RGBA neutral references.
- `body_calibration/`: 44 standardized 1024×1536 RGBA proportion references.
- `fit_classes/`: eight recommended canonical body references.
- `kit_plates/`: complete authoring plates with identity, fit body, clothing, and gear/accessory regions.
- `clothing_catalogs/` and `gear_accessory_catalogs/`: authoring inventories.
- `source_masters/`: untouched V02 masters for fidelity comparison.

The category catalogs are deliberately not described as engine-ready overlays. Their next production pass must create aligned front/rear layers, occlusion masks, material masks, and per-fit anchors. Metadata flags visual accessory separations that still require cleanup.

## Reuse policy

Reuse logical garment families and compatible fit assets only after fit review. Preserve character-specific cut, wear, pattern, fabric, and styling by default.

Generated using the built-in identity-preserving ImageGen workflow. The exact prompt is in `docs/imagegen_prompt.txt`.
