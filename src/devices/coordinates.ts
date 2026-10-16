import {
    LINKEDIN_CALIBRATABLE_POINTS, LINKEDIN_POINT_LABELS, linkedinForScreen,
    type LinkedInCalibratablePoint, type LinkedInCoordinates,
} from '../linkedin/coordinates.js';

export {
    LINKEDIN_BUNDLE_ID, LINKEDIN_CALIBRATABLE_POINTS, LINKEDIN_IPHONE13, LINKEDIN_POINT_LABELS,
    linkedinForScreen, scaleLinkedIn,
    type LinkedInCalibratablePoint, type LinkedInCoordinates,
} from '../linkedin/coordinates.js';

export interface Point {
    x: number;
    y: number;
}

/** Shared tap targets for a social app automation surface (TikTok / Instagram). */
export interface SocialAppCoordinates {
    profileTab: Point;
    homeTab: Point;
    accountSwitcher: Point;
    create: Point;
    /** Instagram create-sheet "Post" tile (after +). Unused on TikTok. */
    postContent: Point;
    upload: Point;
    selectMultiple: Point;
    useLayout: Point;
    picker: {
        circleX: number;
        columnStep: number;
        firstY: number;
        trayY: number;
        rowStep: number;
        cellX: number;
        cellStep: number;
        cellY: number;
    };
    pickerNext: Point;
    editorNext: Point;
    caption: Point;
    keyboardBack: Point;
    draft: Point;
    finish: Point;
    like: Point;
    save: Point;
    /** Home feed "Following" sub-tab (TikTok / Instagram). */
    followingTab: Point;
    /** Instagram bottom-nav Reels tab (4th of 5). Unused on TikTok. */
    reelsTab: Point;
    /** Instagram bottom-nav Search tab (2nd of 5). Unused on TikTok. */
    searchTab: Point;
    /** Instagram Explore search field. Unused on TikTok. */
    searchField: Point;
    /** First Accounts row after typing a handle. Unused on TikTok. */
    searchFirstResult: Point;
    /** Blue arrow on New message To: field after typing a handle. Unused on TikTok. */
    dmSearchSubmit: Point;
    /** Profile "Message" button. Unused on TikTok. */
    profileMessage: Point;
    /** Instagram bottom-nav Messages / inbox tab. Unused on TikTok. */
    dmCompose: Point;
    /** Inbox header "compose new message" (pencil). Unused on TikTok. */
    composeNewMessage: Point;
    /** DM thread composer field. Unused on TikTok. */
    dmComposer: Point;
    /** Send control after typing in a DM thread. Unused on TikTok. */
    dmSend: Point;
    /** Leave DM thread without sending. Unused on TikTok. */
    dmBack: Point;
    /** Open comments on the current video. */
    comment: Point;
    /** Comment sheet text field. */
    commentComposer: Point;
    /** Comment sheet send / post control. */
    commentSend: Point;
    /** Close (X) control on TikTok Live viewer — top-right under the status bar. */
    liveClose: Point;
    swipe: {
        x: number;
        startY: number;
        endY: number;
        durationMs: number;
    };
}

export type SocialAppName = 'tiktok' | 'instagram';
export type CalibrateApp = SocialAppName | 'linkedin';

export interface DeviceCoordinates {
    displayName: string;
    productTypes: readonly string[];
    screenSize: {
        width: number;
        height: number;
    };
    passcodeKeypad: {
        columnX: [number, number, number];
        rowY: [number, number, number, number];
    };
    tiktok: SocialAppCoordinates;
    instagram: SocialAppCoordinates;
    linkedin: LinkedInCoordinates;
}

export const DEFAULT_COORDINATE_PROFILE = 'iphone8';

const IPHONE8_TIKTOK: SocialAppCoordinates = {
    profileTab: { x: 338, y: 656 },
    homeTab: { x: 38, y: 653 },
    accountSwitcher: { x: 185, y: 158 },
    create: { x: 187, y: 640 },
    postContent: { x: 187, y: 640 },
    // Camera sheet · Recents thumbnail (bottom-left), not the top Sounds chip.
    upload: { x: 48, y: 590 },
    selectMultiple: { x: 24, y: 618 },
    useLayout: { x: 24, y: 489 },
    picker: {
        circleX: 106,
        columnStep: 126,
        firstY: 482,
        trayY: 360,
        rowStep: 125,
        cellX: 62,
        cellStep: 125,
        cellY: 526,
    },
    pickerNext: { x: 277, y: 617 },
    editorNext: { x: 277, y: 637 },
    caption: { x: 120, y: 236 },
    keyboardBack: { x: 22, y: 42 },
    draft: { x: 98, y: 630 },
    finish: { x: 277, y: 630 },
    like: { x: 345, y: 313 },
    save: { x: 345, y: 444 },
    followingTab: { x: 95, y: 78 },
    reelsTab: { x: 262, y: 653 },
    // Unused on TikTok — placeholders keep SocialAppCoordinates shared.
    searchTab: { x: 112, y: 653 },
    searchField: { x: 187, y: 90 },
    searchFirstResult: { x: 100, y: 220 },
    dmSearchSubmit: { x: 340, y: 90 },
    profileMessage: { x: 280, y: 420 },
    dmCompose: { x: 187, y: 653 },
    composeNewMessage: { x: 350, y: 55 },
    dmComposer: { x: 180, y: 620 },
    dmSend: { x: 350, y: 620 },
    dmBack: { x: 22, y: 42 },
    comment: { x: 345, y: 378 },
    commentComposer: { x: 140, y: 620 },
    commentSend: { x: 340, y: 620 },
    liveClose: { x: 351, y: 70 },
    swipe: { x: 187, startY: 550, endY: 150, durationMs: 450 },
};

