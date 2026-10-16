import assert from 'node:assert/strict';
import test from 'node:test';
import type { Browser } from 'webdriverio';

import { hasInstagramReelsControls, tapInstagramButton } from '../src/instagram/actions.js';

test('Reels identity requires the selected tab and visible interaction controls', async () => {
    for (const [selected, likeVisible, commentVisible, expected] of [
        ['1', true, true, true], ['0', true, true, false],
        ['1', false, true, false], ['1', true, false, false],
    ] as const) {
        const driver = { $: async (selector: string) => ({
            getAttribute: async () => selected,
            isDisplayed: async () => selector === '~like-button' ? likeVisible : commentVisible,
        }) } as unknown as Browser;
        assert.equal(await hasInstagramReelsControls(driver), expected);
    }
});

test('Reels interactions click the visible accessibility button instead of a stale coordinate', async () => {
    let clicks = 0;
    const driver = {
        $: async (selector: string) => {
            assert.equal(selector, '~comment-button');
            return { isDisplayed: async () => true, click: async () => { clicks += 1; } };
        },
        performActions: async () => { assert.fail('must use the visible button'); },
    } as unknown as Browser;
    await tapInstagramButton(driver, 'comment-button', 398, 550, 'Comment');
    assert.equal(clicks, 1);
});

test('older Instagram builds fall back to calibrated points when the button is absent', async () => {
    let taps = 0;
    const driver = {
        $: async () => ({ isDisplayed: async () => false }),
        performActions: async (actions: Array<{ actions: Array<{ x?: number; y?: number }> }>) => {
            assert.equal(actions[0].actions[0].x, 129);
            assert.equal(actions[0].actions[0].y, 874);
            taps += 1;
        },
        releaseActions: async () => {},
    } as unknown as Browser;
    await tapInstagramButton(driver, 'reels-tab', 129, 874, 'Reels');
    assert.equal(taps, 1);
});

test('a failed Like click is not retried at coordinates, which could toggle the like off', async () => {
    const driver = {
        $: async () => ({
            isDisplayed: async () => true,
            click: async () => { throw new Error('click response lost'); },
        }),
        performActions: async () => { assert.fail('must not repeat a possibly completed click'); },
    } as unknown as Browser;
    await assert.rejects(tapInstagramButton(driver, 'like-button', 398, 478, 'Like'), /click response lost/);
});
