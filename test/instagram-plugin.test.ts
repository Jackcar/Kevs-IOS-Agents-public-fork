import assert from 'node:assert/strict';
import test from 'node:test';

import { PluginRegistry } from '../src/registry.js';
import { createInstagramPlugin } from '../src/instagram-plugin.js';

const plugin = createInstagramPlugin({ doomscrollEntrypoint: '/example/doomscroll.js', postEntrypoint: '/example/post.js' });

test('built-in Instagram plugin validates versioned doomscroll tasks', () => {
    assert.equal(plugin.id, 'com.git-agni.instagram');
    const registry = new PluginRegistry([plugin]);
    const value = registry.validate({
        deviceUdid: 'device-12345678',
        task: {
            pluginId: plugin.id, taskType: 'doomscroll', taskVersion: 1,
            payload: { durationMinutes: 5, personality: 'casual', likeEnabled: true, commentEnabled: false },
        },
        timing: { kind: 'daily', localTime: '09:00', timezone: 'Asia/Kolkata' },
    });
    assert.equal(value.task.payload.durationMinutes, 5);
    assert.equal(value.task.payload.watchToEndEnabled, true);
    const task = plugin.tasks.find((entry) => entry.type === 'doomscroll' && entry.version === 1)!;
    assert.equal(task.summarize(value.task.payload as never), 'Warmup · casual · 5 min');
});

test('Instagram completion watching can be disabled and is passed to both Reels tasks', async () => {
    for (const type of ['doomscroll', 'doomscroll-following']) {
        const task = plugin.tasks.find((entry) => entry.type === type)!;
        const payload = task.validate({ durationMinutes: 5, personality: 'casual',
            likeEnabled: false, commentEnabled: false, watchToEndEnabled: false }, { timingKind: 'now', devicePluginData: {} });
        assert.equal(payload.watchToEndEnabled, false);
        assert.throws(() => task.validate({ ...payload, watchToEndEnabled: 'false' }, { timingKind: 'now', devicePluginData: {} }), /watchToEndEnabled/);
        let watchEnabled: string | undefined;
        await task.execute({
            device: { udid: 'device-12345678' },
            runProcess: async (specification: { env: Record<string, string> }) => {
                watchEnabled = specification.env.DOOMSCROLL_WATCH_TO_END_ENABLED;
                return { exitCode: 0, stopped: false };
            },
        } as never, payload as never);
        assert.equal(watchEnabled, 'false');
    }
});

test('Instagram doomscroll requires commentText when commenting', () => {
    const registry = new PluginRegistry([plugin]);
    assert.throws(() => registry.validate({
        deviceUdid: 'device-12345678',
        task: {
            pluginId: plugin.id, taskType: 'doomscroll', taskVersion: 1,
            payload: {
                durationMinutes: 5, personality: 'dialed', likeEnabled: true, commentEnabled: true,
            },
        },
        timing: { kind: 'now' },
    }), /commentText/);
    const ok = registry.validate({
        deviceUdid: 'device-12345678',
        task: {
            pluginId: plugin.id, taskType: 'doomscroll', taskVersion: 1,
            payload: {
                durationMinutes: 5, personality: 'dialed', likeEnabled: true,
                commentEnabled: true, commentText: '🔥',
            },
        },
        timing: { kind: 'now' },
    });
    assert.equal(ok.task.payload.commentEnabled, true);
    assert.equal(ok.task.payload.commentText, '🔥');
});

test('both Instagram tasks accept optional contextual source text and pass the mode', async () => {
    for (const type of ['doomscroll', 'doomscroll-following']) {
        const task = plugin.tasks.find((entry) => entry.type === type)!;
        const context = { timingKind: 'now' as const, devicePluginData: {} };
        const input = { durationMinutes: 5, personality: 'casual', likeEnabled: true,
            commentEnabled: true, commentMode: 'meta-ai', commentText: 'Dreamer helped us see a consistent bedtime pattern.' };
        const payload = task.validate(input, context);
        assert.equal(payload.commentMode, 'meta-ai');
        assert.equal(task.validate({ ...input, commentText: '' }, context).commentText, undefined);
        assert.doesNotThrow(() => task.validate({ ...input, commentText: 'a'.repeat(240) }, context));
        assert.throws(() => task.validate({ ...input, commentText: 'a'.repeat(241) }, context), /240/);
        assert.throws(() => task.validate({ ...input, commentMode: 'unknown' }, context), /commentMode/);
        const legacy = task.validate({ ...input, commentMode: 'preset', commentText: 'Nice one' }, context);
        assert.equal(legacy.commentMode, 'preset');
        let mode: string | undefined;
        await task.execute({ device: { udid: 'device-12345678' },
            runProcess: async (spec: { env: Record<string, string> }) => {
                mode = spec.env.DOOMSCROLL_COMMENT_MODE;
                return { exitCode: 0, stopped: false };
            },
        } as never, payload as never);
        assert.equal(mode, 'meta-ai');
    }
});