// Instagram bottom tabs: Home / Search / Create / Reels / Profile — seeded
// from live-ish layouts; recalibrate via the dashboard before production use.
const IPHONE8_INSTAGRAM: SocialAppCoordinates = {
    profileTab: { x: 337, y: 650 },
    homeTab: { x: 37, y: 650 },
    accountSwitcher: { x: 48, y: 72 },
    create: { x: 187, y: 650 },
    // Create-sheet "Post" option (left tile) after tapping +.
    postContent: { x: 70, y: 580 },
    upload: { x: 70, y: 620 },
    selectMultiple: { x: 340, y: 70 },
    useLayout: { x: 187, y: 520 },
    picker: {
        circleX: 62,
        columnStep: 125,
        firstY: 180,
        trayY: 400,
        rowStep: 125,
        cellX: 62,
        cellStep: 125,
        cellY: 180,
    },
    pickerNext: { x: 340, y: 70 },
    editorNext: { x: 340, y: 70 },
    caption: { x: 100, y: 200 },
    keyboardBack: { x: 22, y: 42 },
    draft: { x: 80, y: 70 },
    finish: { x: 340, y: 70 },
    // Reels For You right rail (heart / comment / bookmark). Home-feed
    // left-rail targets come later for the Following twin.
    like: { x: 345, y: 360 },
    save: { x: 345, y: 500 },
    followingTab: { x: 95, y: 78 },
    // Bottom nav: Home · Search · Create · Reels · Profile
    reelsTab: { x: 262, y: 650 },
    searchTab: { x: 112, y: 650 },
    searchField: { x: 187, y: 90 },
    searchFirstResult: { x: 100, y: 220 },
    dmSearchSubmit: { x: 340, y: 90 },
    profileMessage: { x: 280, y: 420 },
    // Messages / inbox tab (paper plane) — layout varies; recalibrate.
    dmCompose: { x: 187, y: 650 },
    composeNewMessage: { x: 350, y: 55 },
    dmComposer: { x: 180, y: 620 },
    dmSend: { x: 350, y: 620 },
    dmBack: { x: 22, y: 42 },
    comment: { x: 345, y: 430 },
    commentComposer: { x: 140, y: 600 },
    commentSend: { x: 340, y: 600 },
    liveClose: { x: 351, y: 70 },
    swipe: { x: 187, startY: 550, endY: 180, durationMs: 450 },
};

function scaleSocial(base: SocialAppCoordinates, sx: number, sy: number): SocialAppCoordinates {
    const p = (pt: Point): Point => ({ x: Math.round(pt.x * sx), y: Math.round(pt.y * sy) });
    return {
        profileTab: p(base.profileTab),
        homeTab: p(base.homeTab),
        accountSwitcher: p(base.accountSwitcher),
        create: p(base.create),
        postContent: p(base.postContent),
        upload: p(base.upload),
        selectMultiple: p(base.selectMultiple),
        useLayout: p(base.useLayout),
        picker: {
            circleX: Math.round(base.picker.circleX * sx),
            columnStep: Math.round(base.picker.columnStep * sx),
            firstY: Math.round(base.picker.firstY * sy),
            trayY: Math.round(base.picker.trayY * sy),
            rowStep: Math.round(base.picker.rowStep * sy),
            cellX: Math.round(base.picker.cellX * sx),
            cellStep: Math.round(base.picker.cellStep * sx),
            cellY: Math.round(base.picker.cellY * sy),
        },
        pickerNext: p(base.pickerNext),
        editorNext: p(base.editorNext),
        caption: p(base.caption),
        keyboardBack: p(base.keyboardBack),
        draft: p(base.draft),
        finish: p(base.finish),
        like: p(base.like),
        save: p(base.save),
        followingTab: p(base.followingTab),
        reelsTab: p(base.reelsTab),
        searchTab: p(base.searchTab),
        searchField: p(base.searchField),
        searchFirstResult: p(base.searchFirstResult),
        dmSearchSubmit: p(base.dmSearchSubmit),
        profileMessage: p(base.profileMessage),
        dmCompose: p(base.dmCompose),
        composeNewMessage: p(base.composeNewMessage),
        dmComposer: p(base.dmComposer),
        dmSend: p(base.dmSend),
        dmBack: p(base.dmBack),
        comment: p(base.comment),
        commentComposer: p(base.commentComposer),
        commentSend: p(base.commentSend),
        liveClose: p(base.liveClose),
        swipe: {
            x: Math.round(base.swipe.x * sx),
            startY: Math.round(base.swipe.startY * sy),
            endY: Math.round(base.swipe.endY * sy),
            durationMs: base.swipe.durationMs,
        },
    };
}

