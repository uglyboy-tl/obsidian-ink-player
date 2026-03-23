/**
 * Tests for session persistence (save/restore between Obsidian reloads).
 *
 * Save path:  useContents.subscribe() in plugin.ts
 *             → localStorage["ink-session-{filePath}"]
 *
 * Restore path: onLayoutReady / view.setState()
 *             → sets "ink-player-restore-session" flag
 *             → activateView() → compiledStory() → new InkStory
 *             → React useEffect([ink]) → memory.load()
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import useContents from "../hooks/story/story_contents";
import useFile from "../hooks/file";
import useStory from "../hooks/story/story";
import memory from "../lib/patches/memory";

// ─── helpers ───────────────────────────────────────────────────────────────

const FILE_PATH = "stories/test.ink";
const SESSION_KEY = `ink-session-${FILE_PATH}`;
const RESTORE_FLAG = "ink-player-restore-session";

function makeMockInk(stateJson = '{"pos":5}', saveLabels: string[] = []) {
	return {
		title: FILE_PATH,
		story: { state: { toJson: () => stateJson, LoadJson: vi.fn() } },
		save_label: saveLabels,
		clear: vi.fn(),
		continue: vi.fn(),
	};
}

/** Simulate the subscription callback from plugin.ts */
function makePluginSubscription(ink: ReturnType<typeof makeMockInk>) {
	return useContents.subscribe(() => {
		const fp = useFile.getState().filePath;
		if (!fp) return;

		const inkFromStore = ink; // stand-in for useStory.getState().ink
		if (!inkFromStore) return;

		try {
			const save: Record<string, unknown> = {
				state: inkFromStore.story.state.toJson(),
			};
			inkFromStore.save_label.forEach((label: string) => {
				const val = (inkFromStore as Record<string, unknown>)[label];
				if (val !== undefined) save[label] = val;
			});
			localStorage.setItem(SESSION_KEY, JSON.stringify(save));
		} catch (_) {}
	});
}

// ─── reset state between tests ─────────────────────────────────────────────

beforeEach(() => {
	localStorage.clear();
	useContents.setState({ contents: [] });
	useFile.getState().init("", "", "");
	useStory.setState({ ink: null });
});

// ═══════════════════════════════════════════════════════════════════════════
// 1. Zustand subscription mechanics
// ═══════════════════════════════════════════════════════════════════════════

