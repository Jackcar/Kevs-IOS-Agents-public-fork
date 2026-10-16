import type { Browser } from 'webdriverio';

import { hasInstagramReelsControls, tapCoordinate } from './actions.js';

export interface TopicSearchOptions {
    topic: string;
    searchTab: { x: number; y: number };
    searchField: { x: number; y: number };
    screenSize: { width: number; height: number };
    active(): boolean;
    delay(ms: number): Promise<void>;
    log?(message: string): void;
}

/** Open Instagram Search, submit one query, select Reels, and open the first result. */
export async function openInstagramTopicReels(browser: Browser, options: TopicSearchOptions): Promise<boolean> {
    const log = options.log ?? console.log;
    // Instagram reports its focused search TextView as not visible through
    // Appium predicates even though it is on screen, so identify that node by
    // its stable accessibility name instead of applying the visibility filter.
    const searchFieldSelector = '-ios predicate string:((type == "XCUIElementTypeSearchField" OR type == "XCUIElementTypeTextField") AND visible == 1) OR (type == "XCUIElementTypeTextView" AND name == "search-bar-text-view")';
    const findSearchTab = async () => {
        const legacy = await browser.$('~search-tab');
        return await legacy.isExisting() ? legacy : browser.$('~explore-tab');
    };
    if (!options.active()) return false;

    // A stopped Meta AI draft can leave Instagram several sheets/screens away
    // from its bottom navigation. Unwind those layers before using coordinates.
    let searchTab = await findSearchTab();
    for (let attempt = 0; options.active() && !await searchTab.isExisting() && attempt < 6; attempt++) {
        const back = await browser.$('-ios predicate string:type == "XCUIElementTypeButton" AND visible == 1 AND (label == "Dismiss" OR label == "Back" OR name == "back-button" OR name == "search-bar-back-button")');
        if (!await back.isExisting()) break;
        await back.click();
        await options.delay(350);
        searchTab = await findSearchTab();
    }
    if (!await searchTab.isExisting()) {
        log('Topic search failed: could not return to Instagram navigation');
        return false;
    }
    await searchTab.click();
    log(`Tapped Search tab using ${await searchTab.getAttribute('name') ?? 'coordinates'}`);
    await options.delay(900);
    if (!options.active()) return false;

    let field = await browser.$(searchFieldSelector);
    if (!await field.isExisting()) {
        await tapCoordinate(browser, options.searchField.x, options.searchField.y, 'Search field');
        await options.delay(500);
        field = await browser.$(searchFieldSelector);
    }
    if (!await field.isExisting() || !options.active()) {
        log('Topic search failed: search field was not found');
        return false;
    }
    await field.click();
    // Instagram replaces the Explore SearchField with a focused TextView.
    // Re-resolve it so WebdriverIO does not operate on the stale pre-focus node.
    await options.delay(300);
    field = await browser.$(searchFieldSelector);
    if (!await field.isExisting() || !options.active()) {
        log('Topic search failed: focused search field was not found');
        return false;
    }
    try { await field.clearValue(); } catch { /* Empty fields do not always support clear. */ }
    await field.setValue(options.topic);
    await options.delay(500);
    if (!options.active()) return false;
    await browser.keys('\uE007');
    await options.delay(1400);

    const topLimit = Math.round(options.screenSize.height * 0.35);
    const reelsFilter = await browser.$(`-ios predicate string:(label == "Reels" OR name == "Reels") AND visible == 1 AND rect.y < ${topLimit}`);
    if (await reelsFilter.isExisting()) {
        await reelsFilter.click();
        await options.delay(1200);
    } else {
        // Current Instagram builds show a two-column reel grid directly under
        // the selected For you filter and no longer expose a separate Reels tab.
        const forYouFilter = await browser.$(`-ios predicate string:(label == "For you" OR name == "For you") AND visible == 1 AND rect.y < ${topLimit}`);
        if (!await forYouFilter.isExisting()) {
            log('Topic search failed: neither Reels nor For you results were found');
            return false;
        }
        log('Topic search is using Instagram’s For you reel grid');
    }
    if (!options.active()) return false;

    const firstReel = await browser.$('-ios predicate string:type == "XCUIElementTypeCell" AND visible == 1 AND (name == "media-discovery-cell" OR label BEGINSWITH "Video by " OR label BEGINSWITH "Reel by ")');
    if (!await firstReel.isExisting()) {
        log('Topic search failed: no Reel result cell was found');
        return false;
    }
    await firstReel.click();
    await options.delay(1400);
    if (!options.active()) return false;
    try { return await hasInstagramReelsControls(browser, false); }
    catch { return false; }
}