const SX_X = 375 / 375;
const SY_X = 812 / 667;
const SX_13 = 390 / 375;
const SY_13 = 844 / 667;
const SX_17 = 402 / 375;
const SY_17 = 874 / 667;

// Add another named layout here, then set that key as coordinateProfile on
// the matching devices.json entry. Devices without a key use iphone8.
export const DEVICE_COORDINATES = {
    // ponytail: scaled seed; calibrate workflow targets on the physical device.
    iphone16promax: {
        displayName: "iPhone 16 Pro Max",
        productTypes: ['iPhone17,2'],
        screenSize: { width: 440, height: 956 },
        passcodeKeypad: {
            columnX: [108, 220, 332],
            rowY: [375, 485, 594, 705]
        },
        tiktok: {
            profileTab: { x: 396, y: 941 },
            homeTab: { x: 45, y: 937 },
            accountSwitcher: { x: 217, y: 227 },
            create: { x: 225, y: 894 },
            postContent: { x: 219, y: 918 },
            upload: { x: 60, y: 842 },
            selectMultiple: { x: 29, y: 886 },
            useLayout: { x: 29, y: 702 },
            picker: { circleX: 73, columnStep: 147, firstY: 251, trayY: 516, rowStep: 148, cellX: 73, cellStep: 146, cellY: 251 },
            pickerNext: { x: 325, y: 884 },
            editorNext: { x: 325, y: 913 },
            caption: { x: 141, y: 338 },
            keyboardBack: { x: 27, y: 61 },
            draft: { x: 115, y: 904 },
            finish: { x: 325, y: 904 },
            like: { x: 407, y: 497 },
            save: { x: 407, y: 629 },
            followingTab: { x: 178, y: 96 },
            reelsTab: { x: 308, y: 937 },
            searchTab: { x: 131, y: 937 },
            searchField: { x: 219, y: 129 },
            searchFirstResult: { x: 117, y: 315 },
            dmSearchSubmit: { x: 398, y: 129 },
            profileMessage: { x: 328, y: 601 },
            dmCompose: { x: 219, y: 937 },
            composeNewMessage: { x: 410, y: 79 },
            dmComposer: { x: 211, y: 888 },
            dmSend: { x: 410, y: 888 },
            dmBack: { x: 27, y: 61 },
            comment: { x: 405, y: 604 },
            commentComposer: { x: 164, y: 888 },
            commentSend: { x: 398, y: 888 },
            liveClose: { x: 422, y: 68 },
            swipe: { x: 142, startY: 789, endY: 215, durationMs: 380 }
        },
        instagram: {
            profileTab: { x: 396, y: 897 },
            homeTab: { x: 44, y: 897 },
            accountSwitcher: { x: 56, y: 103 },
            create: { x: 225, y: 903 },
            postContent: { x: 82, y: 831 },
            upload: { x: 82, y: 888 },
            selectMultiple: { x: 398, y: 101 },
            useLayout: { x: 219, y: 745 },
            picker: { circleX: 73, columnStep: 146, firstY: 258, trayY: 573, rowStep: 180, cellX: 73, cellStep: 146, cellY: 258 },
            pickerNext: { x: 398, y: 101 },
            editorNext: { x: 381, y: 903 },
            caption: { x: 117, y: 286 },
            keyboardBack: { x: 27, y: 61 },
            draft: { x: 94, y: 101 },
            finish: { x: 398, y: 101 },
            like: { x: 407, y: 490 },
            save: { x: 407, y: 700 },
            followingTab: { x: 259, y: 87 },
            reelsTab: { x: 132, y: 897 },
            searchTab: { x: 308, y: 897 },
            searchField: { x: 219, y: 110 },
            searchFirstResult: { x: 220, y: 251 },
            dmSearchSubmit: { x: 405, y: 110 },
            profileMessage: { x: 328, y: 569 },
            dmCompose: { x: 220, y: 903 },
            composeNewMessage: { x: 413, y: 85 },
            dmComposer: { x: 175, y: 569 },
            dmSend: { x: 394, y: 569 },
            dmBack: { x: 27, y: 61 },
            comment: { x: 407, y: 564 },
            commentComposer: { x: 164, y: 897 },
            commentSend: { x: 398, y: 622 },
            liveClose: { x: 411, y: 101 },
            swipe: { x: 142, startY: 789, endY: 215, durationMs: 380 }
        },
        linkedin: linkedinForScreen({ width: 440, height: 956 }),
    },
    // Seeded from the iPhone 17 Pro layout; calibrate workflow targets on-device.
    iphone14promax: {
        displayName: "iPhone 14 Pro Max",
        productTypes: ["iPhone15,3"],
        screenSize: { width: 430, height: 932 },
        passcodeKeypad: {
            columnX: [118,219,316],
            rowY: [307,485,594,707],
        },
        tiktok: {
            profileTab: { x: 387, y: 917 },
            homeTab: { x: 44, y: 913 },
            accountSwitcher: { x: 212, y: 221 },
            create: { x: 220, y: 872 },
            postContent: { x: 214, y: 895 },
            upload: { x: 59, y: 821 },
            selectMultiple: { x: 28, y: 864 },
            useLayout: { x: 28, y: 684 },
            picker: { circleX: 71, columnStep: 144, firstY: 245, trayY: 503, rowStep: 144, cellX: 71, cellStep: 143, cellY: 245 },
            pickerNext: { x: 318, y: 862 },
            editorNext: { x: 318, y: 890 },
            caption: { x: 138, y: 330 },
            keyboardBack: { x: 26, y: 59 },
            draft: { x: 112, y: 881 },
            finish: { x: 318, y: 881 },
            like: { x: 398, y: 485 },
            save: { x: 398, y: 613 },
            followingTab: { x: 174, y: 94 },
            reelsTab: { x: 301, y: 913 },
            searchTab: { x: 128, y: 913 },
            searchField: { x: 214, y: 126 },
            searchFirstResult: { x: 114, y: 307 },
            dmSearchSubmit: { x: 389, y: 126 },
            profileMessage: { x: 321, y: 586 },
            dmCompose: { x: 214, y: 913 },
            composeNewMessage: { x: 401, y: 77 },
            dmComposer: { x: 206, y: 866 },
            dmSend: { x: 401, y: 866 },
            dmBack: { x: 26, y: 59 },
            comment: { x: 396, y: 589 },
            commentComposer: { x: 160, y: 866 },
            commentSend: { x: 389, y: 866 },
            liveClose: { x: 412, y: 66 },
            swipe: { x: 139, startY: 769, endY: 210, durationMs: 380 },
        },
        instagram: {
            profileTab: { x: 387, y: 874 },
            homeTab: { x: 43, y: 874 },
            accountSwitcher: { x: 55, y: 100 },
            create: { x: 220, y: 880 },
            postContent: { x: 80, y: 810 },
            upload: { x: 80, y: 866 },
            selectMultiple: { x: 389, y: 98 },
            useLayout: { x: 214, y: 726 },
            picker: { circleX: 71, columnStep: 143, firstY: 252, trayY: 559, rowStep: 175, cellX: 71, cellStep: 143, cellY: 252 },
            pickerNext: { x: 389, y: 98 },
            editorNext: { x: 372, y: 880 },
            caption: { x: 114, y: 279 },
            keyboardBack: { x: 26, y: 59 },
            draft: { x: 92, y: 98 },
            finish: { x: 389, y: 98 },
            like: { x: 398, y: 478 },
            save: { x: 398, y: 682 },
            followingTab: { x: 253, y: 85 },
            reelsTab: { x: 129, y: 874 },
            searchTab: { x: 301, y: 874 },
            searchField: { x: 214, y: 107 },
            searchFirstResult: { x: 215, y: 245 },
            dmSearchSubmit: { x: 396, y: 107 },
            profileMessage: { x: 321, y: 555 },
            dmCompose: { x: 215, y: 880 },
            composeNewMessage: { x: 404, y: 83 },
            dmComposer: { x: 171, y: 555 },
            dmSend: { x: 385, y: 555 },
            dmBack: { x: 26, y: 59 },
            comment: { x: 398, y: 550 },
            commentComposer: { x: 160, y: 874 },
            commentSend: { x: 389, y: 606 },
            liveClose: { x: 402, y: 98 },
            swipe: { x: 139, startY: 769, endY: 210, durationMs: 380 },
        },
        linkedin: {
            screenSize: { width: 402, height: 874 },
            swipe: { x: 215, startY: 773, endY: 276, durationMs: 450 },
            homeTab: { x: 43, y: 893 },
            networkTab: { x: 129, y: 893 },
            postTab: { x: 215, y: 893 },
            notificationsTab: { x: 301, y: 893 },
            jobsTab: { x: 387, y: 893 },
            meAvatar: { x: 35, y: 75 },
            searchField: { x: 215, y: 75 },
            messaging: { x: 395, y: 75 },
            back: { x: 31, y: 68 },
            keyboardDone: { x: 386, y: 820 },
            firstPost: { x: 215, y: 309 },
            like: { x: 52, y: 605 },
            comment: { x: 130, y: 605 },
            repost: { x: 208, y: 605 },
            send: { x: 285, y: 605 },
            postMore: { x: 395, y: 186 },
            searchPeopleFilter: { x: 77, y: 132 },
            searchFirstResult: { x: 215, y: 243 },
            connect: { x: 215, y: 555 },
            follow: { x: 110, y: 517 },
            message: { x: 276, y: 517 },
            profileMore: { x: 395, y: 517 },
            profileMenu: { x: 395, y: 517 },
            profileAbout: { x: 215, y: 574 },
            addANote: { x: 215, y: 796 },
            sendWithoutNote: { x: 215, y: 855 },
            noteComposer: { x: 215, y: 155 },
            sendInvitation: { x: 215, y: 475 },
            dismissNote: { x: 44, y: 68 },
            invitations: { x: 88, y: 178 },
            grow: { x: 108, y: 127 },
            catchUp: { x: 323, y: 128 },
            manageNetwork: { x: 395, y: 590 },
            peopleYouMayKnow: { x: 215, y: 820 },
            firstPymkCard: { x: 215, y: 398 },
            firstPymkConnect: { x: 362, y: 398 },
            composeMessage: { x: 395, y: 68 },
            inboxSearch: { x: 215, y: 132 },
            threadComposer: { x: 176, y: 862 },
            threadSend: { x: 395, y: 862 },
            threadBack: { x: 31, y: 68 },
            firstNotification: { x: 215, y: 198 },
            jobsSearch: { x: 215, y: 75 },
            firstJob: { x: 215, y: 287 },
            postText: { x: 215, y: 243 },
            postPhoto: { x: 52, y: 839 },
            postSubmit: { x: 386, y: 68 },
            postDismiss: { x: 40, y: 68 },
            viewProfile: { x: 215, y: 221 },
            settings: { x: 395, y: 68 },
        },
    },
    iphone8: {
        displayName: 'iPhone 8',
        productTypes: ['iPhone10,1', 'iPhone10,4'],
        screenSize: { width: 375, height: 667 },
        passcodeKeypad: {
            columnX: [103, 191, 275],
            rowY: [220, 347, 425, 506],
        },
        tiktok: IPHONE8_TIKTOK,
        instagram: IPHONE8_INSTAGRAM,
        linkedin: linkedinForScreen({ width: 375, height: 667 }),
    },
    // Seeded from iphone8 by scaling 375×667 → 375×812 (iPhone X / XS).
    // Temporary fleet unit — prefer one shared model long-term. Recalibrate
    // via the dashboard before relying on automation taps.
    iphoneX: {
        displayName: 'iPhone X/XS',
        productTypes: ['iPhone10,3', 'iPhone10,6', 'iPhone11,2'],
        screenSize: { width: 375, height: 812 },
        passcodeKeypad: {
            columnX: [103, 191, 275],
            rowY: [268, 422, 517, 616],
        },
        tiktok: {
            ...scaleSocial(IPHONE8_TIKTOK, SX_X, SY_X),
            homeTab: { x: 38, y: 791 },
            profileTab: { x: 338, y: 791 },
            create: { x: 187, y: 780 },
        },
        instagram: {
            ...scaleSocial(IPHONE8_INSTAGRAM, SX_X, SY_X),
            homeTab: { x: 37, y: 791 },
            profileTab: { x: 337, y: 791 },
            reelsTab: { x: 262, y: 791 },
            searchTab: { x: 112, y: 791 },
            create: { x: 187, y: 791 },
            dmCompose: { x: 187, y: 791 },
            composeNewMessage: { x: 350, y: 67 },
            searchField: { x: 187, y: 110 },
            searchFirstResult: { x: 100, y: 268 },
            dmSearchSubmit: { x: 340, y: 110 },
            dmComposer: { x: 180, y: 520 },
            dmSend: { x: 350, y: 520 },
            dmBack: { x: 22, y: 51 },
        },
        linkedin: linkedinForScreen({ width: 375, height: 812 }),
    },
    // Seeded from iphone8 by scaling 375×667 → 390×844. Instagram chrome for
    // cold DMs is further adjusted from the calibrated iphone17pro map
    // (same floating-pill era UI). Recalibrate via the dashboard before
    // relying on automation taps in production.
    iphone13: {
        displayName: 'iPhone 13/14',
        productTypes: ['iPhone14,2', 'iPhone14,5', 'iPhone14,7'],
        screenSize: { width: 390, height: 844 },
        passcodeKeypad: {
            columnX: [107, 199, 286],
            rowY: [278, 439, 538, 640],
        },
        tiktok: {
            ...scaleSocial(IPHONE8_TIKTOK, SX_13, SY_13),
            // Naive 8→13 scale lands like/save on avatar/count text. Seed from
            // the calibrated iphone17pro map scaled 402×874 → 390×844.
            like: { x: 362, y: 472 },
            save: { x: 358, y: 596 },
            comment: { x: 359, y: 533 },
            followingTab: { x: 158, y: 85 },
            homeTab: { x: 40, y: 826 },
            // Camera create · bottom-left Recents thumbnail (from live screenshot).
            upload: { x: 52, y: 745 },
            // Full-screen Videos/Recents grid (not the old half-sheet tray).
            picker: {
                ...scaleSocial(IPHONE8_TIKTOK, SX_13, SY_13).picker,
                firstY: 220,
                cellY: 220,
                cellX: 64,
                circleX: 64,
                columnStep: 130,
                rowStep: 130,
            },
            // Full-screen publish form · red Post is top-right (not bottom).
            finish: { x: 350, y: 72 },
            draft: { x: 70, y: 800 },
            // Description text (under cover) — y≈299 lands on "# Hashtags" and seeds "#".
            caption: { x: 145, y: 235 },
            swipe: { x: 126, startY: 696, endY: 190, durationMs: 380 },
        },
        instagram: {
            ...scaleSocial(IPHONE8_INSTAGRAM, SX_13, SY_13),
            // Floating-pill row (~797) — scaled from calibrated 17 Pro (~825).
            homeTab: { x: 39, y: 797 },
            profileTab: { x: 350, y: 823 },
            reelsTab: { x: 129, y: 797 },
            searchTab: { x: 116, y: 797 },
            create: { x: 200, y: 797 },
            followingTab: { x: 70, y: 93 },
            dmCompose: { x: 195, y: 797 },
            composeNewMessage: { x: 367, y: 75 },
            searchField: { x: 194, y: 97 },
            searchFirstResult: { x: 195, y: 222 },
            dmSearchSubmit: { x: 359, y: 97 },
            dmComposer: { x: 155, y: 502 },
            dmSend: { x: 349, y: 502 },
            dmBack: { x: 23, y: 53 },
        },
        linkedin: linkedinForScreen({ width: 390, height: 844 }),
    },
    // Seeded from iphone8 by scaling 375×667 → 402×874. Recalibrate via the
    // dashboard before relying on automation taps in production.
    iphone17pro: {
        displayName: 'iPhone 17 Pro',
        productTypes: ['iPhone18,1'],
        screenSize: { width: 402, height: 874 },
        passcodeKeypad: {
            columnX: [110, 205, 295],
            rowY: [288, 455, 557, 663],
        },
        // Override scaled like/save: naive scale lands on the creator avatar /
        // count text on 402×874. Seeds aim at the heart and bookmark glyphs.
        tiktok: {
            ...scaleSocial(IPHONE8_TIKTOK, SX_17, SY_17),
            like: { x: 372, y: 455 },
            save: { x: 372, y: 575 },
            comment: { x: 370, y: 552 },
            followingTab: { x: 163, y: 88 },
            create: { x: 206, y: 818 },
            // Camera create · bottom-left Recents thumbnail.
            upload: { x: 55, y: 770 },
            // Full-screen Videos/Recents grid (not the old half-sheet tray).
            picker: {
                ...scaleSocial(IPHONE8_TIKTOK, SX_17, SY_17).picker,
                firstY: 230,
                cellY: 230,
                cellX: 66,
                circleX: 66,
                columnStep: 135,
                rowStep: 135,
            },
            liveClose: { x: 385, y: 62 },
            swipe: { x: 130, startY: 721, endY: 197, durationMs: 380 },
        },
        instagram: {
            ...scaleSocial(IPHONE8_INSTAGRAM, SX_17, SY_17),
            followingTab: { x: 72, y: 96 },
            reelsTab: { x: 281, y: 852 },
            // Center Create (+) — same chrome band as calibrated TikTok create.
            create: { x: 206, y: 825 },
            // Create-sheet "Post" tile after + (recalibrate via dashboard).
            postContent: { x: 75, y: 760 },
            // Blue "Next →" on the Reel/post timeline editor (bottom-right).
            editorNext: { x: 348, y: 825 },
            // Reels For You right rail on 402×874 — recalibrate via dashboard.
            like: { x: 372, y: 470 },
            comment: { x: 372, y: 555 },
            save: { x: 372, y: 640 },
            commentComposer: { x: 150, y: 786 },
            commentSend: { x: 364, y: 786 },
            // Cold DMs: inbox → compose → To: search (recalibrate).
            searchTab: { x: 120, y: 852 },
            searchField: { x: 200, y: 100 },
            // Full-width recipient row under To: — tap center of the row, not the avatar edge.
            searchFirstResult: { x: 201, y: 230 },
            // Blue paper-plane / arrow on the right of the To: search field.
            dmSearchSubmit: { x: 370, y: 100 },
            profileMessage: { x: 300, y: 520 },
            // Bottom-nav Messages paper plane — same floating-pill row as Reels (~825).
            dmCompose: { x: 201, y: 825 },
            // Inbox header pencil (top-right) — only valid AFTER inbox is open.
            composeNewMessage: { x: 378, y: 78 },
            // DM "Message..." field above the keyboard (keyboard open).
            dmComposer: { x: 160, y: 520 },
            // "Send" that replaces mic after text is entered.
            dmSend: { x: 360, y: 520 },
            dmBack: { x: 24, y: 55 },
            swipe: { x: 130, startY: 721, endY: 197, durationMs: 380 },
        },
        linkedin: linkedinForScreen({ width: 402, height: 874 }),
    },
} satisfies Record<string, DeviceCoordinates>;

