import assert from 'node:assert/strict';
import test from 'node:test';
import type { Browser } from 'webdriverio';

import { browseReelComments, commentLikeTargets } from '../src/instagram/comment-browse.js';

const button = (name: string, label: string, x: number, y: number) =>
    `<XCUIElementTypeButton type="XCUIElementTypeButton" name="${name}" label="${label}" visible="true" accessible="true" x="${x}" y="${y}" width="44" height="44"/>`;

test('comment likes exclude the Reel heart and comments already liked', () => {
    const source = `<XCUIElementTypeApplication>${button('like-button', 'Like', 377, 456)}${button('comment-1', 'Like', 360, 420)}${button('comment-2', 'Unlike', 360, 520)}<XCUIElementTypeTextView type="XCUIElementTypeTextView" name="text-view" visible="true" x="20" y="820" width="300" height="50"/></XCUIElementTypeApplication>`;
    assert.deepEqual(commentLikeTargets(source, { width: 430, height: 932 }).map((node) => node.name), ['comment-1']);
});

test('comment browsing likes once, scrolls several viewports, and stops on a closed sheet', async () => {
    const source = `<XCUIElementTypeApplication>${button('comment-1', 'Like', 360, 420)}<XCUIElementTypeTextView type="XCUIElementTypeTextView" name="text-view" visible="true" x="20" y="820" width="300" height="50"/></XCUIElementTypeApplication>`;
    let actions = 0;
    const browser = {
        $: async () => ({ isDisplayed: async () => true, click: async () => {} }),
        getPageSource: async () => source,
        performActions: async () => { actions += 1; },
        releaseActions: async () => {},
    } as unknown as Browser;
    const base = { screen: { width: 430, height: 932 }, comment: { x: 398, y: 550 },
        active: () => true, delay: async () => {}, random: () => 0 };
    assert.equal(await browseReelComments(browser, { ...base, isOpen: async () => true }), 1);
    assert.equal(actions, 3); // one comment like plus two comment-list scrolls
    actions = 0;
    assert.equal(await browseReelComments(browser, { ...base, isOpen: async () => false }), 0);
    assert.equal(actions, 0);
});
