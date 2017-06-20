import { trigger, state, style, transition, animate, keyframes } from "@angular/core";

/**
 * Animation Slide_LTR_RTL. 
 * LTR = Left to Right
 * RTL = Right to left
 * 
 * Animated element slides in from left and goes out from screen to left
 * 
 * Usage:
 * 
 * <div [@Slide_LTR_RTL]="'in'"></div>
 */
export const Slide_LTR_RTL_Trigger = trigger("Slide_LTR_RTL", [
    state("in", style({ transform: "translateX(0%)" })),
    state("out", style({ transform: "translateX(-100%)" })),
    transition("void => in", [
        style({ transform: "translateX(-100%)" }),
        animate("300ms ease-in", style({ transform: "translateX(0%)" }))
    ]),
    transition("in => out", [
        animate("300ms ease-in", style({ transform: "translateX(-100%)" }))
    ])
]);