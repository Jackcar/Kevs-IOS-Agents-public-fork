import assert from 'node:assert/strict';
import test from 'node:test';
import Fastify from 'fastify';
import { initialRunAt, latestDueOccurrence, validateTiming } from '../src/scheduler/recurrence.js';
import { createInstagramPlugin } from '../src/instagram-plugin.js';
import type { CreateTaskInput, ScheduleTiming } from '../src/types.js';

test('dated intervals retain their anchor through late polling, resume, and DST', () => {
    const timing: ScheduleTiming = { kind: 'interval', everyMinutes: 360, startAt: '2026-10-03T09:00:00-04:00' };
    const before = new Date('2026-10-02T12:00:00Z');
    validateTiming(timing, before);
    const first = initialRunAt(timing, before);
    assert.equal(first.toISOString(), '2026-10-03T13:00:00.000Z');
    assert.equal(latestDueOccurrence(timing, first, before), null);
    const due = latestDueOccurrence(timing, first, new Date('2026-10-04T03:00:00Z'))!;
    assert.equal(due.scheduledFor.toISOString(), '2026-10-04T01:00:00.000Z');
    assert.equal(due.nextRunAt?.toISOString(), '2026-10-04T07:00:00.000Z');
    assert.equal(initialRunAt(timing, new Date('2026-10-04T03:00:00Z')).toISOString(), '2026-10-04T07:00:00.000Z');
    assert.equal(initialRunAt(timing, new Date('2026-10-04T07:00:00Z')).toISOString(), '2026-10-04T07:00:00.000Z');
    assert.equal(initialRunAt({ kind: 'interval', everyMinutes: 15, startOffsetMinutes: 10 }, before).getTime(), before.getTime() + 600_000);
    const dst: ScheduleTiming = { kind: 'interval', everyMinutes: 120, startAt: '2026-11-01T00:30:00-04:00' };
    assert.equal(initialRunAt(dst, new Date('2026-11-01T05:00:00Z')).toISOString(), '2026-11-01T06:30:00.000Z');
    validateTiming({ kind: 'interval', everyMinutes: 48 * 60, startAt: timing.startAt });
    for (const invalid of [
        { ...timing, everyMinutes: 0 }, { ...timing, everyMinutes: 1.5 },
        { ...timing, everyMinutes: 43_201 }, { ...timing, startAt: '' },
        { ...timing, startAt: 'invalid' }, { ...timing, startAt: 123 },
        { ...timing, startOffsetMinutes: 10 },
    ]) assert.throws(() => validateTiming(invalid as ScheduleTiming));
});

test('Instagram interval form sends hours and start date to the scheduler and reports invalid input', async (context) => {
    const app = Fastify();
    context.after(() => app.close());
    const created: CreateTaskInput[] = [];
    const plugin = createInstagramPlugin();
    await plugin.registerRoutes!({
        app, loadDevices: async () => [{ udid: 'test-phone', pluginData: {} }],
        scheduler: { createTask: async (input: CreateTaskInput) => {
            validateTiming(input.timing);
            created.push(input);
            return { id: 'test-schedule' };
        }, listExecutions: async () => [], clearDeviceQueue: async () => 0 },
        renderActivity: async (_udid: string, error?: string) => error ?? 'Scheduled',
    } as never);
    const payload = { scheduleKind: 'interval', everyHours: '6', runAt: '2026-10-03T13:00:00Z',
        durationMinutes: '5', personality: 'casual', likeEnabled: 'on', commentMode: 'meta-ai',
        commentNiche: 'baby sleep' };
    for (const route of ['scroll-run', 'following-scroll-run']) {
        const response = await app.inject({ method: 'POST', url: `/api/devices/test-phone/instagram/fragments/${route}`, payload });
        assert.equal(response.statusCode, 202);
        assert.deepEqual(created.at(-1)?.timing, { kind: 'interval', everyMinutes: 360, startAt: payload.runAt });
        assert.equal(created.at(-1)?.task.payload.commentNiche, 'baby sleep');
    }
    const invalid = await app.inject({ method: 'POST', url: '/api/devices/test-phone/instagram/fragments/scroll-run',
        payload: { ...payload, runAt: '' } });
    assert.equal(invalid.statusCode, 409);
    assert.match(invalid.body, /startAt/);
    assert.equal(created.length, 2);

    const topic = await app.inject({ method: 'POST',
        url: '/api/devices/test-phone/instagram/fragments/topic-engagement-run',
        payload: { durationMinutes: '30', personality: 'engaged', likeEnabled: 'on',
            watchToEndConfigured: 'true', watchToEndEnabled: 'on', searchTopic: 'baby sleep training',
            commentText: 'Dreamer helped us identify a consistent bedtime pattern.' } });
    assert.equal(topic.statusCode, 202);
    assert.equal(created.at(-1)?.task.taskType, 'topic-engagement');
    assert.equal(created.at(-1)?.task.payload.searchTopic, 'baby sleep training');
    assert.deepEqual(created.at(-1)?.timing, { kind: 'now' });
});
