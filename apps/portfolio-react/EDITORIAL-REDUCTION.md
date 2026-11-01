# M01 · Editorial Reduction V1
Visual subtraction is opt-in and reversible. Original pixel-locked references are unchanged.

Baseline: 1274f70, codex/m01-beyond-the-frame-cinema-preview.
New branch: codex/m01-editorial-reduction-v1.
Local worktree: E:/M01-visual-reduction-20261031.
Never merged to main or deployed to zxyzx.me.

WITHIN: 11 independent microtype/survey items suppressed. Remaining visible image units 29/40.
BEYOND: 7 safely removable folio/survey items suppressed. Remaining visible units 33/40.
Photography, figure, giant text, landscapes, light and principal orbit are preserved.
Deletion behind complex photographs was deliberately avoided because it causes large fabricated photographic artifacts.
Local inferred repair is only a masked, static editorial clean-up, NOT a reliable motion clean plate.

Compare on local 4194 port:
Original WITHIN: http://127.0.0.1:4194/zxyzx-me-lab/preview/m01-react/?world=within&view=layers
Quiet WITHIN: http://127.0.0.1:4194/zxyzx-me-lab/preview/m01-react/?world=within&view=layers&composition=quiet
Original BEYOND: http://127.0.0.1:4194/zxyzx-me-lab/preview/m01-react/?world=beyond&view=layers
Quiet BEYOND: http://127.0.0.1:4194/zxyzx-me-lab/preview/m01-react/?world=beyond&view=layers&composition=quiet
Cinema homepage with quiet endpoint: http://127.0.0.1:4194/zxyzx-me-lab/preview/m01-react/?composition=quiet

Rollback immediately by removing composition=quiet from the URL.
Original branch retains HEAD 1274f70; this branch is independent.
If eventually merged, revert the editorial reduction commit.
Regenerate the two masked restoration assets with:
python scripts/generate-editorial-reduction.py
Browser screenshots are stored under E:/M01-visual-reduction-QA-20261031/review.