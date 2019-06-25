import React from "react";

import { storiesOf } from "@storybook/react";

import Positioner from "../src/Positioner.js";

const popoverContent = (
    <span>
        <span style={{ backgroundColor: "#333", color: "#eee", padding: "0.5rem" }}>
            Lorem ipsum dolor sit amet
        </span>
    </span>
);

storiesOf("Positioner", module).add("default", () => {
    return (
        <div style={{ position: "absolute", top: "50%", left: "50%" }}>
            <Positioner content={popoverContent} isShown={true} position="right">
                <button>Trigger</button>
            </Positioner>
        </div>
    );
});