export type CoordinateProfile = keyof typeof DEVICE_COORDINATES;
export type DeviceProfileName = CoordinateProfile;
export const DEFAULT_DEVICE_PROFILE = DEFAULT_COORDINATE_PROFILE;

export interface CoordinateProfileSummary {
    name: CoordinateProfile;
    displayName: string;
    productTypes: readonly string[];
    screenSize: DeviceCoordinates['screenSize'];
}

export function coordinateProfiles(): CoordinateProfileSummary[] {
    return Object.entries(DEVICE_COORDINATES).map(([name, coordinates]) => ({
        name: name as CoordinateProfile,
        displayName: coordinates.displayName,
        productTypes: [...coordinates.productTypes],
        screenSize: { ...coordinates.screenSize },
    }));
}

export function profileForProductType(productType: string | undefined): CoordinateProfile | undefined {
    if (!productType) return;
    return coordinateProfiles().find(({ productTypes }) => productTypes.includes(productType))?.name;
}

export function modelNameForProductType(productType: string | undefined): string | undefined {
    if (!productType) return;
    return coordinateProfiles().find(({ productTypes }) => productTypes.includes(productType))?.displayName;
}

export function coordinatesForProfile(profile: string = DEFAULT_COORDINATE_PROFILE): DeviceCoordinates {
    if (!(profile in DEVICE_COORDINATES)) {
        throw new Error(`Unknown coordinate profile "${profile}". Add it to src/devices/coordinates.ts.`);
    }
    return DEVICE_COORDINATES[profile as CoordinateProfile];
}

