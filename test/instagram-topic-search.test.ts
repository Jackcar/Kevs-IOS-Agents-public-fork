import assert from 'node:assert/strict';
import test from 'node:test';
import type { Browser } from 'webdriverio';

import { openInstagramTopicReels } from '../src/instagram/topic-search.js';

function mockSearch(hasReelsFilter = true, hasForYouFilter = true, searchTabName = 'search-tab', hasMediaResult = true) {
    const clicks: string[] = [];
    let typed = '';
    let submitted = '';
    const browser = {
        keys: async (value: string) => { submitted = value; },
        performActions: async () => {}, releaseActions: async () => {},
        $: async (selector: string) => ({
            isExisting: async () => selector === '~search-tab' ? searchTabName === 'search-tab'
                : selector === '~explore-tab' ? searchTabName === 'explore-tab'
                    : selector.includes('label == "Reels"') ? hasReelsFilter
                        : selector.includes('label == "For you"') ? hasForYouFilter
                            : selector.includes('media-discovery-cell') ? hasMediaResult : true,
            isDisplayed: async () => true,
            getAttribute: async (name: string) => name === 'name' ? searchTabName : '0',
            click: async () => { clicks.push(selector); },
            clearValue: async () => { typed = ''; },
            setValue: async (value: string) => { typed = value; },
        }),
    } as unknown as Browser;
    return { browser, clicks, typed: () => typed, submitted: () => submitted };
}

test('topic search submits the query, selects Reels, and opens a result', async () => {
    const mock = mockSearch();
    assert.equal(await openInstagramTopicReels(mock.browser, {
        topic: 'baby sleep training', searchTab: { x: 100, y: 800 }, searchField: { x: 200, y: 100 },
        screenSize: { width: 390, height: 844 }, active: () => true, delay: async () => {}, log: () => {},
    }), true);
    assert.equal(mock.typed(), 'baby sleep training');
    assert.equal(mock.submitted(), '\uE007');
    assert.ok(mock.clicks.some((selector) => selector.includes('label == "Reels"')));
    assert.ok(mock.clicks.some((selector) => selector.includes('Reel by')));
});

test('topic search accepts Instagram’s explore-tab identifier', async () => {
    const mock = mockSearch(true, true, 'explore-tab');
    assert.equal(await openInstagramTopicReels(mock.browser, {
        topic: 'baby sleep', searchTab: { x: 295, y: 904 }, searchField: { x: 216, y: 86 },
        screenSize: { width: 440, height: 956 }, active: () => true, delay: async () => {}, log: () => {},
    }), true);
    assert.ok(mock.clicks.includes('~explore-tab'));
});

test('topic search stops safely when Instagram has no Reels filter', async () => {
    const mock = mockSearch(false, false);
    assert.equal(await openInstagramTopicReels(mock.browser, {
        topic: 'baby sleep', searchTab: { x: 100, y: 800 }, searchField: { x: 200, y: 100 },
        screenSize: { width: 390, height: 844 }, active: () => true, delay: async () => {}, log: () => {},
    }), false);
    assert.equal(mock.clicks.some((selector) => selector.includes('Reel by')), false);
});

test('topic search opens the first tile from Instagram’s new For you grid', async () => {
    const mock = mockSearch(false, true);
    assert.equal(await openInstagramTopicReels(mock.browser, {
        topic: 'baby sleep', searchTab: { x: 295, y: 904 }, searchField: { x: 216, y: 86 },
        screenSize: { width: 440, height: 956 }, active: () => true, delay: async () => {}, log: () => {},
    }), true);
    assert.equal(mock.clicks.some((selector) => selector.includes('label == "Reels"')), false);
    assert.ok(mock.clicks.some((selector) => selector.includes('Reel by')));
});

test('topic search never falls back to the Meta AI card when no Reel cell exists', async () => {
    const mock = mockSearch(false, true, 'explore-tab', false);
    assert.equal(await openInstagramTopicReels(mock.browser, {
        topic: 'baby sleep', searchTab: { x: 295, y: 904 }, searchField: { x: 216, y: 86 },
        screenSize: { width: 440, height: 956 }, active: () => true, delay: async () => {}, log: () => {},
    }), false);
    assert.equal(mock.clicks.some((selector) => selector.includes('media-discovery-cell')), false);
});

test('topic search reacquires Instagram focused TextView before typing', async () => {
    let focused = false;
    let typed = '';
    const browser = {
        keys: async () => {}, performActions: async () => {}, releaseActions: async () => {},
        $: async (selector: string) => {
            const isSearch = selector.includes('XCUIElementTypeSearchField');
            const isReels = selector.includes('label == "Reels"');
            const isResult = selector.includes('Reel by');
            const isSearchTab = selector === '~search-tab';
            const capturedFocus = focused;
            return {
                isExisting: async () => isSearch || isReels || isResult || isSearchTab,
                isDisplayed: async () => true,
                getAttribute: async () => '0',
                click: async () => { if (isSearch) focused = true; },
                clearValue: async () => {
                    assert.equal(capturedFocus, true, 'typing must use the post-focus element');
                    typed = '';
                },
                setValue: async (value: string) => {
                    assert.equal(capturedFocus, true, 'typing must use the post-focus element');
                    typed = value;
                },
            };
        },
    } as unknown as Browser;

    assert.equal(await openInstagramTopicReels(browser, {
        topic: 'baby sleep', searchTab: { x: 295, y: 904 }, searchField: { x: 216, y: 86 },
        screenSize: { width: 440, height: 956 }, active: () => true, delay: async () => {}, log: () => {},
    }), true);
    assert.equal(typed, 'baby sleep');
});