test('both Instagram tasks persist and pass an optional comment niche', async () => {
    for (const type of ['doomscroll', 'doomscroll-following']) {
        const task = plugin.tasks.find((entry) => entry.type === type)!;
        const context = { timingKind: 'now' as const, devicePluginData: {} };
        const input = { durationMinutes: 5, personality: 'casual', likeEnabled: true,
            commentEnabled: true, commentMode: 'meta-ai', commentNiche: ' baby, sleep training, baby sleep tips ',
            commentText: 'Dreamer helped us understand our baby’s sleep windows.' };
        const payload = task.validate(input, context);
        assert.equal(payload.commentNiche, 'baby, sleep training, baby sleep tips');
        assert.equal(task.validate({ ...input, commentNiche: '  ' }, context).commentNiche, undefined);
        assert.throws(() => task.validate({ ...input, commentNiche: 123 }, context), /commentNiche/);
        assert.throws(() => task.validate({ ...input, commentNiche: 'a'.repeat(161) }, context), /160/);
        assert.equal(task.validate({ ...input, commentMode: 'preset', commentText: 'Cute!' }, context).commentNiche,
            'baby, sleep training, baby sleep tips');
        let niche: string | undefined;
        await task.execute({ device: { udid: 'device-12345678' },
            runProcess: async (spec: { env: Record<string, string> }) => {
                niche = spec.env.DOOMSCROLL_COMMENT_NICHE;
                return { exitCode: 0, stopped: false };
            },
        } as never, payload as never);
        assert.equal(niche, 'baby, sleep training, baby sleep tips');
    }
});

test('Instagram engage following validates like versioned tasks', () => {
    const registry = new PluginRegistry([plugin]);
    const value = registry.validate({
        deviceUdid: 'device-12345678',
        task: {
            pluginId: plugin.id, taskType: 'doomscroll-following', taskVersion: 1,
            payload: {
                durationMinutes: 3, personality: 'dialed', likeEnabled: true,
                commentEnabled: true, commentText: '🔥',
            },
        },
        timing: { kind: 'now' },
    });
    assert.equal(value.task.taskType, 'doomscroll-following');
    const task = plugin.tasks.find((entry) => entry.type === 'doomscroll-following' && entry.version === 1)!;
    assert.equal(task.summarize(value.task.payload as never), 'Engage following · dialed · 3 min');
});

test('Instagram supports runs up to six hours', () => {
    const task = plugin.tasks.find((entry) => entry.type === 'doomscroll')!;
    const context = { timingKind: 'now' as const, devicePluginData: {} };
    const base = { personality: 'casual', likeEnabled: false, commentEnabled: false };
    assert.equal(task.validate({ ...base, durationMinutes: 360 }, context).durationMinutes, 360);
    assert.throws(() => task.validate({ ...base, durationMinutes: 361 }, context), /360/);
});

test('Instagram topic engagement requires a query and passes search configuration to the Reels runner', async () => {
    const task = plugin.tasks.find((entry) => entry.type === 'topic-engagement')!;
    const context = { timingKind: 'now' as const, devicePluginData: {} };
    const input = { durationMinutes: 30, personality: 'engaged', likeEnabled: true,
        commentText: 'Dreamer helped us identify a consistent bedtime pattern.', searchTopic: ' baby sleep training ' };
    const payload = task.validate(input, context);
    assert.equal(payload.searchTopic, 'baby sleep training');
    assert.equal(payload.commentEnabled, true);
    assert.equal(payload.commentMode, 'meta-ai');
    assert.equal(payload.commentNiche, undefined);
    assert.equal(task.validate({ ...input, commentText: '' }, context).commentText, undefined);
    assert.throws(() => task.validate({ ...input, searchTopic: '' }, context), /searchTopic/);
    assert.throws(() => task.validate({ ...input, searchTopic: 'x'.repeat(101) }, context), /100/);
    let env: Record<string, string> = {};
    await task.execute({ device: { udid: 'device-12345678' },
        runProcess: async (spec: { env: Record<string, string> }) => {
            env = spec.env;
            return { exitCode: 0, stopped: false };
        },
    } as never, payload as never);
    assert.equal(env.DOOMSCROLL_SEARCH_TOPIC, 'baby sleep training');
    assert.equal(env.DOOMSCROLL_COMMENT_NICHE, '');
    assert.equal(env.DOOMSCROLL_COMMENT_EVERY_REEL, 'true');
    assert.equal(env.DOOMSCROLL_COMMENT_MODE, 'meta-ai');
});

test('Instagram recurring public posts require confirmation', () => {
    const registry = new PluginRegistry([plugin]);
    assert.throws(() => registry.validate({
        deviceUdid: 'device-12345678',
        task: {
            pluginId: plugin.id, taskType: 'post', taskVersion: 1,
            payload: {
                media: [{ assetId: 'asset-1', name: 'x.jpg', mimeType: 'image/jpeg' }],
                destination: 'publish', account: '@test',
            },
        },
        timing: { kind: 'daily', localTime: '10:00', timezone: 'Asia/Kolkata' },
    }), /explicit confirmation/);
    const ok = registry.validate({
        deviceUdid: 'device-12345678',
        task: {
            pluginId: plugin.id, taskType: 'post', taskVersion: 1,
            payload: {
                media: [{ assetId: 'asset-1', name: 'x.jpg', mimeType: 'image/jpeg' }],
                destination: 'publish', account: '@test', recurringPublishConfirmed: true,
            },
        },
        timing: { kind: 'daily', localTime: '10:00', timezone: 'Asia/Kolkata' },
    });
    assert.equal(ok.task.payload.destination, 'publish');
});