// The single-tap targets an operator can re-point from the dashboard.
// (picker grid, swipe vector and the passcode keypad are not single points and
// stay profile-level for now.)
export const CALIBRATABLE_POINTS = [
    'profileTab', 'homeTab', 'accountSwitcher', 'create', 'postContent', 'upload', 'selectMultiple', 'useLayout',
    'pickerNext', 'editorNext', 'caption', 'keyboardBack', 'draft', 'finish', 'like', 'save',
    'followingTab', 'reelsTab', 'searchTab', 'searchField', 'searchFirstResult', 'dmSearchSubmit', 'profileMessage',
    'dmCompose', 'composeNewMessage', 'dmComposer', 'dmSend', 'dmBack', 'comment', 'commentComposer', 'commentSend',
] as const;

export type CalibratablePoint = typeof CALIBRATABLE_POINTS[number];

export const TIKTOK_POINT_LABELS: Record<CalibratablePoint, string> = {
    profileTab: 'TikTok: Profile tab', homeTab: 'TikTok: Home tab', accountSwitcher: 'TikTok: Account switcher',
    create: 'TikTok: Create (+)', postContent: 'TikTok: Post content (unused)', upload: 'TikTok: Upload (camera gallery)', selectMultiple: 'TikTok: Select multiple', useLayout: 'TikTok: Use layout',
    pickerNext: 'TikTok: Media picker · Next', editorNext: 'TikTok: Editor · Next', caption: 'TikTok: Caption field',
    keyboardBack: 'TikTok: Keyboard · back', draft: 'TikTok: Save draft', finish: 'TikTok: Post / Finish',
    like: 'TikTok: Like button', save: 'TikTok: Save/bookmark button',
    followingTab: 'TikTok: Following tab', reelsTab: 'TikTok: Reels tab',
    searchTab: 'TikTok: Search tab (unused)', searchField: 'TikTok: Search field (unused)',
    searchFirstResult: 'TikTok: Search result (unused)', dmSearchSubmit: 'TikTok: DM search submit (unused)',
    profileMessage: 'TikTok: Message (unused)',
    dmCompose: 'TikTok: DM Compose (unused)', composeNewMessage: 'TikTok: Compose new message (unused)',
    dmComposer: 'TikTok: DM composer (unused)', dmSend: 'TikTok: DM send (unused)', dmBack: 'TikTok: DM back (unused)',
    comment: 'TikTok: Comment button',
    commentComposer: 'TikTok: Comment text field', commentSend: 'TikTok: Comment send',
};

