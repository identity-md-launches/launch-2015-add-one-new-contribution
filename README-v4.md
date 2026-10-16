# Shelter miniature — version 4

Output: `artifacts/image-v4.png`, PNG (`image/png`), 3840 × 2160 pixels, 8-bit RGBA. The output is left untracked for the artifact uploader.

A real image-tool edit redraws the weathered wooden bridge over a fine paper crack, with two tied paper flags in terracotta and pale blue. Beneath it the graphite handwriting reads exactly: “Shelter is something we make for each other.”

The source is the latest accepted full canvas documented in MEDIA.md, downloaded from https://api.imd.fun/artifacts/1b38825278f9ebc84e886f2b37aeee6a301c9b34df935428a6e1244ec2c038e8 . Its SHA-256 was verified as `1b38825278f9ebc84e886f2b37aeee6a301c9b34df935428a6e1244ec2c038e8`. That source already contained a bridge: this edit redraws that contribution within the requested rectangle, rather than switching to an older canvas.

Method: the installed image_gen tool edited the actual source rectangle. Its generated raster was resampled into that rectangle, with an eight-pixel edge blend onto the original paper. All other pixels were copied from the source. No existing full-canvas image was substituted for the edit.

The saved output was decoded and compared to the source pixel-by-pixel, including alpha. There are 177,401 changed pixels. The exact zero-based inclusive changed-pixel bounding box is **(3201, 901)–(3649, 1299)**, or x=3201, y=901, width=449, height=399. Zero changed pixels lie outside x=3200–3650, y=900–1300. The centre and all other contributions remain identical to the source.

Final SHA-256: `32d5de3b89e51de1d13ce0f0e5622e4230776ff4d3d1c14b17ac908057d8f0cf`.

Review: visually inspected both the complete saved canvas and the enlarged 451 × 401 crop, confirming the bridge, two flags, crack, caption spelling and final period. Unmet visual requirements: none identified in local review. This is contributor review, not independent approval. Machine-readable comparison details are in verification-v4.json; scripts/compose-v4.mjs contains the compositor and saved-pixel comparison.