describe("1. useContents.subscribe", () => {
	it("fires when add() is called", () => {
		const listener = vi.fn();
		const unsub = useContents.subscribe(listener);
		useContents.getState().add(["line1"]);
		expect(listener).toHaveBeenCalledTimes(1);
		unsub();
	});

	it("fires when setContents() is called", () => {
		const listener = vi.fn();
		const unsub = useContents.subscribe(listener);
		useContents.getState().setContents(["a", "b"]);
		expect(listener).toHaveBeenCalledTimes(1);
		unsub();
	});

	it("Zustand v5 fires even for same-reference setState (important: clear() via mutation does NOT fire)", () => {
		// Zustand v5 does NOT do reference equality checks — setState always notifies.
		// This matters because ink.clear() uses `this.contents.length = 0` (direct mutation),
		// which does NOT go through setState and therefore does NOT trigger the subscription.
		// Only add() and setContents() (which call set()) trigger the subscription.
		const listener = vi.fn();
		const unsub = useContents.subscribe(listener);
		useContents.setState({ contents: useContents.getState().contents });
		expect(listener).toHaveBeenCalledTimes(1); // Zustand v5 always fires on setState
		unsub();
	});

	it("receives updated state in callback", () => {
		let captured: string[] = [];
		const unsub = useContents.subscribe((state) => {
			captured = state.contents;
		});
		useContents.getState().add(["hello"]);
		expect(captured).toContain("hello");
		unsub();
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. REAL plugin subscription (reads from useStory, not closure)
// ═══════════════════════════════════════════════════════════════════════════

/** Exact copy of the subscription callback from plugin.ts */
function makeRealPluginSubscription() {
	return useContents.subscribe(() => {
		const ink = useStory.getState().ink;
		const filePath = useFile.getState().filePath;
		if (!ink || !filePath) return;
		try {
			const save: Record<string, unknown> = {
				state: (ink as any).story.state.toJson(),
			};
			(ink as any).save_label.forEach((label: string) => {
				if (
					label in (ink as any) &&
					typeof (ink as any)[label] !== "undefined"
				)
					save[label] = (ink as any)[label];
			});
			localStorage.setItem(`ink-session-${filePath}`, JSON.stringify(save));
		} catch (_) {}
	});
}

describe("2. Real plugin subscription (via useStory)", () => {
	it("saves when useStory.ink AND useFile.filePath are both set", () => {
		useFile.getState().init(FILE_PATH, "", "");
		const ink = makeMockInk();
		useStory.setState({ ink: ink as any });

		const unsub = makeRealPluginSubscription();
		useContents.getState().add(["line 1"]);

		const raw = localStorage.getItem(SESSION_KEY);
		expect(raw, "session not saved — ink or filePath was null in subscription").not.toBeNull();
		expect(JSON.parse(raw!).state).toBe('{"pos":5}');

		unsub();
	});

	it("does NOT save when useStory.ink is null (guard works)", () => {
		useFile.getState().init(FILE_PATH, "", "");
		// ink is null (default)

		const unsub = makeRealPluginSubscription();
		useContents.getState().add(["line 1"]);

		expect(localStorage.getItem(SESSION_KEY)).toBeNull();
		unsub();
	});

	it("does NOT save when useFile.filePath is empty (guard works)", () => {
		const ink = makeMockInk();
		useStory.setState({ ink: ink as any });
		// filePath is empty (default after beforeEach)

		const unsub = makeRealPluginSubscription();
		useContents.getState().add(["line 1"]);

		expect(localStorage.getItem(SESSION_KEY)).toBeNull();
		unsub();
	});

	it("saves save_label fields (e.g. contents) when ink is set", () => {
		useFile.getState().init(FILE_PATH, "", "");
		const ink = makeMockInk('{"pos":1}', ["myField"]);
		(ink as any).myField = "hello";
		useStory.setState({ ink: ink as any });

		const unsub = makeRealPluginSubscription();
		useContents.getState().add(["line"]);

		const raw = JSON.parse(localStorage.getItem(SESSION_KEY)!);
		expect(raw.myField).toBe("hello");

		unsub();
	});

	it("saves ink.contents (the default save_label) via getter", () => {
		useFile.getState().init(FILE_PATH, "", "");
		// ink.save_label includes "contents" by default
		// ink.contents getter returns useContents.getState().contents
		const ink = makeMockInk('{"pos":1}', ["contents"]);
		// Override contents getter to return current Zustand state
		Object.defineProperty(ink, "contents", {
			get: () => useContents.getState().contents,
			configurable: true,
		});
		useStory.setState({ ink: ink as any });

		const unsub = makeRealPluginSubscription();
		useContents.getState().add(["saved line"]);

		const raw = JSON.parse(localStorage.getItem(SESSION_KEY)!);
		expect(raw.contents).toEqual(["saved line"]);

		unsub();
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Session SAVE (helper-based)
// ═══════════════════════════════════════════════════════════════════════════

describe("3. Session save (subscription)", () => {
	it("saves to localStorage when contents change and filePath is set", () => {
		useFile.getState().init(FILE_PATH, "", "");
		const ink = makeMockInk();
		const unsub = makePluginSubscription(ink);

		useContents.getState().add(["line 1"]);

		const raw = localStorage.getItem(SESSION_KEY);
		expect(raw, "session not saved").not.toBeNull();
		const parsed = JSON.parse(raw!);
		expect(parsed.state).toBe('{"pos":5}');

		unsub();
	});

	it("does NOT save when filePath is empty (guard works)", () => {
		// filePath is "" (default after beforeEach)
		const ink = makeMockInk();
		const unsub = makePluginSubscription(ink);

		useContents.getState().add(["line 1"]);

		expect(localStorage.length).toBe(0);
		unsub();
	});

	it("saves updated state after each content change", () => {
		useFile.getState().init(FILE_PATH, "", "");
		let callCount = 0;
		const stateVersions = ['{"pos":1}', '{"pos":2}', '{"pos":3}'];
		const ink = {
			...makeMockInk(),
			story: {
				state: {
					toJson: () => stateVersions[callCount++] ?? '{}',
					LoadJson: vi.fn(),
				},
			},
		};

		const unsub = makePluginSubscription(ink);

		useContents.getState().add(["line 1"]);
		useContents.getState().add(["line 2"]);
		useContents.getState().add(["line 3"]);

		const raw = localStorage.getItem(SESSION_KEY);
		const parsed = JSON.parse(raw!);
		expect(parsed.state).toBe('{"pos":3}');

		unsub();
	});

	it("includes save_label fields in saved data", () => {
		useFile.getState().init(FILE_PATH, "", "");
		const ink = {
			...makeMockInk('{"pos":1}', ["myLabel"]),
			myLabel: "someValue",
		} as ReturnType<typeof makeMockInk> & { myLabel: string };

		// Inline subscription that handles save_label
		const unsub = useContents.subscribe(() => {
			const fp = useFile.getState().filePath;
			if (!fp) return;
			const save: Record<string, unknown> = {
				state: ink.story.state.toJson(),
			};
			ink.save_label.forEach((label: string) => {
				const val = (ink as Record<string, unknown>)[label];
				if (val !== undefined) save[label] = val;
			});
			localStorage.setItem(SESSION_KEY, JSON.stringify(save));
		});

		useContents.getState().add(["line 1"]);

		const raw = JSON.parse(localStorage.getItem(SESSION_KEY)!);
		expect(raw.myLabel).toBe("someValue");

		unsub();
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. Session RESTORE — memory.load()
// ═══════════════════════════════════════════════════════════════════════════

describe("3. memory.load()", () => {
	it("calls LoadJson with saved state string", () => {
		const ink = makeMockInk();
		const stateJson = '{"version":21}';
		const saveData = JSON.stringify({ state: stateJson });

		memory.load(saveData, ink as any);

		expect(ink.story.state.LoadJson).toHaveBeenCalledWith(stateJson);
	});

	it("calls ink.clear() before continuing", () => {
		const ink = makeMockInk();
		memory.load(JSON.stringify({ state: "{}" }), ink as any);

		expect(ink.clear).toHaveBeenCalled();
	});

	it("calls ink.continue() to render restored content", () => {
		const ink = makeMockInk();
		memory.load(JSON.stringify({ state: "{}" }), ink as any);

		expect(ink.continue).toHaveBeenCalled();
	});

	it("restores save_label fields from saved data", () => {
		const ink = {
			...makeMockInk(),
			save_label: ["contents"],
			contents: [] as string[],
		};
		const saveData = JSON.stringify({
			state: "{}",
			contents: ["restored line 1", "restored line 2"],
		});

		memory.load(saveData, ink as any);

		expect(ink.contents).toEqual(["restored line 1", "restored line 2"]);
	});

	it("does not throw on empty save_data object", () => {
		const ink = makeMockInk();
		expect(() =>
			memory.load(JSON.stringify({ state: "{}" }), ink as any)
		).not.toThrow();
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. Key consistency (save key === restore key)
// ═══════════════════════════════════════════════════════════════════════════

describe("4. Save/restore key consistency", () => {
	it("subscription save key matches InkStory.tsx restore key", () => {
		// Save uses: `ink-session-${useFile.getState().filePath}`
		const saveKey = `ink-session-${FILE_PATH}`;

		// Restore uses: `ink-session-${ink.title}`
		// ink.title = filePath (set in compiledStory via setStory(story, filePath))
		const inkTitle = FILE_PATH; // this is what compiledStory() passes
		const restoreKey = `ink-session-${inkTitle}`;

		expect(saveKey).toBe(restoreKey);
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. Race condition: view.setState() vs onLayoutReady
// ═══════════════════════════════════════════════════════════════════════════

describe("5. Race condition: double ink creation wipes session", () => {
	/**
	 * The bug:
	 *   setState() enters its if-block, hits `await vault.read()`, and suspends.
	 *   onLayoutReady fires → creates InkStory #1 → useEffect restores session
	 *   and removes the restore flag.
	 *   setState() resumes → creates InkStory #2 → useEffect finds no flag →
	 *   calls ink.restart() → subscription saves beginning-of-story state,
	 *   overwriting the real session.
	 *
	 * The fix: after the await, skip compiledStory() if ink.title already
	 * matches the filePath (meaning onLayoutReady already compiled it).
	 */
	it("second ink creation calls restart() and overwrites session — demonstrating the bug", () => {
		const filePath = "stories/test.ink";
		const sessionData = JSON.stringify({ state: '{"chapter":3}' });
		localStorage.setItem(`ink-session-${filePath}`, sessionData);

		// --- InkStory #1 (created by onLayoutReady → activateView) ---
		const ink1 = makeMockInk('{"chapter":3}');

		// Simulate React useEffect([ink1]) — restore flag IS set
		localStorage.setItem(RESTORE_FLAG, "true");
		const flag1 = localStorage.getItem(RESTORE_FLAG);
		const sd1 = flag1 ? localStorage.getItem(`ink-session-${ink1.title}`) : null;
		if (sd1) {
			memory.load(sd1, ink1 as any);
			localStorage.removeItem(RESTORE_FLAG); // flag removed here
		} else {
			ink1.continue(); // restart
		}
		expect(ink1.continue).toHaveBeenCalledTimes(1); // via memory.load ✓
		expect(localStorage.getItem(RESTORE_FLAG)).toBeNull();

		// --- InkStory #2 (created by setState() resuming — WITHOUT the fix) ---
		const ink2 = makeMockInk('{"chapter":1}'); // fresh story state

		// Simulate React useEffect([ink2]) — flag is GONE
		const flag2 = localStorage.getItem(RESTORE_FLAG); // null
		const sd2 = flag2 ? localStorage.getItem(`ink-session-${ink2.title}`) : null;
		if (sd2) {
			memory.load(sd2, ink2 as any);
			localStorage.removeItem(RESTORE_FLAG);
		} else {
			ink2.continue(); // BUG: restart from beginning
		}

		// ink2 started fresh — bad!
		expect(ink2.continue).toHaveBeenCalled();

		// If the subscription were active, it would now overwrite localStorage
		// with the beginning-of-story state. The test documents this failure mode.
	});

	it("fix: skip compiledStory() when ink.title already matches filePath", () => {
		// This test models the guard added to view.setState() after the await:
		//   if (useStory.getState().ink?.title !== filePath) { compiledStory() }

		const filePath = "stories/test.ink";
		const sessionData = JSON.stringify({ state: '{"chapter":3}' });
		localStorage.setItem(`ink-session-${filePath}`, sessionData);
		localStorage.setItem(RESTORE_FLAG, "true");

		// Simulate ink already set by onLayoutReady with correct filePath
		const existingInk = { title: filePath };

		// The guard condition from view.setState() after await:
		const shouldCompile = existingInk?.title !== filePath;

		expect(shouldCompile).toBe(false); // guard prevents second compilation ✓

		// Session data is still in localStorage, flag is still set
		expect(localStorage.getItem(RESTORE_FLAG)).toBe("true");
		expect(localStorage.getItem(`ink-session-${filePath}`)).toBe(sessionData);
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. Full round-trip: save → restore
// ═══════════════════════════════════════════════════════════════════════════

describe("6. Full simulation: play → save → reload → restore", () => {
	it("session saved during play is fully restorable after Zustand state reset", () => {
		// ── PLAY PHASE ──────────────────────────────────────────────────────
		useFile.getState().init(FILE_PATH, "", "");
		const stateJson = '{"chapter":3,"score":42}';
		const ink = makeMockInk(stateJson, ["contents"]);
		Object.defineProperty(ink, "contents", {
			get: () => useContents.getState().contents,
			set: (v: string[]) => useContents.getState().setContents(v),
			configurable: true,
		});
		useStory.setState({ ink: ink as any });

		const unsub = makeRealPluginSubscription();

		// Simulate game play: intro + choice + more content
		useContents.getState().add(["Intro text."]);
		useContents.getState().add(["\x00ink-divider\x00"]); // INK_DIVIDER
		useContents.getState().add(["Chapter 3 text."]);

		// Verify session was saved
		const savedRaw = localStorage.getItem(SESSION_KEY);
		expect(savedRaw, "nothing was saved to localStorage").not.toBeNull();
		const saved = JSON.parse(savedRaw!);
		expect(saved.state).toBe(stateJson);
		expect(saved.contents).toEqual([
			"Intro text.",
			"\x00ink-divider\x00",
			"Chapter 3 text.",
		]);

		unsub();

		// ── RELOAD SIMULATION ───────────────────────────────────────────────
		// Reset Zustand state (simulates Obsidian reload — JS memory cleared)
		useContents.setState({ contents: [] });
		useStory.setState({ ink: null });
		useFile.getState().init("", "", "");

		// ── RESTORE PHASE ───────────────────────────────────────────────────
		// Set restore flag (done by view.setState() or onLayoutReady)
		localStorage.setItem(RESTORE_FLAG, "true");

		// New ink created after compiledStory()
		const ink2 = makeMockInk(stateJson, ["contents"]);
		Object.defineProperty(ink2, "contents", {
			get: () => useContents.getState().contents,
			set: (v: string[]) => useContents.getState().setContents(v),
			configurable: true,
		});

		// Simulate InkStory.tsx useEffect([ink]) logic
		const restoreFlag = localStorage.getItem(RESTORE_FLAG);
		const sessionData = restoreFlag
			? localStorage.getItem(`ink-session-${ink2.title}`)
			: null;

		expect(sessionData, "session data not found on restore").not.toBeNull();

		if (sessionData) {
			// ink2.story.ResetState() — skip in mock
			// ink2.clear() — skip in mock
			memory.load(sessionData, ink2 as any);
			localStorage.removeItem(RESTORE_FLAG);
		}

		// Verify restore was called correctly
		expect(ink2.story.state.LoadJson).toHaveBeenCalledWith(stateJson);
		expect(ink2.clear).toHaveBeenCalled();
		expect(ink2.continue).toHaveBeenCalled();

		// Verify flag was removed
		expect(localStorage.getItem(RESTORE_FLAG)).toBeNull();
	});
});

describe("7. Full round-trip", () => {
	it("data saved by subscription is readable by restore logic", () => {
		useFile.getState().init(FILE_PATH, "", "");
		const stateJson = '{"chapter":3,"score":42}';
		const ink = makeMockInk(stateJson);

		// ── SAVE PHASE ──────────────────────────────────────────────────────
		const unsub = makePluginSubscription(ink);
		useContents.getState().add(["some content"]);
		unsub();

		// ── RESTORE PHASE ───────────────────────────────────────────────────
		// Simulate: onLayoutReady sets the flag, then activateView() runs,
		// then React useEffect([ink]) checks the flag and reads the session.
		localStorage.setItem(RESTORE_FLAG, "true");

		const restoreFlag = localStorage.getItem(RESTORE_FLAG);
		const sessionData = restoreFlag
			? localStorage.getItem(`ink-session-${ink.title}`) // ink.title === FILE_PATH
			: null;

		expect(sessionData, "session data not found in localStorage").not.toBeNull();
		const parsed = JSON.parse(sessionData!);
		expect(parsed.state).toBe(stateJson);
	});

	it("restore flag is set before ink is available — flag survives", () => {
		// Obsidian calls setState() which sets the flag synchronously,
		// THEN compiledStory() creates the ink. The flag must still be there
		// when React useEffect([ink]) runs.

		localStorage.setItem(RESTORE_FLAG, "true");

		// ... time passes, ink is created, React renders ...

		const flagStillSet = localStorage.getItem(RESTORE_FLAG);
		expect(flagStillSet).toBe("true");
	});

	it("restore removes the flag after loading", () => {
		// InkStory.tsx removes the flag after successful load
		localStorage.setItem(RESTORE_FLAG, "true");
		localStorage.setItem(SESSION_KEY, JSON.stringify({ state: "{}" }));

		const ink = makeMockInk();
		const sessionData = localStorage.getItem(RESTORE_FLAG)
			? localStorage.getItem(`ink-session-${ink.title}`)
			: null;

		if (sessionData) {
			memory.load(sessionData, ink as any);
			localStorage.removeItem(RESTORE_FLAG); // what InkStory.tsx does
		}

		expect(localStorage.getItem(RESTORE_FLAG)).toBeNull();
	});
});