export const INSTAGRAM_POINT_LABELS: Record<CalibratablePoint, string> = {
    profileTab: 'Instagram: Profile tab', homeTab: 'Instagram: Home tab', accountSwitcher: 'Instagram: Account switcher',
    create: 'Instagram: Create (+)', postContent: 'Instagram: Post content button', upload: 'Instagram: Post from gallery', selectMultiple: 'Instagram: Select multiple',
    useLayout: 'Instagram: Use layout',
    pickerNext: 'Instagram: Media picker · Next', editorNext: 'Instagram: Timeline editor · Next', caption: 'Instagram: Caption field',
    keyboardBack: 'Instagram: Keyboard · back', draft: 'Instagram: Save draft', finish: 'Instagram: Share / Finish',
    like: 'Instagram: Like button', save: 'Instagram: Save/bookmark button',
    followingTab: 'Instagram: Following tab', reelsTab: 'Instagram: Reels tab',
    searchTab: 'Instagram: Search tab', searchField: 'Instagram: Search field',
    searchFirstResult: 'Instagram: New message · top result',
    dmSearchSubmit: 'Instagram: New message · blue arrow',
    profileMessage: 'Instagram: Profile · Message',
    dmCompose: 'Instagram: DM Compose', composeNewMessage: 'Instagram: Compose new message',
    dmComposer: 'Instagram: DM · Message field', dmSend: 'Instagram: DM · Send', dmBack: 'Instagram: DM · Back',
    comment: 'Instagram: Comment button',
    commentComposer: 'Instagram: Comment text field', commentSend: 'Instagram: Comment send',
};

