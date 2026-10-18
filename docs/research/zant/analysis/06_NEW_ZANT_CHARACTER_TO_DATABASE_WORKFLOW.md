# New ZANT character to database workflow

A new ZANT person should be designed as a specific adult, then translated into a bounded set of aligned assets. Reuse is a production decision after the person has a coherent visual identity. The library must accommodate their irregularity rather than letting available presets choose the person.

This is a proposed future authoring workflow. No new final art, asset conversion, runtime tool or database ingestion was performed in this analysis. ZANT supplies art direction and creation lineage only; Encounter and Room Creator remain read-only project context.

## 1. Approve the person before choosing reusable parts

Start with a concise visual brief: literal build and proportions, apparent life stage as an authored design choice, face shape, grooming, bearing, posture, clothing fit, wear, practical presentation and one or two memorable decisions. Record which details are observed from supplied reference, confirmed by the owner, newly authored or unknown. An image of formal clothing or protective equipment does not establish occupation, competence, morality, danger or biography.

The creative question is why this person chose these clothes today. The visual author may supply an answer as an intentional design choice, but must not infer it as canonical biography from demographic or bodily features. Appearance and narrative/gameplay function remain independent. The asset database stores visual and compatibility facts, not inferred personality or gameplay categories.

Approve a small identity sheet and a primary dressed look before opening the part library. Capture nonnegotiable invariants: characteristic head proportions, asymmetry, stance, shoulder drop, belly/hip silhouette, hairline, grooming, meaningful wear and the outfit's decisive detail. Ordinary choices can dominate. C020's dark coat/skirt with bright red running shoes is an existing example of concentrated visual specificity; C003's leather/leopard combination and C033's jersey/loose denim create different people without requiring an elaborate accessory stack.

## 2. Select drafting references and budget reuse

Use the eight supplied fit references as drafting seeds, then make a character-specific calibration. Existing sex/height/width labels are historical reference names, not an instruction to derive psychology or constrain every new person to eight interchangeable bodies. Compare shoulder width/drop, torso/waist/hip/belly shape, limb lengths, hand/foot size, neck and habitual stance. Preserve meaningful deviations with per-view calibration or a new technical fit profile when necessary.

Search for existing garments/heads/hair only after those decisions. Reuse a family if its cut, material, fit, styling, pose coverage and view coverage serve the person. A close color is insufficient. Selective reuse may mean an existing trouser family with a newly authored waist/hem fit, or a new head/hair package with an approved existing coat. Do not stretch C001 clothing over C028 or C034 simply because a body class exists.

Create an explicit checklist of reused-as-is, reused-with-approved-calibration, source-reference-only and newly authored states. A catalog sheet is source-reference-only until its cropped pieces have clean coverage, interfaces, registration, layers and QA. C001's inventory jacket is closed while its source is open; choosing the open source look requires a shape state, not a palette entry.

## 3. Author four views together from inception

Establish front, 3/4, true side and back on the shared root/floor/scale and canonical facing contract from [04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md](04_RECOMMENDED_ZANT_MODULAR_STANDARD_v0_1.md). Begin with a four-view proportion sheet, then develop the views in parallel so head mass, belly, shoulders, garment hem, shoe sole and distinctive details correspond. A runtime consumer may later use fewer views; it does not remove views from the canonical library.

Record crop origins, view-specific anchors, anatomical left/right, allowed head/body facing combinations and mirror status. Check both floor contact and head/body scale with neighboring cast references. The existing neutral source canvases are all 1024×1536 but their visible feet are not one common floor; canvas equality alone does not supply a calibration.

Mirroring requires explicit review. Keep asymmetric tears, closures, patches, jewelry, shoe wear, hair and face marks on the intended side. C042's one-knee tights damage is concrete evidence that an ordinary reflection can erase or relocate intentional identity detail.

## 4. Paint anatomy, garments and hidden continuation as separate responsibilities

Prepare the minimum body/skin continuation needed by allowed clothing removals and pose changes; no exposed mannequin pixels or imagined anatomy behind a baked prop. Build neck/head, hands and feet interfaces around named anchors while retaining character-specific proportions.

