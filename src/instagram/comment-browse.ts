import type { Browser } from 'webdriverio';

import { tapCoordinate, tapInstagramButton } from './actions.js';
import { readUiNodes, type UiNode } from './reel-context.js';

export function commentLikeTargets(source: string, screen: { width: number; height: number }): UiNode[] {
    const nodes = readUiNodes(source);
    const composerY = nodes.find((node) => node.visible && node.name === 'text-view')?.y
        ?? screen.height * 0.9;
    return nodes.filter((node) => {
        const text = `${node.name} ${node.label}`;
        return node.visible && node.accessible && node.type === 'XCUIElementTypeButton'
            && /\blike\b/i.test(text) && !/\bunlike\b/i.test(text)
            && node.name !== 'like-button' && node.name !== 'ufi-like-button'
            && node.x > screen.width * 0.65 && node.y > screen.height * 0.3
            && node.y + node.height < composerY && node.width <= screen.width * 0.25;
    });
}

export interface BrowseCommentsOptions {
    screen: { width: number; height: number };
    comment: { x: number; y: number };
    active: () => boolean;
    isOpen: () => Promise<boolean>;
    delay: (ms: number) => Promise<void>;
    random?: () => number;
}

/** Open a Reel's comments, read several viewports, and like one to three comments. */
export async function browseReelComments(browser: Browser, options: BrowseCommentsOptions): Promise<number> {
    const random = options.random ?? Math.random;
    const targetLikes = 1 + Math.floor(random() * 3);
    const scrolls = 2 + Math.floor(random() * 3);
    let likes = 0;

    await tapInstagramButton(browser, 'comment-button', options.comment.x, options.comment.y, 'Comments');
    await options.delay(900);
    if (!options.active() || !await options.isOpen()) return 0;
    for (let page = 0; options.active() && page <= scrolls; page += 1) {
        const targets = commentLikeTargets(await browser.getPageSource(), options.screen);
        if (likes < targetLikes && targets.length) {
            const target = targets[Math.floor(random() * targets.length)];
            await tapCoordinate(browser, Math.round(target.x + target.width / 2),
                Math.round(target.y + target.height / 2), 'Comment like');
            likes += 1;
            await options.delay(500 + Math.floor(random() * 500));
        }
        if (page === scrolls || !options.active()) break;
        const x = Math.round(options.screen.width * 0.5);
        await browser.performActions([{ type: 'pointer', id: 'comment-scroll', parameters: { pointerType: 'touch' },
            actions: [{ type: 'pointerMove', duration: 0, x, y: Math.round(options.screen.height * 0.77) },
                { type: 'pointerDown', button: 0 }, { type: 'pause', duration: 80 },
                { type: 'pointerMove', duration: 420, x, y: Math.round(options.screen.height * 0.43) },
                { type: 'pointerUp', button: 0 }] }]);
        await browser.releaseActions();
        await options.delay(650 + Math.floor(random() * 500));
    }
    return likes;
}