/** @deprecated Prefer TIKTOK_POINT_LABELS or labelsForApp() */
export const POINT_LABELS = TIKTOK_POINT_LABELS;

export function calibratablePointsForApp(app: CalibrateApp): readonly string[] {
    return app === 'linkedin' ? LINKEDIN_CALIBRATABLE_POINTS : CALIBRATABLE_POINTS;
}

export function labelsForApp(app: CalibrateApp): Record<string, string> {
    if (app === 'linkedin') return LINKEDIN_POINT_LABELS;
    return app === 'instagram' ? INSTAGRAM_POINT_LABELS : TIKTOK_POINT_LABELS;
}

export function coordinateOverridesForDevice(
    device: {
        coordinates?: DeviceCoordinateOverrides;
        instagramCoordinates?: DeviceCoordinateOverrides;
        linkedinCoordinates?: DeviceCoordinateOverrides;
    },
    app: CalibrateApp,
): DeviceCoordinateOverrides | undefined {
    if (app === 'instagram') return device.instagramCoordinates;
    if (app === 'linkedin') return device.linkedinCoordinates;
    return device.coordinates;
}

/** Per-device overrides for the calibratable points, stored on the devices.json entry. */
export type DeviceCoordinateOverrides = Partial<Record<CalibratablePoint | LinkedInCalibratablePoint, Point>>;