Garments are families of view/fit/shape/pose states. Paint hollow neck/arm interfaces, inner fabric, shoulder/cuff/waist/ankle overlap and front/rear layers while those areas are being authored. Sleeves use whole-limb silhouette states with garment folds and patterns, guided by semantic joints. Pants need seat/crotch transitions and believable hems; long skirts/dresses/coats need coupled drape states and occlusion. A garment's hidden surfaces cannot be recovered reliably by merely slicing a dressed neutral master.

Keep removable gear independent. A helmet must not be the only head silhouette, armor must not replace torso anatomy, a glove must not erase needed bare fingers, and a handheld object must not supply the palm. Wearable straps and pouches need pose/view occlusion as well as sockets. Preserve separate cleanup and missing-isolation status rather than silently filling catalog gaps.

## 5. Author a small performance vocabulary deliberately

Choose a few useful limb states that fit the person's physical presentation: relaxed, one asymmetrical gesture, a modest weight shift or another concrete useful action. Whole arm/leg shapes are drawn to the same interface contract. Allow independent limb choices where combinations are visually valid, and record stance or garment constraints where they are coupled. Avoid requiring one complete bespoke full-body painting for every combination.

Capture both a hands-free standard state and a signature presentation. A signature can be a characteristic stance or gesture; it need not include a prop. If there is a prop, author its grip/occlusion and a credible empty-hand alternative. The original C020 flowers/hand presentation, C033 phone/flowers/open palms and C040 tool/listening-hand pair demonstrate why the pose and the anatomy need separate responsibilities. The original C006 folder bundle and bag are useful signature evidence, while the standardized hands-free art supplies another required reference.

Physical performance can communicate specificity through gaze, shoulders, hands, stillness and economical gesture. Do not translate those choices into an official emotion list or assign them to Encounter/BASED/DPA/ATOMIC meanings.

## 6. Build an identity-specific neutral head and face package

Approve the neutral head in all four views with consistent skull, nose/jaw/ear placement, head scale and neck attachment. Author the required bald/skin underplate before covering it with hair or hats. Separate hair behind/front, facial hair where expression interaction needs it, glasses/hats/accessories and neck/wardrobe layers. Do not allow facial patches to capture a shirt collar, hair edge or removable accessory merely because those pixels were present in a source reference.

For front and 3/4, use the five semantic regions—anatomical left/right brow, left/right eye, lower face—registered to each view's immutable neutral base. Author eye shape and paired gaze deliberately, allow left/right asymmetry, and save known-good complete presets alongside reviewed mixes. Side may use only visible brow/eye/lower-face semantics; back normally has no face overlays. Registration geometry is per identity/view; Goose's exact rectangles are not universal.

Lower-face art includes local cheeks/jaw/chin/shading when needed. Test one challenging deformation early. A dropped jaw or inflated cheek that changes the silhouette may need an extended region or a specific head-state variant. Do not shrink a genuine facial deformation into a floating mouth sticker or borrow neck/clothing pixels to conceal it. Numerical recomposition is necessary for package correctness, and visual identity/seam review remains necessary for acceptable mixtures.

## 7. Paint material masks while painting the garment

Assign soft semantic coverage for editable cloth, protected trim, hardware, reflective bands and patterns. Retain authored fold/highlight/texture structure and original approved colors. Save constrained per-material color ramps and protected detail. Distinguish open/closed, rolled sleeve, long hem and altered fabric as shape/material states rather than palette options.

C001's blue cloth should change independently of its light stripes/zipper; C028 reflectors and armor need separate treatment; C034 plaid, C018 leopard and C042 floral motifs need preserved color structure or authored alternate colorways. A broad hue shift cannot be the default material authoring workflow. Near-white/black or large lightness changes need specific review and sometimes new painting.

## 8. Register a recipe with provenance and QA status

