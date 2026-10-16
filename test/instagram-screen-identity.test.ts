import assert from 'node:assert/strict';
import test from 'node:test';

import sharp from 'sharp';

import { detectHomeFeedTab, identifyInstagramScreen } from '../src/instagram/screen-identity.js';

async function solid(width: number, height: number, rgb: [number, number, number]): Promise<Buffer> {
    return sharp({
        create: { width, height, channels: 3, background: { r: rgb[0], g: rgb[1], b: rgb[2] } },
    }).png().toBuffer();
}

function label(text: string, width: number, height: number, color: string): Buffer {
    return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><text x="4" y="30" font-family="Arial" font-size="28" fill="${color}">${text}</text></svg>`);
}

test('a white Home header is not a Search field or a Reels feed', async () => {
    const frame = await sharp({ create: {
        width: 430, height: 932, channels: 3, background: '#fafafa',
    } }).composite([
        { input: await solid(14, 14, [20, 20, 22]), left: 43, top: 875 },
        { input: await solid(14, 14, [20, 20, 22]), left: 129, top: 875 },
    ]).png().toBuffer();
    const identity = await identifyInstagramScreen(frame, 1);
    assert.equal(identity.kind, 'home');
    assert.ok(identity.reasons.includes('lightHeaderWithoutSearchField'));
});

test('bright Reels frames use header text before the Search brightness heuristic', async () => {
    const frame = await sharp({ create: {
        width: 430, height: 932, channels: 3, background: '#fafafa',
    } }).composite([
        { input: label('Reels', 100, 40, '#101010'), left: 125, top: 68 },
        { input: label('Friends', 130, 40, '#999999'), left: 225, top: 68 },
        { input: await solid(14, 14, [20, 20, 22]), left: 129, top: 875 },
    ]).png().toBuffer();
    const identity = await identifyInstagramScreen(frame, 1);
    assert.equal(identity.kind, 'reels');
    assert.ok(identity.reasons.includes('reelsHeaderText'));
});

test('Search requires a visible Search label in the header', async () => {
    const frame = await sharp({ create: {
        width: 430, height: 932, channels: 3, background: '#fafafa',
    } }).composite([
        { input: label('Search', 150, 40, '#101010'), left: 40, top: 68 },
    ]).png().toBuffer();
    assert.equal((await identifyInstagramScreen(frame, 1)).kind, 'search');
});

test('dark comment sheets are recognized by their composer', async () => {
    const frame = await sharp({ create: {
        width: 430, height: 932, channels: 3, background: '#191d1e',
    } }).composite([
        { input: label('Add a comment', 300, 40, '#eeeeee'), left: 70, top: 790 },
    ]).png().toBuffer();
    const identity = await identifyInstagramScreen(frame, 1);
    assert.equal(identity.kind, 'comments');
    assert.ok(identity.reasons.includes('commentComposer'));
});

test('identifyInstagramScreen treats unrecognized frames as off_feed', async () => {
    const frame = await sharp({
        create: { width: 402, height: 874, channels: 3, background: { r: 100, g: 120, b: 150 } },
    }).png().toBuffer();
    const identity = await identifyInstagramScreen(frame, 1);
    assert.equal(identity.kind, 'off_feed');
});

test('identifyInstagramScreen prefers Reels when preferredFeed is reels', async () => {
    const width = 402;
    const height = 874;
    const base = await sharp({
        create: { width, height, channels: 3, background: { r: 30, g: 32, b: 38 } },
    }).png().toBuffer();
    const bar = await solid(402, 70, [250, 250, 252]);
    const icon = await solid(14, 14, [20, 20, 22]);
    const composed = await sharp(base)
        .composite([
            { input: bar, left: 0, top: 804 },
            { input: icon, left: 40, top: 830 },
            { input: icon, left: 120, top: 830 },
            { input: icon, left: 200, top: 830 },
            { input: icon, left: 280, top: 830 },
            { input: icon, left: 360, top: 830 },
        ])
        .png()
        .toBuffer();
    const identity = await identifyInstagramScreen(composed, 1, undefined, { preferredFeed: 'reels' });
    assert.equal(identity.kind, 'reels');
    assert.ok(identity.reasons.some((reason) => reason.includes('preferredReels') || reason.includes('instagramTabBar')));
});

test('identifyInstagramScreen prefers Following when preferredFeed is following', async () => {
    const width = 402;
    const height = 874;
    const base = await sharp({
        create: { width, height, channels: 3, background: { r: 30, g: 32, b: 38 } },
    }).png().toBuffer();
    const bar = await solid(402, 70, [250, 250, 252]);
    const icon = await solid(14, 14, [20, 20, 22]);
    const composed = await sharp(base)
        .composite([
            { input: bar, left: 0, top: 804 },
            { input: icon, left: 40, top: 830 },
            { input: icon, left: 120, top: 830 },
            { input: icon, left: 200, top: 830 },
            { input: icon, left: 280, top: 830 },
            { input: icon, left: 360, top: 830 },
        ])
        .png()
        .toBuffer();
    const identity = await identifyInstagramScreen(composed, 1, undefined, { preferredFeed: 'following' });
    assert.equal(identity.kind, 'following');
    assert.ok(identity.reasons.some((reason) => reason.includes('PreferredFollowing') || reason.includes('instagramTabBar')));
});

test('identifyInstagramScreen treats Reels header Friends as following when preferred', async () => {
    const width = 402;
    const height = 874;
    const base = await sharp({
        create: { width, height, channels: 3, background: { r: 20, g: 20, b: 24 } },
    }).png().toBuffer();
    // Bright Friends ink on the right of Reels|Friends.
    const bright = await solid(110, 28, [250, 250, 252]);
    const dim = await solid(90, 28, [90, 90, 95]);
    const composed = await sharp(base)
        .composite([
            { input: dim, left: 90, top: 60 },
            { input: bright, left: 200, top: 60 },
            { input: await solid(402, 70, [18, 18, 20]), left: 0, top: 804 },
        ])
        .png()
        .toBuffer();
    const identity = await identifyInstagramScreen(composed, 1, undefined, { preferredFeed: 'following' });
    assert.equal(identity.kind, 'following');
    assert.ok(identity.reasons.includes('friendsTabSelected'));
});

test('detectHomeFeedTab maps bright right Reels header to following/friends', async () => {
    const width = 402;
    const height = 874;
    const base = await sharp({
        create: { width, height, channels: 3, background: { r: 20, g: 20, b: 24 } },
    }).png().toBuffer();
    const bright = await solid(110, 28, [250, 250, 252]);
    const dim = await solid(90, 28, [90, 90, 95]);
    const composed = await sharp(base)
        .composite([
            { input: dim, left: 90, top: 60 },
            { input: bright, left: 200, top: 60 },
            { input: await solid(402, 70, [18, 18, 20]), left: 0, top: 804 },
        ])
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });
    const tab = detectHomeFeedTab({
        data: composed.data,
        width: composed.info.width,
        height: composed.info.height,
        channels: composed.info.channels,
    });
    assert.equal(tab, 'following');
});

test('identifyInstagramScreen flags springboard-like icon grids as off_feed', async () => {
    const width = 402;
    const height = 874;
    const base = await sharp({
        create: { width, height, channels: 3, background: { r: 28, g: 90, b: 160 } },
    }).png().toBuffer();
    const icon = await solid(36, 36, [240, 80, 60]);
    const composites = [];
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            composites.push({
                input: icon,
                left: 40 + col * 90,
                top: 180 + row * 110,
            });
        }
    }
    const composed = await sharp(base).composite(composites).png().toBuffer();
    const identity = await identifyInstagramScreen(composed, 1);
    assert.equal(identity.kind, 'off_feed');
});