/** The profile's coordinates with any per-device single-tap overrides applied. */
export function resolveDeviceCoordinates(
    profile: string | undefined,
    overrides: DeviceCoordinateOverrides | undefined,
    app: CalibrateApp = 'tiktok',
): DeviceCoordinates {
    const base = coordinatesForProfile(profile);
    if (!overrides) return base;
    if (app === 'linkedin') {
        const appCoords = { ...base.linkedin };
        for (const name of LINKEDIN_CALIBRATABLE_POINTS) {
            const point = overrides[name];
            if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
                appCoords[name] = { x: Math.round(point.x), y: Math.round(point.y) };
            }
        }
        return { ...base, linkedin: appCoords };
    }
    const appCoords = { ...base[app] };
    for (const name of CALIBRATABLE_POINTS) {
        const point = overrides[name];
        if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
            appCoords[name] = { x: Math.round(point.x), y: Math.round(point.y) };
        }
    }
    return { ...base, [app]: appCoords };
}

/** Validate an override map: known keys only, integer points within the profile's screen. */
export function validateCoordinateOverrides(
    value: unknown,
    profile: string | undefined,
    app: CalibrateApp = 'tiktok',
): DeviceCoordinateOverrides {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('coordinates must be an object');
    const { width, height } = coordinatesForProfile(profile).screenSize;
    const allowed = app === 'linkedin' ? LINKEDIN_CALIBRATABLE_POINTS : CALIBRATABLE_POINTS;
    const result: DeviceCoordinateOverrides = {};
    for (const [key, point] of Object.entries(value as Record<string, unknown>)) {
        if (!(allowed as readonly string[]).includes(key)) throw new Error(`Unknown calibratable point "${key}"`);
        if (!point || typeof point !== 'object') throw new Error(`${key} must be a {x, y} point`);
        const { x, y } = point as { x: unknown; y: unknown };
        if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y)) {
            throw new Error(`${key} x and y must be numbers`);
        }
        if (x < 0 || y < 0 || x > width || y > height) {
            throw new Error(`${key} (${x}, ${y}) is outside the ${width}×${height} screen`);
        }
        result[key as CalibratablePoint | LinkedInCalibratablePoint] = { x: Math.round(x), y: Math.round(y) };
    }
    return result;
}

export function parseSocialApp(value: unknown): CalibrateApp {
    if (value === 'instagram' || value === 'linkedin') return value;
    return 'tiktok';
}

export function parseCalibrateApp(value: unknown): CalibrateApp {
    return parseSocialApp(value);
}
