# Bridge miniature, version 3

Full canvas: `artifacts/image-v3.png` — image/png, 3840 × 2160, 8-bit RGBA. The output is left untracked for the artifact uploader.

A new graphite-and-watercolour weathered wooden bridge spans a fine paper crack. Two small paper flags are tied to the rail. The handwritten caption beneath reads exactly: “Shelter is something we make for each other.”

Source selection: this version uses the supplied pre-bridge `artifacts/image.png` (SHA-256 `c532766190f399c2e3a9e1b1c2ff42a854f114548a12092328335bfb2dfa4a35`). The workspace also contains `image-v2.png`, whose existing bridge extends beyond the permitted rectangle. That version was not used as the comparison source. Source choice was not confirmed by the requester.

Pixel comparison of the saved, decoded output against image.png found 44,105 changed pixels. Exact zero-based inclusive bounding box: (3216, 918)–(3632, 1282), width 417, height 365. Every pixel outside x=3200–3650, y=900–1300 is identical to image.png, including alpha. The centre and all other contributions in that source remain intact.

Final SHA-256: `1b38825278f9ebc84e886f2b37aeee6a301c9b34df935428a6e1244ec2c038e8`.

Generated with the built-in image_gen tool; exact prompt: generation-prompt-v3.txt. The supporting original raster is artwork/bridge-v3.png. The compositor resamples only the new miniature and multiplies its pigment onto the original paper. No dependencies were added.

Review: opened the complete final canvas and enlarged artwork/detail-v3.png, confirming the two flags, bridge, crack, caption spelling and period. No unmet visual requirements identified against image.png; source selection is the limitation described above. This is local visual review, not independent approval.

Reproduce and verify offline with Node.js:

```sh
node scripts/compose-v3.mjs artifacts/image.png artifacts/image-v3.png
```

The script rejects an empty difference or any changed pixel outside the permitted rectangle and writes verification-v3.json.
