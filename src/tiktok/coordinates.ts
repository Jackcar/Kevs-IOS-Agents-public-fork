export interface Point { x: number; y: number }
export interface TikTokCoordinates {
    passcodeKeypad: { columnX: [number, number, number]; rowY: [number, number, number, number] };
    tiktok: {
        profileTab: Point; homeTab: Point; accountSwitcher: Point; create: Point; postContent: Point; upload: Point;
        selectMultiple: Point; useLayout: Point;
        picker: { circleX: number; columnStep: number; firstY: number; trayY: number; rowStep: number; cellX: number; cellStep: number; cellY: number };
        pickerNext: Point; editorNext: Point; caption: Point; keyboardBack: Point; draft: Point; finish: Point;
        like: Point; save: Point; followingTab: Point; comment: Point; commentComposer: Point; commentSend: Point;
        liveClose: Point;
        swipe: { x: number; startY: number; endY: number; durationMs: number };
    };
}

export const DEVICE_COORDINATES = {
    // ponytail: scaled seed; calibrate workflow targets on the physical device.
    iphone16promax: {
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
            comment: { x: 405, y: 604 },
            commentComposer: { x: 164, y: 888 },
            commentSend: { x: 398, y: 888 },
            liveClose: { x: 422, y: 68 },
            swipe: { x: 142, startY: 789, endY: 215, durationMs: 380 }
        }
    },
    // Seeded from the iPhone 17 Pro layout; calibrate workflow targets on-device.
    iphone14promax: {
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
            comment: { x: 396, y: 589 },
            commentComposer: { x: 160, y: 866 },
            commentSend: { x: 389, y: 866 },
            liveClose: { x: 412, y: 66 },
            swipe: { x: 139, startY: 769, endY: 210, durationMs: 380 },
        },
    },
    iphone8: {
        passcodeKeypad: { columnX: [103, 191, 275], rowY: [220, 347, 425, 506] },
        tiktok: {
            profileTab: { x: 338, y: 656 }, homeTab: { x: 38, y: 653 }, accountSwitcher: { x: 185, y: 158 },
            create: { x: 187, y: 640 }, postContent: { x: 187, y: 640 }, upload: { x: 48, y: 590 }, selectMultiple: { x: 24, y: 618 },
            useLayout: { x: 24, y: 489 },
            picker: { circleX: 106, columnStep: 126, firstY: 482, trayY: 360, rowStep: 125, cellX: 62, cellStep: 125, cellY: 526 },
            pickerNext: { x: 277, y: 617 }, editorNext: { x: 277, y: 637 }, caption: { x: 120, y: 236 },
            keyboardBack: { x: 22, y: 42 }, draft: { x: 98, y: 630 }, finish: { x: 277, y: 630 },
            like: { x: 345, y: 313 }, save: { x: 345, y: 444 },
            followingTab: { x: 95, y: 78 }, comment: { x: 345, y: 378 },
            commentComposer: { x: 140, y: 620 }, commentSend: { x: 340, y: 620 },
            liveClose: { x: 351, y: 70 },
            swipe: { x: 187, startY: 550, endY: 150, durationMs: 450 },
        },
    },
    // Keep in sync with src/devices/coordinates.ts (scaled seed for 375×812).
    iphoneX: {
        passcodeKeypad: { columnX: [103, 191, 275], rowY: [268, 422, 517, 616] },
        tiktok: {
            profileTab: { x: 338, y: 791 }, homeTab: { x: 38, y: 791 }, accountSwitcher: { x: 185, y: 192 },
            create: { x: 187, y: 780 }, postContent: { x: 187, y: 779 }, upload: { x: 48, y: 718 }, selectMultiple: { x: 24, y: 752 },
            useLayout: { x: 24, y: 595 },
            picker: { circleX: 106, columnStep: 126, firstY: 587, trayY: 438, rowStep: 152, cellX: 62, cellStep: 125, cellY: 640 },
            pickerNext: { x: 277, y: 751 }, editorNext: { x: 277, y: 775 }, caption: { x: 120, y: 287 },
            keyboardBack: { x: 22, y: 51 }, draft: { x: 98, y: 767 }, finish: { x: 277, y: 767 },
            like: { x: 345, y: 381 }, save: { x: 345, y: 541 },
            followingTab: { x: 95, y: 95 }, comment: { x: 345, y: 460 },
            commentComposer: { x: 140, y: 755 }, commentSend: { x: 340, y: 755 },
            liveClose: { x: 351, y: 85 },
            swipe: { x: 187, startY: 670, endY: 183, durationMs: 450 },
        },
    },
    // Keep in sync with src/devices/coordinates.ts (scaled seed for 390×844).
    iphone13: {
        passcodeKeypad: { columnX: [107, 199, 286], rowY: [278, 439, 538, 640] },
        tiktok: {
            profileTab: { x: 352, y: 830 }, homeTab: { x: 40, y: 826 }, accountSwitcher: { x: 192, y: 200 },
            create: { x: 194, y: 810 }, postContent: { x: 194, y: 810 }, upload: { x: 52, y: 745 }, selectMultiple: { x: 25, y: 782 },
            useLayout: { x: 25, y: 619 },
            picker: { circleX: 64, columnStep: 130, firstY: 220, trayY: 456, rowStep: 130, cellX: 64, cellStep: 130, cellY: 220 },
            pickerNext: { x: 288, y: 781 }, editorNext: { x: 288, y: 806 }, caption: { x: 145, y: 235 },
            keyboardBack: { x: 23, y: 53 }, draft: { x: 70, y: 800 }, finish: { x: 350, y: 72 },
            like: { x: 359, y: 396 }, save: { x: 359, y: 562 },
            followingTab: { x: 99, y: 99 }, comment: { x: 359, y: 478 },
            commentComposer: { x: 146, y: 785 }, commentSend: { x: 354, y: 785 },
            liveClose: { x: 365, y: 89 },
            swipe: { x: 194, startY: 696, endY: 190, durationMs: 450 },
        },
    },
    // Keep in sync with src/devices/coordinates.ts (scaled seed for 402×874).
    iphone17pro: {
        passcodeKeypad: { columnX: [110, 205, 295], rowY: [288, 455, 557, 663] },
        tiktok: {
            profileTab: { x: 362, y: 860 }, homeTab: { x: 41, y: 856 }, accountSwitcher: { x: 198, y: 207 },
            create: { x: 206, y: 818 }, postContent: { x: 206, y: 818 }, upload: { x: 55, y: 770 }, selectMultiple: { x: 26, y: 810 },
            useLayout: { x: 26, y: 641 },
            picker: { circleX: 66, columnStep: 135, firstY: 230, trayY: 472, rowStep: 135, cellX: 66, cellStep: 135, cellY: 230 },
            pickerNext: { x: 297, y: 809 }, editorNext: { x: 297, y: 835 }, caption: { x: 129, y: 309 },
            keyboardBack: { x: 24, y: 55 }, draft: { x: 105, y: 826 }, finish: { x: 297, y: 826 },
            like: { x: 372, y: 455 }, save: { x: 372, y: 575 },
            followingTab: { x: 163, y: 88 }, comment: { x: 370, y: 552 },
            commentComposer: { x: 150, y: 812 }, commentSend: { x: 364, y: 812 },
            liveClose: { x: 385, y: 62 },
            swipe: { x: 130, startY: 721, endY: 197, durationMs: 380 },
        },
    },
} satisfies Record<string, TikTokCoordinates>;

export type CoordinateProfile = keyof typeof DEVICE_COORDINATES;
export function coordinatesForProfile(profile = 'iphone8'): TikTokCoordinates {
    if (!(profile in DEVICE_COORDINATES)) throw new Error(`Unknown TikTok coordinate profile "${profile}"`);
    return DEVICE_COORDINATES[profile as CoordinateProfile];
}
