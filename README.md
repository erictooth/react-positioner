react-positioner
================

A small utility component that positions a container relative to a root.

Example Usage:
```jsx
import Positioner from "react-positioner";

function Tooltip({ position, content, children, ...rest }) {
    return (
        <Positione {...rest}
            content={
                <span className={`tooltip tooltip--${position}`}>
                    {content}
                </span>
            }
            isShown={visible}
            position={position}>
            {children}
        </Positioner>
    )
}
```

### Props
| Prop         | Type                                                                                            | Required | Default Value | Description                                                                                                                   |
|--------------|-------------------------------------------------------------------------------------------------|----------|---------------|-------------------------------------------------------------------------------------------------------------------------------|
| position     | "top" \| "left" \| "right" \| "top-left" \| "top-right" \| "bottom" \| "bottom-left" \| "bottom-right" | Yes      |               | The position of the container relative to the target element                                                                  |
| targetOffset | number                                                                                          | No       |               | The distance from the target element in pixels.                                                                               |
| bodyOffset   | number                                                                                          | No       |               | Distance from the edge of the screen.                                                                                         |
| isShown      | boolean                                                                                         | Yes      |               | Tell the positioner if the element is shown or not. Great when you want to use with a tooltip or some other, popup container. |
| children     | React.Node                                                                                      | Yes      |               | The target element of the positioned container                                                                                |
| content      | React.Node                                                                                      | Yes      |               | The content inside the positioned container                                                                                   |
