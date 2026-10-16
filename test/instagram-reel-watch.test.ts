import assert from 'node:assert/strict';
import test from 'node:test';
import type { Browser } from 'webdriverio';

import { decideWatchToCompletion, PROFILES } from '../src/instagram/doomscroll-profile.js';
import { parseReelProgress, readReelProgress, watchReelToCompletion } from '../src/instagram/reel-watch.js';

test('parse Instagram playback progress and reject ambiguous or invalid labels', () => {
    assert.equal(parseReelProgress('Video progress: 29 percent'), 29);
    assert.equal(parseReelProgress('Video progress: 100 percent'), 100);
    assert.equal(parseReelProgress('Video progress: 0 percent'), 0);
    for (const invalid of [null, 'Likes: 29', 'Video progress: 101 percent', 'Video progress: -1 percent']) {
        assert.equal(parseReelProgress(invalid), undefined);
    }
});

test('progress reads use the visible playback element and refresh its changing ID', async () => {
    let reads = 0;
    const driver = {
        findElements: async (using: string, predicate: string) => {
            assert.equal(using, '-ios predicate string');
            assert.match(predicate, /visible == 1/);
            reads += 1;
            return [{ 'element-6066-11e4-a52e-4f735466cecf': String(reads) }];
        },
        getElementAttribute: async (id: string, attribute: string) => {
            assert.equal(id, String(reads));
            assert.equal(attribute, 'label');
            return `Video progress: ${reads * 10} percent`;
        },
    } as unknown as Browser;
    assert.equal(await readReelProgress(driver), 10);
    assert.equal(await readReelProgress(driver), 20);
});

test('ambiguous playback elements do not supply progress', async () => {
    const driver = { findElements: async () => [{}, {}] } as unknown as Browser;
    assert.equal(await readReelProgress(driver), undefined);
});

function clock(samples: Array<number | undefined>, deadline = 120_000) {
    let time = 0;
    let index = 0;
    return {
        readProgress: async () => samples[Math.min(index++, samples.length - 1)],
        now: () => time,
        delay: async (ms: number) => { assert.ok(ms >= 0); time += ms; },
        isStopped: () => false,
        deadline,
        fallbackWatchMs: 6_000,
    };
}

test('watch completion waits for playback to loop rather than stopping at 95%', async () => {
    const watched = await watchReelToCompletion(clock([10, 50, 95, 99, 4]));
    assert.equal(watched.reason, 'completed');
    assert.equal(watched.elapsedMs, 4_000);
});

test('small backwards jumps are not mistaken for completion', async () => {
    const watched = await watchReelToCompletion(clock([40, 45, 42, 75, 72, 99, 3]));
    assert.equal(watched.reason, 'completed');
    assert.equal(watched.elapsedMs, 6_000);
});

test('missing progress falls back to the regular watch duration', async () => {
    const watched = await watchReelToCompletion(clock([undefined]));
    assert.deepEqual(watched, { reason: 'unavailable', elapsedMs: 6_000 });
});

test('progress read failures fall back without restarting Instagram', async () => {
    const options = clock([]);
    options.readProgress = async () => { throw new Error('stale element'); };
    assert.equal((await watchReelToCompletion(options)).reason, 'unavailable');
});

test('paused or buffering reels stop waiting after stalled progress', async () => {
    assert.deepEqual(await watchReelToCompletion(clock([24])), { reason: 'stalled', elapsedMs: 12_000 });
});

test('long playback is capped at 90 seconds even while progress advances', async () => {
    const options = clock([]);
    options.readProgress = async () => options.now() / 2_000;
    assert.deepEqual(await watchReelToCompletion(options), { reason: 'timeout', elapsedMs: 90_000 });
});

test('session deadline takes precedence over completion and timed fallback', async () => {
    assert.deepEqual(await watchReelToCompletion(clock([undefined], 2_500)), {
        reason: 'deadline', elapsedMs: 2_500,
    });
    assert.equal((await watchReelToCompletion(clock([10, 80, 2], 2_000))).reason, 'deadline');
});

test('Stop interrupts completion watching promptly', async () => {
    const options = clock([10, 15, 20]);
    options.isStopped = () => options.now() >= 2_000;
    assert.deepEqual(await watchReelToCompletion(options), { reason: 'stopped', elapsedMs: 2_000 });
});

test('completion watching varies by personality and leaves some reels with short watches', () => {
    assert.equal(decideWatchToCompletion(PROFILES.casual, () => 0.34), true);
    assert.equal(decideWatchToCompletion(PROFILES.casual, () => 0.35), false);
    assert.equal(decideWatchToCompletion(PROFILES.skimmer, () => 0.2), false);
    assert.equal(decideWatchToCompletion(PROFILES.engaged, () => 0.6), true);
});