Use the small versioned asset-authoring schema from deliverable04. Each recipe refers to approved identity/head, body/calibration, view, garment-family/state, pose, material choice, draw/occlusion data, sockets, face presets/slot compatibility and referenced asset versions. Record exact source files and hashes, derivation method, artist/owner approval, and statuses such as reference-only, authored-unreviewed, technically-validated and visually-approved.

Preserve raw evidence unchanged. Store working derivatives and final approved exports separately, with the original labels retained as provenance even when corrected visual classifications are added. Save complete recipes and reference renders so the same person can be reconstructed without manual image placement. Missing isolation and unsupported combinations stay explicit; they are not success defaults.

## 9. Gate technical correctness and ZANT specificity separately

Technical checks include dimensions/crop origins, root/scale, expected view/state coverage, alpha/edge treatment on light/dark backgrounds, nonempty required slots, deterministic saved-state recomposition, mask alignment, material containment, socket locations, allowed pairings and absence of guide/mannequin contamination. A file with binary alpha can still contain unwanted pixels or clipped shoes; inspect actual content.

Visual review compares the assembled original look to the approved master at source scale and intended display size, then inspects selected cross-combinations. Look for changed identity, idealized body proportions, missing outer volume, broken stripes/plaid, shoulder/cuff/crotch seams, floating feet, displaced asymmetry, texture or lighting seams, clipped extreme faces and hair/accessory contamination. Contact sheets support review; important cases need full-size views.

The ZANT gate asks whether the finished person retains their particular head, irregular proportions, styling, wear, posture and one or two memorable decisions. The result must look intentionally drawn as one person, not like a random selection of individually attractive parts. No technical pass can substitute for this judgment, and no demographic/personality inference should be used to manufacture visual coherence.

## 10. Promote useful bespoke parts back to the common library

After the person is approved, nominate useful new garment/head/hair/accessory families. Keep unique identity traits available as bespoke assets; not everything needs universal reuse. Candidate families need clean layers, hidden continuation, four-view state coverage, compatibility notes, material masks, mirror rules, provenance and reference composites.

Promotion on one person establishes a validated candidate. Claim cross-character interchangeability only after a second compatible calibrated host passes fit and visual review. Expand one difficult axis at a time: another fit, another useful pose, patterned garment, long garment or gear layer. Retain old versions and recipes so improved assets do not silently change existing people.

## Bounded initial release checklist

The first C001 experiment uses the exact budget in [05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md](05_FIRST_COMBINATORIAL_CHARACTER_PROOF_SPEC.md). For later ordinary additions, this starter budget gives an artist a finite negotiation point:

| Scope | Starting bound |
|---|---|
| Person/body | One identity, one calibrated body envelope, four aligned neutral reference views. |
| Outfit | One primary look: base top, at most one removable outer layer, bottom and pair of shoes. |
| Arms | Two useful states per anatomical side/view: 16 logical arm states across four views per sleeve configuration. Existing approved compatible states may be reused; layers are counted separately. |
| Legs | Two modest states per anatomical side/view with explicitly allowed supporting pairings; 16 logical leg states at most. Coupled drape garments instead budget whole-lower-body states. |
| Head/face | Four neutral head bases; two authored complete performance sets for front and 3/4; one extra coherent gaze pair per expressive view; one asymmetric mix from those states; reduced side coverage and no back overlays. At most24 front/3/4 slot variants for that proposed set, with side/new silhouette states counted separately. |
| Palette | Two editable materials with original plus two approved restrained alternatives; protect trim/pattern/hardware. |
| Presentation | One hands-free baseline plus one signature presentation, with at most one signature handheld object if needed. |
| Promotion | One candidate family submission and one saved recipe with provenance/QA; cross-fit claims await a second host. |

These are explicit starting bounds, not a demand to paint every maximum for every person. Additional outfits, hair families, extreme deformation envelopes, complex gear, long-garment states and extra fits require a revised checklist before authoring. Existing compatible assets reduce new-art count; unsupported hidden surfaces or new views cannot be assumed free.

After a character passes, retain its approved original look as the stable identity reference while adding curated combinations. The analysis ends before any production authoring or database implementation begins.
