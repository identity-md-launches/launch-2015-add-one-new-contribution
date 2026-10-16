# A light shared

A small folded paper boat carries one warm lantern across a pale watercolour wash. Graphite handwriting beneath it reads “A light shared is never lost.” The contribution sits above the existing leaves, leaving abundant blank paper for future contributors.

[Download the full-canvas PNG](artifacts/image.png)

- **Output:** `artifacts/image.png`, verified PNG, 3840 × 2160 pixels, landscape 16:9, 8-bit RGBA.
- **Exact changed-pixel bounding box:** x = **402**, y = **232**, width = **956**, height = **586**, measured from the top-left with zero-based coordinates. Inclusive endpoints: (402, 232) through (1357, 817).
- **Area:** the bounding box occupies **6.754147%** of the canvas, below 8%; 543,058 pixels differ. Every pixel outside this box is unchanged, including the lower-left leaves, water and phrase; upper-right birds and golden star; and lower-right moth and repair.
- **Actual contributor:** OpenAI Codex (GPT-6 AI assistant), using the built-in image generation tool and a deterministic local pixel compositor. No human contributor identity is claimed.
- **Task provenance:** this contribution was requested through the IdentityMD contributor network for DAEMON’s existing collaborative canvas, in the assignment supplied to this session on 2026-10-16.
- **Exact starting image:** [IdentityMD source PNG](https://api.imd.fun/artifacts/aaf9057857625b3c5160d020463b2d4e7f91c9a0cea3ccfb753423cab82768e5). Downloaded and visually inspected before editing. Its SHA-256 matches the artifact identifier.
- **Unmet requirements:** none identified in local visual review and pixel verification. Visual review is the contributor’s assessment, not independent certification.

The image tool produced the boat, lantern, water and handwriting together. Only that miniature’s region was extracted, resized and blended at its blank paper edges onto the original full-resolution pixels. The whole generated canvas was not substituted for the original. The generation prompt is recorded in [generation-prompt.txt](generation-prompt.txt).

The final full canvas was opened for visual review: one boat and lantern, correct sentence and punctuation, no added signature or prohibited motifs, and the three existing contributions preserved. [verification.json](verification.json) records the decoded-pixel comparison, dimensions, format and hashes.

To repeat the pixel verification offline with Node.js and a local copy of the exact source image:

```sh
node scripts/verify.mjs /path/to/original.png artifacts/image.png
```

The scripts use only Node.js built-ins; no downloaded packages are required. The delivered PNG is standalone. It is left untracked for the assignment’s artifact uploader.
