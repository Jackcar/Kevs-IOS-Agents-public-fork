import type { Browser } from 'webdriverio';

export function parseReelProgress(label: string | null): number | undefined {
    const match = label?.match(/^Video progress:\s*(\d+(?:\.\d+)?)\s*percent$/i);
    if (!match) return undefined;
    const value = Number(match[1]);
    return value >= 0 && value <= 100 ? value : undefined;
}

/** Query afresh because the accessible element's name changes during playback. */
export async function readReelProgress(browser: Browser): Promise<number | undefined> {
    const elements = await browser.findElements('-ios predicate string',
        'type == "XCUIElementTypeOther" AND label BEGINSWITH "Video progress:" AND visible == 1');
    if (elements.length !== 1) return undefined;
    const id = elements[0]['element-6066-11e4-a52e-4f735466cecf'];
    return parseReelProgress(await browser.getElementAttribute(id, 'label'));
}

export interface ReelWatchOptions {
    readProgress(): Promise<number | undefined>;
    delay(ms: number): Promise<void>;
    now(): number;
    isStopped(): boolean;
    deadline: number;
    fallbackWatchMs: number;
    maxWaitMs?: number;
}

export interface ReelWatchResult {
    reason: 'completed' | 'unavailable' | 'stalled' | 'timeout' | 'stopped' | 'deadline';
    elapsedMs: number;
}

export async function watchReelToCompletion(options: ReelWatchOptions): Promise<ReelWatchResult> {
    const startedAt = options.now();
    const watchDeadline = Math.min(options.deadline, startedAt + (options.maxWaitMs ?? 90_000));
    let previous: number | undefined;
    let missing = 0;
    let lastAdvanceAt = startedAt;
    const result = (reason: ReelWatchResult['reason']): ReelWatchResult => ({
        reason, elapsedMs: options.now() - startedAt,
    });
    const interrupted = (): ReelWatchResult | undefined => {
        if (options.isStopped()) return result('stopped');
        if (options.now() >= options.deadline) return result('deadline');
        if (options.now() >= watchDeadline) return result('timeout');
    };

    while (true) {
        const interruption = interrupted();
        if (interruption) return interruption;
        let progress: number | undefined;
        try { progress = await options.readProgress(); } catch { /* Timed fallback below. */ }
        const afterRead = interrupted();
        if (afterRead) return afterRead;
        if (progress === undefined || !Number.isFinite(progress) || progress < 0 || progress > 100) {
            missing += 1;
        } else {
            missing = 0;
            // A substantial end-to-start reset means playback reached the end.
            // Merely reaching 95% is not completion; wait for the actual loop.
            if (previous !== undefined && previous >= 70 && progress <= 30 && previous - progress >= 40) {
                return result('completed');
            }
            if (previous === undefined || progress > previous) lastAdvanceAt = options.now();
            previous = progress;
        }

        const stalled = options.now() - lastAdvanceAt >= 12_000;
        if (missing >= 3 || stalled) {
            const remaining = Math.max(0, Math.min(
                startedAt + options.fallbackWatchMs, watchDeadline,
            ) - options.now());
            await options.delay(remaining);
            return interrupted() ?? result(missing >= 3 ? 'unavailable' : 'stalled');
        }
        await options.delay(Math.min(1_000, watchDeadline - options.now()));
    }
}
