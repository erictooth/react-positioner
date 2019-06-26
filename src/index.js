// @flow

import * as React from "react";
import { Portal } from "reakit/Portal";
import getPosition, { Position, type PositionEnum } from "./getPosition";

const defaultProps = {
    bodyOffset: 6,
    position: Position.BOTTOM,
    targetOffset: 6,
};

const defaultStyle = {
    position: "fixed",
};

const getStyle = (targetRef, positionedRef, { position, targetOffset, bodyOffset }) => {
    if (!targetRef.current || !positionedRef.current) {
        return defaultStyle;
    }

    const targetRect = targetRef.current.getBoundingClientRect();
    const positionedRect = positionedRef.current.getBoundingClientRect();

    const {
        rect: { top, left },
        transformOrigin,
    } = getPosition({
        position,
        targetOffset,
        viewportOffset: bodyOffset,
        targetRect,
        dimensions: positionedRect,
        viewport: {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        },
    });

    return {
        ...defaultStyle,
        left: Math.round(left),
        top: Math.round(top),
        transformOrigin,
    };
};

export function usePositionedStyle(
    { position, targetOffset, bodyOffset } = defaultProps,
    dependencies = []
) {
    const latestAnimationFrame = React.useRef(null);
    const targetRef = React.useRef(null);
    const positionedRef = React.useRef(null);

    const [style, setStyle] = React.useState(defaultStyle);

    const update = () => {
        if (!targetRef.current || !positionedRef.current) {
            setStyle(defaultStyle);
        }

        const nextStyle = getStyle(targetRef, positionedRef, {
            position,
            targetOffset,
            bodyOffset,
        });

        setStyle(nextStyle);

        latestAnimationFrame.current = requestAnimationFrame(() => {
            update();
        });
    };

    React.useLayoutEffect(() => {
        update();

        return () => {
            if (latestAnimationFrame.current) {
                cancelAnimationFrame(latestAnimationFrame.current);
            }
        };
    }, [position, targetOffset, bodyOffset, ...dependencies]);

    return { style, targetRef, positionedRef };
}

type Props = {
    /**
     * The position of the element. Can be one of the following: top, top-left, top-right
     * bottom, bottom-left, bottom-right, left, or right.
     */
    position: PositionEnum,

    /**
     * The distance from the target element in pixels.
     */
    targetOffset: number,

    /**
     * Distance from the edge of the screen.
     */
    bodyOffset: number,

    /**
     * Tell the positioner if the element is shown or not.
     * Great when you want to use with a tooltip or some other
     * popup container.
     */
    isShown: boolean,

    /**
     * The root element to mount the positioned container to.
     */
    children: React.Element<any>,

    /**
     * The content of the positioned container.
     */
    content: React.Element<any>,
};

function Positioner(props: Props) {
    const { style, targetRef, positionedRef } = usePositionedStyle(
        {
            position: props.position,
            targetOffset: props.targetOffset,
            bodyOffset: props.bodyOffset,
        },
        [props.isShown]
    );

    return (
        <>
            {React.cloneElement(props.children, {
                ref: (node) => {
                    targetRef.current = node;
                    const { ref } = props.children;
                    if (typeof ref === "function") {
                        ref(node);
                    } else if (typeof ref === "object" && ref.hasOwnProperty("current")) {
                        ref.current = node;
                    }
                },
            })}
            {props.isShown ? (
                <Portal>
                    {React.cloneElement(props.content, {
                        style,
                        ref: positionedRef,
                    })}
                </Portal>
            ) : null}
        </>
    );
}

Positioner.defaultProps = defaultProps;

export default Positioner;
