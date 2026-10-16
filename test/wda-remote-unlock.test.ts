import assert from 'node:assert/strict';
import test from 'node:test';

import { WdaRemoteControl } from '../src/devices/wda-remote.js';

test('unlock wakes a Face ID device, reveals the keypad, and enters its passcode', async () => {
    const requests: Array<{ path: string; body?: unknown }> = [];
    let lockChecks = 0;
    const fetchImpl: typeof fetch = async (input, init) => {
        const path = new URL(String(input)).pathname;
        requests.push({ path, ...(init?.body ? { body: JSON.parse(String(init.body)) } : {}) });
        if (path === '/wda/locked') return Response.json({ value: lockChecks++ === 0 });
        if (path === '/wda/screen') return Response.json({ value: { screenSize: { width: 440, height: 956 }, scale: 3 } });
        if (path === '/session') return Response.json({ value: { sessionId: 'unlock-session' }, sessionId: 'unlock-session' });
        return Response.json({ value: null });
    };
    const remote = new WdaRemoteControl({
        deviceUdid: 'phone', fetchImpl, passcode: '0822',
        passcodeKeypadLayout: { columnX: [108, 220, 332], rowY: [375, 485, 594, 705] },
    });

    await remote.unlock('phone');

    assert.deepEqual(requests.map(({ path }) => path), [
        '/wda/locked', '/wda/screen', '/wda/pressButton', '/session',
        '/session/unlock-session/wda/dragfromtoforduration',
        '/wda/absolute-actions', '/wda/absolute-actions', '/wda/absolute-actions', '/wda/absolute-actions',
        '/session/unlock-session', '/wda/locked',
    ]);
    assert.deepEqual(requests[4]!.body, {
        fromX: 220, fromY: 930, toX: 220, toY: 239, duration: 0.5,
    });
});

test('unlock keeps the Home-button keypad path even when WDA waits for the passcode', async () => {
    const requests: string[] = [];
    const taps: unknown[] = [];
    let lockChecks = 0;
    const fetchImpl: typeof fetch = async (input, init) => {
        const path = new URL(String(input)).pathname;
        requests.push(path);
        if (path === '/wda/locked') return Response.json({ value: lockChecks++ === 0 });
        if (path === '/wda/screen') return Response.json({ value: { screenSize: { width: 375, height: 667 }, scale: 2 } });
        if (path === '/wda/unlock') return new Response('Passcode required', { status: 500 });
        if (path === '/wda/absolute-actions') {
            taps.push(JSON.parse(String(init?.body)));
            return Response.json({ value: null });
        }
        throw new Error(`Unexpected request on a Home-button phone: ${path}`);
    };
    const remote = new WdaRemoteControl({ deviceUdid: 'phone', fetchImpl, passcode: '0' });

    await remote.unlock('phone');

    assert.deepEqual(requests, [
        '/wda/locked', '/wda/screen', '/wda/unlock', '/wda/absolute-actions', '/wda/locked',
    ]);
    assert.equal(taps.length, 1);
});
