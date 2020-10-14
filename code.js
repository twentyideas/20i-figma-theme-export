// This plugin will open a window to prompt the user generate styles for a 20i styled components theme
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
    height: 600,
    width: 800,
});
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === `styles`) {
        const textStyles = figma.getLocalTextStyles();
        const paintStyles = figma.getLocalPaintStyles(); // name: "Tablet / Heading 2 / Bold"
        const flatList = paintStyles.map((val) => {
            const name = val.name.split("/ ").join("").split(" ").join("-").toLowerCase(); // converting names from "Primary 1 / 100" => "primary-1-100"
            const paint = val.paints[0]; // only ever one paint for some reason :shrug:
            // only accounts for solid colors as opposed to gradients, etc
            if (paint.type === "SOLID") {
                const { r, g, b } = paint.color;
                const newColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${Math.round(paint.opacity)})`;
                return { [name]: newColor };
            }
        });
        // Named in figma: "<< primary >>-1-100"
        const keys = ["primary", "secondary", "accent", "neutral"];
        // Correspond to index of how the color is defined: "primary-<< 1 >>-100"
        const classes = ["main", "dark", "light", "contrast"];
        const colorMap = flatList.reduce((all, curr) => {
            // Break apart the flatList item
            const [colorName, colorStr] = Object.entries(curr)[0];
            // --"primary----------1----------100"
            const [colorKey, colorClassIdx, opacity] = colorName.split("-");
            // if colorKey is actually in the keys array, then build out the object
            keys.forEach((key) => {
                var _a;
                if (key === colorKey) {
                    all[key] = Object.assign(Object.assign({}, all[key]), { [classes[Number(colorClassIdx) - 1]]: Object.assign(Object.assign({}, (_a = all[key]) === null || _a === void 0 ? void 0 : _a[classes[Number(colorClassIdx) - 1]]), { [opacity]: colorStr }) });
                }
            });
            return all;
        }, {});
        // post results to the Figma UI to copy/paste from
        figma.ui.postMessage(JSON.stringify(colorMap, null, 2));
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    if (msg.type === "cancel") {
        figma.closePlugin();
    }
};
